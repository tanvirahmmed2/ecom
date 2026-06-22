import { query } from '@/lib/db';

export async function GET(req) {
  try {
    const result = await query(`
      SELECT p.*, c.name AS category_name, b.name AS brand_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      ORDER BY p.product_id DESC 
      LIMIT 10
    `);
    return Response.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching latest products:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
