import { query } from '@/lib/db';
import { isManagementRole } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = await isManagementRole();
    if (!auth.success) {
      return Response.json({ error: auth.message }, { status: 403 });
    }

    const catResult = await query('SELECT COUNT(*)::int AS count FROM categories');
    const brandResult = await query('SELECT COUNT(*)::int AS count FROM brands');
    const prodResult = await query('SELECT COUNT(*)::int AS count FROM products');
    const userResult = await query('SELECT COUNT(*)::int AS count FROM users');
    const orderResult = await query('SELECT COUNT(*)::int AS count FROM orders');
    const revenueResult = await query("SELECT COALESCE(SUM(total_amount), 0)::float AS total FROM orders WHERE status != 'cancelled'");
    const pendingResult = await query("SELECT COUNT(*)::int AS count FROM orders WHERE status = 'pending'");

    return Response.json({
      categories: catResult.rows[0].count,
      brands: brandResult.rows[0].count,
      products: prodResult.rows[0].count,
      users: userResult.rows[0].count,
      orders: orderResult.rows[0].count,
      revenue: revenueResult.rows[0].total,
      pendingOrders: pendingResult.rows[0].count,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

