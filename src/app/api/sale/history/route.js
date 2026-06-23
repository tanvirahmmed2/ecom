import { query } from '@/lib/db';
import { authenticateUser } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = await authenticateUser();
    if (!auth.success || !auth.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userPhone = auth.user.phone;
    if (!userPhone) {
      return Response.json([], { status: 200 });
    }

    const result = await query(
      `SELECT o.*, 
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
       WHERE o.phone = $1
       ORDER BY o.order_id DESC`,
      [userPhone]
    );

    return Response.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching customer order history:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
