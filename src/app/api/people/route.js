import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export async function GET(req) {
  try {
    const auth = await isAdmin();
    if (!auth.success) {
      return Response.json({ error: auth.message }, { status: 403 });
    }

    const result = await query(`
      SELECT user_id, name, email, phone, role, is_active, is_varified, is_banned, created_at 
      FROM users 
      ORDER BY user_id ASC
    `);

    return Response.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
