import { query } from '@/lib/db';
import { isManager } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = await isManager();
    if (!auth.success) {
      return Response.json({ error: auth.message }, { status: 403 });
    }

    const catResult = await query('SELECT COUNT(*)::int AS count FROM categories');
    const brandResult = await query('SELECT COUNT(*)::int AS count FROM brands');
    const prodResult = await query('SELECT COUNT(*)::int AS count FROM products');

    return Response.json({
      categories: catResult.rows[0].count,
      brands: brandResult.rows[0].count,
      products: prodResult.rows[0].count,
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
