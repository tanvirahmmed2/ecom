import { query } from '@/lib/db';
import pool from '@/lib/db';
import { authenticateUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');

    let sql = `
      SELECT o.*, c.name AS customer_name, c.email AS customer_email,
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
    `;
    let params = [];

    if (status) {
      sql += ' WHERE o.status = $1';
      params.push(status);
    }

    sql += ' ORDER BY o.order_id DESC';

    const result = await query(sql, params);
    return Response.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  const client = await pool.connect();
  try {
    const {
      name,
      phone,
      email,
      shipping_address,
      shipping_city,
      shipping_area,
      note,
      items
    } = await req.json();

    if (!phone || !shipping_address || !items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ error: 'Phone, shipping address, and items are required' }, { status: 400 });
    }

    // Optional: Get logged in user if any
    const auth = await authenticateUser();
    const userId = auth.success ? auth.user.user_id : null;

    // Start Transaction
    await client.query('BEGIN');

    // 1. Customer profile upsert
    let customerId = null;
    const cleanPhone = phone.trim();
    const cleanName = name ? name.trim() : 'Guest Customer';
    const cleanEmail = email ? email.trim() : null;
    const cleanAddr = shipping_address.trim();

    const checkCust = await client.query('SELECT customer_id FROM customers WHERE phone = $1', [cleanPhone]);
    if (checkCust.rows.length > 0) {
      customerId = checkCust.rows[0].customer_id;
      // Update name/address/email if they were blank before or we have new values
      await client.query(
        `UPDATE customers 
         SET name = COALESCE($1, name), email = COALESCE($2, email), address = COALESCE($3, address)
         WHERE customer_id = $4`,
        [cleanName, cleanEmail, cleanAddr, customerId]
      );
    } else {
      const newCust = await client.query(
        `INSERT INTO customers (name, phone, email, address)
         VALUES ($1, $2, $3, $4)
         RETURNING customer_id`,
        [cleanName, cleanPhone, cleanEmail, cleanAddr]
      );
      customerId = newCust.rows[0].customer_id;
    }

    // 2. Server-side price verification and stock checks
    let subtotal = 0;
    let totalDiscount = 0;
    const verifiedItems = [];

    for (const item of items) {
      if (item.variant_id) {
        // Variant item details lookup
        const varRes = await client.query(
          `SELECT v.price, v.stock, p.name, p.product_id
           FROM product_variants v
           JOIN products p ON v.product_id = p.product_id
           WHERE v.variant_id = $1`,
          [item.variant_id]
        );
        if (varRes.rows.length === 0) {
          throw new Error(`Variant ID ${item.variant_id} not found`);
        }
        const dbVar = varRes.rows[0];
        if (parseInt(dbVar.stock, 10) < item.quantity) {
          throw new Error(`Insufficient stock for variant "${dbVar.name}"`);
        }
        const itemPrice = parseFloat(dbVar.price);
        subtotal += itemPrice * item.quantity;
        verifiedItems.push({
          product_id: dbVar.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: itemPrice
        });
      } else {
        // Simple item details lookup
        const prodRes = await client.query(
          `SELECT sale_price, discount_price, stock, name
           FROM products
           WHERE product_id = $1`,
          [item.product_id]
        );
        if (prodRes.rows.length === 0) {
          throw new Error(`Product ID ${item.product_id} not found`);
        }
        const dbProd = prodRes.rows[0];
        if (parseInt(dbProd.stock, 10) < item.quantity) {
          throw new Error(`Insufficient stock for product "${dbProd.name}"`);
        }
        
        const salePrice = parseFloat(dbProd.sale_price);
        const discountAmt = parseFloat(dbProd.discount_price || 0);
        const finalPrice = Math.max(0, salePrice - discountAmt);

        subtotal += finalPrice * item.quantity;
        totalDiscount += discountAmt * item.quantity;

        verifiedItems.push({
          product_id: item.product_id,
          variant_id: null,
          quantity: item.quantity,
          price: finalPrice
        });
      }
    }

    // Calculate delivery charge (70 BDT in Dhaka, 130 BDT everywhere else)
    const isDhaka = shipping_city && shipping_city.trim().toLowerCase() === 'dhaka';
    const deliveryCharge = isDhaka ? 70 : 130;
    const totalAmount = subtotal + deliveryCharge;

    // 3. Create order
    const orderRes = await client.query(
      `INSERT INTO public.orders (
        customer_id, phone, shipping_address, shipping_city, shipping_area,
        status, subtotal_amount, total_discount_amount, delivery_charge,
        total_amount, due_amount, payment_type, note
      ) VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7, $8, $9, $10, 'cod', $11)
       RETURNING order_id`,
      [
        customerId,
        cleanPhone,
        cleanAddr,
        shipping_city || 'Dhaka',
        shipping_area || '',
        subtotal,
        totalDiscount,
        deliveryCharge,
        totalAmount,
        totalAmount, // COD has full due amount until paid on delivery
        note || null
      ]
    );
    const orderId = orderRes.rows[0].order_id;

    // 4. Create order items (DO NOT decrement stock here - only on confirm/delivery)
    for (const vItem of verifiedItems) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, variant_id, quantity, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [orderId, vItem.product_id, vItem.variant_id, vItem.quantity, vItem.price]
      );
    }

    // Commit Transaction
    await client.query('COMMIT');

    return Response.json({
      message: 'Order placed successfully!',
      order_id: orderId,
      total_amount: totalAmount
    }, { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Order creation transaction failed:', error);
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  } finally {
    client.release();
  }
}
