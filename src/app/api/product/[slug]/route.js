import { query } from '@/lib/db';
import { isManager } from '@/lib/auth';
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary';
import { generateUniqueBarcode } from '@/lib/barcode';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

async function getProductByIdOrSlug(idOrSlug) {
  const isNumeric = /^\d+$/.test(idOrSlug);
  const sql = isNumeric 
    ? 'SELECT * FROM products WHERE product_id = $1' 
    : 'SELECT * FROM products WHERE slug = $1';
  const param = isNumeric ? parseInt(idOrSlug, 10) : idOrSlug;
  const res = await query(sql, [param]);
  return res.rows[0];
}

export async function GET(req, { params }) {
  try {
    const { slug } = await params;
    const product = await getProductByIdOrSlug(slug);
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    // Fetch its variants
    const variantsRes = await query(
      'SELECT * FROM product_variants WHERE product_id = $1 ORDER BY variant_id ASC',
      [product.product_id]
    );

    return Response.json({
      ...product,
      variants: variantsRes.rows
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) {
      return Response.json({ error: auth.message }, { status: 403 });
    }

    const { slug: paramSlug } = await params;
    const product = await getProductByIdOrSlug(paramSlug);
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
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
    let barcode = formData.get('barcode') || '';

    if (!barcode) {
      barcode = await generateUniqueBarcode();
    } else {
      const checkBarcode = await query(
        'SELECT product_id FROM products WHERE barcode = $1 AND product_id != $2',
        [barcode, product.product_id]
      );
      if (checkBarcode.rows.length > 0) {
        return Response.json({ error: 'Barcode already exists on another product. It must be unique.' }, { status: 400 });
      }
    }

    const isActiveVal = formData.get('is_active');
    const imageFile = formData.get('image');

    const stock = formData.get('stock') ? parseInt(formData.get('stock'), 10) : 0;
    const variantsStr = formData.get('variants'); // JSON string array of { variant_name, price, stock }

    let finalStock = stock;
    if (variantsStr) {
      try {
        const variants = JSON.parse(variantsStr);
        if (Array.isArray(variants) && variants.length > 0) {
          finalStock = 0;
        }
      } catch (err) {
        console.error('Error parsing variants:', err);
      }
    }

    if (!name) {
      return Response.json({ error: 'Product name is required' }, { status: 400 });
    }

    const slug = slugify(name) + '-' + product.product_id;
    const is_active = isActiveVal === 'false' ? false : true;

    let imageUrl = product.image;
    let imageId = product.image_id;

    // Check if new image is uploaded
    if (imageFile && typeof imageFile !== 'string') {
      const uploadResult = await uploadToCloudinary(imageFile, 'products');
      if (uploadResult) {
        // Delete previous image from Cloudinary
        if (product.image_id) {
          await deleteFromCloudinary(product.image_id);
        }
        imageUrl = uploadResult.url;
        imageId = uploadResult.id;
      }
    }

    // Update Product details
    const result = await query(
      `UPDATE products 
       SET category_id = $1, brand_id = $2, name = $3, slug = $4, description = $5,
           purchase_price = $6, sale_price = $7, discount_price = $8, wholesale_price = $9,
           dealer_price = $10, retail_price = $11, image = $12, image_id = $13, unit = $14,
           barcode = $15, stock = $16, is_active = $17, updated_at = NOW()
       WHERE product_id = $18 
       RETURNING *`,
      [
        category_id, brand_id, name, slug, description,
        purchase_price, sale_price, discount_price, wholesale_price,
        dealer_price, retail_price, imageUrl, imageId, unit, barcode, finalStock, is_active,
        product.product_id
      ]
    );

    const updatedProduct = result.rows[0];

    // Sync variants by deleting and re-inserting
    if (variantsStr) {
      try {
        const variants = JSON.parse(variantsStr);
        if (Array.isArray(variants)) {
          // Delete existing variants
          await query('DELETE FROM product_variants WHERE product_id = $1', [product.product_id]);

          // Insert new variants
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
        console.error('Error syncing product variants:', err);
      }
    }

    return Response.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = await isManager();
    if (!auth.success) {
      return Response.json({ error: auth.message }, { status: 403 });
    }

    const { slug: paramSlug } = await params;
    const product = await getProductByIdOrSlug(paramSlug);
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete image from Cloudinary
    if (product.image_id) {
      try {
        await deleteFromCloudinary(product.image_id);
      } catch (err) {
        console.error('Failed to delete product image from Cloudinary:', err);
      }
    }

    // Delete product from DB (variants will cascade delete)
    await query('DELETE FROM products WHERE product_id = $1', [product.product_id]);

    return Response.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
