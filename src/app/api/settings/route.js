import { query } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function GET(req) {
  try {
    const result = await query('SELECT * FROM websites ORDER BY website_id ASC LIMIT 1');
    if (result.rows.length === 0) {
      return Response.json({}, { status: 200 });
    }
    return Response.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching website settings:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    // Restrict to Admin role
    const auth = await isAdmin();
    if (!auth.success) {
      return Response.json({ error: auth.message }, { status: 403 });
    }

    const formData = await req.formData();
    const name = formData.get('name') || '';
    const theme_color = formData.get('theme_color') || '#10b981'; // default emerald
    const hero_title = formData.get('hero_title') || '';
    const hero_subtitle = formData.get('hero_subtitle') || '';
    const address = formData.get('address') || '';
    const tagline = formData.get('tagline') || '';
    const sociallink = formData.get('sociallink') || '';
    const email = formData.get('email') || '';
    const phone = formData.get('phone') || '';
    
    const logoFile = formData.get('logo'); // File object or URL string
    let logoUrl = formData.get('logo_url') || '';

    // If a new logo file was uploaded, send it to Cloudinary
    if (logoFile && typeof logoFile !== 'string') {
      const uploadResult = await uploadToCloudinary(logoFile, 'settings');
      if (uploadResult) {
        logoUrl = uploadResult.url;
      }
    }

    // Check if website details already exist
    const checkRes = await query('SELECT website_id FROM websites ORDER BY website_id ASC LIMIT 1');
    
    let result;
    if (checkRes.rows.length > 0) {
      // Update existing record
      const websiteId = checkRes.rows[0].website_id;
      result = await query(
        `UPDATE websites 
         SET logo_url = $1, theme_color = $2, hero_title = $3, hero_subtitle = $4,
             name = $5, address = $6, tagline = $7, sociallink = $8, email = $9, phone = $10,
             updated_at = now()
         WHERE website_id = $11
         RETURNING *`,
        [logoUrl, theme_color, hero_title, hero_subtitle, name, address, tagline, sociallink, email, phone, websiteId]
      );
    } else {
      // Insert new record
      result = await query(
        `INSERT INTO websites (logo_url, theme_color, hero_title, hero_subtitle, name, address, tagline, sociallink, email, phone)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         RETURNING *`,
        [logoUrl, theme_color, hero_title, hero_subtitle, name, address, tagline, sociallink, email, phone]
      );
    }

    return Response.json(result.rows[0], { status: 200 });

  } catch (error) {
    console.error('Error saving website settings:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
