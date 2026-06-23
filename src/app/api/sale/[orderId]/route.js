import { query } from '@/lib/db';
import pool from '@/lib/db';
import { authenticateUser } from '@/lib/auth';

export async function GET(req, { params }) {
  try {
    const { orderId } = await params;
    const orderRes = await query(
      `SELECT o.*, c.name AS customer_name, c.phone AS customer_phone, c.email AS customer_email,
              (SELECT JSON_AGG(JSON_BUILD_OBJECT(
                 'order_item_id', oi.order_item_id,
                 'product_id', oi.product_id,
                 'variant_id', oi.variant_id,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'product_name', p.name,
                 'product_image', p.image,
                 'variant_name', pv.variant_name
              )) FROM order_items oi
              JOIN products p ON oi.product_id = p.product_id
              LEFT JOIN product_variants pv ON oi.variant_id = pv.variant_id
              WHERE oi.order_id = o.order_id) AS items
       FROM public.orders o
       LEFT JOIN customers c ON o.customer_id = c.customer_id
       WHERE o.order_id = $1`,
      [orderId]
    );

    if (orderRes.rows.length === 0) {
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    return Response.json(orderRes.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching order details:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  const client = await pool.connect();
  try {
    const { orderId } = await params;
    const { status, courier_name, courier_tracking_id } = await req.json();

    const allowedStatuses = [
      'pending', 'confirmed', 'processing', 'shipped', 
      'out_for_delivery', 'delivered', 'cancelled', 
      'returned', 'failed'
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return Response.json({ error: 'Invalid or missing status value' }, { status: 400 });
    }

    // Start Transaction
    await client.query('BEGIN');

    // 1. Fetch current order details
    const orderRes = await client.query(
      `SELECT status, total_amount, due_amount FROM public.orders WHERE order_id = $1 FOR UPDATE`,
      [orderId]
    );

    if (orderRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return Response.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orderRes.rows[0];
    const oldStatus = order.status;
    const newStatus = status;

    if (oldStatus === newStatus) {
      await client.query('COMMIT');
      return Response.json({ message: 'Status is already updated to ' + newStatus }, { status: 200 });
    }

    // Helper functions for stock adjustments
    const deductStock = async () => {
      const itemsRes = await client.query(
        `SELECT product_id, variant_id, quantity FROM order_items WHERE order_id = $1`,
        [orderId]
      );
      for (const item of itemsRes.rows) {
        if (item.variant_id) {
          const updateRes = await client.query(
            `UPDATE product_variants 
             SET stock = stock - $1 
             WHERE variant_id = $2 
             RETURNING stock, variant_name`,
            [item.quantity, item.variant_id]
          );
          if (updateRes.rows.length > 0 && updateRes.rows[0].stock < 0) {
            throw new Error(`Insufficient stock for variant "${updateRes.rows[0].variant_name}"`);
          }
        } else {
          const updateRes = await client.query(
            `UPDATE products 
             SET stock = stock - $1 
             WHERE product_id = $2 
             RETURNING stock, name`,
            [item.quantity, item.product_id]
          );
          if (updateRes.rows.length > 0 && updateRes.rows[0].stock < 0) {
            throw new Error(`Insufficient stock for product "${updateRes.rows[0].name}"`);
          }
        }
      }
    };

    const addStockBack = async () => {
      const itemsRes = await client.query(
        `SELECT product_id, variant_id, quantity FROM order_items WHERE order_id = $1`,
        [orderId]
      );
      for (const item of itemsRes.rows) {
        if (item.variant_id) {
          await client.query(
            `UPDATE product_variants 
             SET stock = stock + $1 
             WHERE variant_id = $2`,
            [item.quantity, item.variant_id]
          );
        } else {
          await client.query(
            `UPDATE products 
             SET stock = stock + $1 
             WHERE product_id = $2`,
            [item.quantity, item.product_id]
          );
        }
      }
    };

    // State machine logic
    let stockWasReduced = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].includes(oldStatus);
    let stockShouldBeReduced = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'].includes(newStatus);

    // If transitioning from un-reduced state to reduced state: deduct stock
    if (!stockWasReduced && stockShouldBeReduced) {
      await deductStock();
    }

    // If transitioning from reduced state to un-reduced state (e.g. cancelled/returned): add stock back
    if (stockWasReduced && !stockShouldBeReduced) {
      await addStockBack();
    }

    // Special behavior for returns (re-stock if it was reduced before)
    if (newStatus === 'returned' && stockWasReduced) {
      await addStockBack();
      // Ensure stockShouldBeReduced is noted as false so we don't double count
      stockShouldBeReduced = false;
    }

    // Payment registration on delivery
    let updateDueAmount = order.due_amount;
    if (newStatus === 'delivered') {
      // Create payment log if not exists
      const payRes = await client.query(
        `SELECT payment_id FROM public.payments WHERE order_id = $1 AND payment_status = 'completed'`,
        [orderId]
      );
      if (payRes.rows.length === 0) {
        await client.query(
          `INSERT INTO public.payments (order_id, payment_method, amount, amount_received, change_amount, payment_status, note)
           VALUES ($1, 'cod', $2, $2, 0, 'completed', 'COD payment received on delivery')`,
          [orderId, order.total_amount]
        );
      }
      updateDueAmount = 0; // fully paid
    }

    // Update order status and courier info
    await client.query(
      `UPDATE public.orders 
       SET status = $1, 
           due_amount = $2, 
           courier_name = CASE WHEN $3::text IS NOT NULL THEN $3 ELSE courier_name END,
           courier_tracking_id = CASE WHEN $4::text IS NOT NULL THEN $4 ELSE courier_tracking_id END,
           updated_at = NOW() 
       WHERE order_id = $5`,
      [newStatus, updateDueAmount, courier_name || null, courier_tracking_id || null, orderId]
    );

    await client.query('COMMIT');
    return Response.json({ message: 'Order status updated successfully' }, { status: 200 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Order status update failed:', error);
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
