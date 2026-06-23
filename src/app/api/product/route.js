import { query } from '@/lib/db';
import { isManager } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export async function GET(req) {
  try {
    let sql = `
      SELECT p.*, c.name AS category_name, b.name AS brand_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
    `;
    let params = [];

    const url = new URL(req.url);
    const category = url.searchParams.get('category');

    if (category) {
      const isNumeric = /^\d+$/.test(category);
      const catRes = await query(
        isNumeric 
          ? 'SELECT category_id FROM categories WHERE category_id = $1' 
          : 'SELECT category_id FROM categories WHERE slug = $1',
        [isNumeric ? parseInt(category, 10) : category]
      );
      
      if (catRes.rows.length > 0) {
        const targetId = catRes.rows[0].category_id;
        const subcatsRes = await query(
          'SELECT category_id FROM categories WHERE parent_id = $1 OR category_id = $1',
          [targetId]
        );
        const categoryIds = subcatsRes.rows.map(r => r.category_id);
        
        sql += ` WHERE p.category_id = ANY($1::int[])`;
        params.push(categoryIds);
      } else {
        sql += ` WHERE 1=0`;
      }
    }

    sql += ` ORDER BY p.product_id DESC`;
    const result = await query(sql, params);
    return Response.json(result.rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const auth = await isManager();
    if (!auth.success) {
      return Response.json({ error: auth.message }, { status: 403 });
    }

    const formData = await req.formData();
    const name = formData.get('name');
    const description = formData.get('description') || '';
    const category_id = formData.get('category_id') ? parseInt(formData.get('category_id'), 10) : null;
    const brand_id = formData.get('brand_id') ? parseInt(formData.get('brand_id'), 10) : null;
    
    const purchase_price = formData.get('purchase_price') ? parseFloat(formData.get('purchase_price')) : 0;
    const sale_price = formData.get('sale_price') ? parseFloat(formData.get('sale_price')) : 0;
    const discount_price = formData.get('discount_price') ? parseFloat(formData.get('discount_price')) : 0;
    const wholesale_price = formData.get('wholesale_price') ? parseFloat(formData.get('wholesale_price')) : 0;
    const dealer_price = formData.get('dealer_price') ? parseFloat(formData.get('dealer_price')) : 0;
    const retail_price = formData.get('retail_price') ? parseFloat(formData.get('retail_price')) : 0;

    const unit = formData.get('unit') || '';
    const barcode = formData.get('barcode') || '';
    const isActiveVal = formData.get('is_active');
    const imageFile = formData.get('image');

    const variantsStr = formData.get('variants'); // JSON string array of { variant_name, price, stock }

    if (!name) {
      return Response.json({ error: 'Product name is required' }, { status: 400 });
    }
    if (!imageFile) {
      return Response.json({ error: 'Product image is required' }, { status: 400 });
    }

    const slug = slugify(name) + '-' + Math.floor(1000 + Math.random() * 9000);
    const is_active = isActiveVal === 'false' ? false : true;

    // Upload image to Cloudinary
    const uploadResult = await uploadToCloudinary(imageFile, 'products');
    if (!uploadResult) {
      return Response.json({ error: 'Failed to upload product image' }, { status: 500 });
    }

    // Insert Product into Database
    const productResult = await query(
      `INSERT INTO products (
        category_id, brand_id, name, slug, description,
        purchase_price, sale_price, discount_price, wholesale_price,
        dealer_price, retail_price, image, image_id, unit, barcode, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
       RETURNING *`,
      [
        category_id, brand_id, name, slug, description,
        purchase_price, sale_price, discount_price, wholesale_price,
        dealer_price, retail_price, uploadResult.url, uploadResult.id, unit, barcode, is_active
      ]
    );

    const product = productResult.rows[0];

    // Handle variants if provided
    if (variantsStr) {
      try {
        const variants = JSON.parse(variantsStr);
        if (Array.isArray(variants) && variants.length > 0) {
          for (const variant of variants) {
            const vPrice = variant.price ? parseFloat(variant.price) : 0;
            const vStock = variant.stock ? parseInt(variant.stock, 10) : 0;
            if (variant.variant_name) {
              await query(
                `INSERT INTO product_variants (product_id, variant_name, price, stock)
                 VALUES ($1, $2, $3, $4)`,
                [product.product_id, variant.variant_name, vPrice, vStock]
              );
            }
          }
        }
      } catch (err) {
        console.error('Error saving product variants:', err);
      }
    }

    return Response.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
