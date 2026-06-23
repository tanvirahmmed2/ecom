'use client'
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import SameCategory from '@/component/helper/SameCategory'
import { 
  BiCart, 
  BiArrowBack, 
  BiLoaderAlt, 
  BiCheckShield, 
  BiSolidTruck, 
  BiRevision 
} from 'react-icons/bi'

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params?.slug

  const { cart, setCart, setCartbar, website, addToCart } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!slug) return

    const fetchProductDetails = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`/api/product/${slug}`)
        setProduct(res.data)
        // Auto select first variant if available
        if (res.data.variants && res.data.variants.length > 0) {
          setSelectedVariant(res.data.variants[0])
        }
      } catch (err) {
        console.error('Failed to load product details:', err)
        toast.error('Product not found or unavailable')
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [slug])

  if (loading) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center gap-3 bg-slate-50">
        <BiLoaderAlt className="text-4xl text-emerald-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading product details...</span>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm flex flex-col items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">Product Not Found</h2>
          <p className="text-sm text-slate-500">The product you are looking for is currently unavailable or doesn't exist.</p>
          <Link href="/products" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const hasDiscount = !selectedVariant && product.discount_price && parseFloat(product.discount_price) > 0

  const basePrice = selectedVariant 
    ? parseFloat(selectedVariant.price) 
    : (hasDiscount
        ? Math.max(0, parseFloat(product.sale_price) - parseFloat(product.discount_price))
        : parseFloat(product.sale_price))

  const currentStock = selectedVariant 
    ? parseInt(selectedVariant.stock, 10) 
    : parseInt(product.stock, 10) || 0

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity)
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 md:px-8 relative overflow-hidden">
      
      {/* Ambient Glows */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />

      <div className="max-w-5xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2">
          <Link 
            href="/products" 
            className="flex items-center gap-1.5 text-xs font-bold text-slate-550 hover:text-slate-900 transition"
          >
            <BiArrowBack className="text-base" /> Back to Catalog
          </Link>
        </div>

        {/* Detail Container Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
          
          {/* Image Gallery Column */}
          <div className="md:col-span-6 flex flex-col gap-4">
            <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
              <img
                src={product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60'}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
          </div>

          {/* Details & Config Column */}
          <div className="md:col-span-6 flex flex-col gap-6">
            
            {/* Title / Badges */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  {product.category_name || 'General'}
                </span>
                {product.brand_name && (
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {product.brand_name}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-905 tracking-tight">
                {product.name}
              </h1>
            </div>

            {/* Pricing Section */}
            <div className="p-4 bg-slate-50 rounded-2xl flex flex-col gap-1 border border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Purchase Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">৳{basePrice.toFixed(2)}</span>
                {hasDiscount && (
                  <span className="text-sm font-semibold text-slate-400 line-through">
                    ৳{parseFloat(product.sale_price).toFixed(2)}
                  </span>
                )}
              </div>
              
              {/* Stock Indicator */}
              <div className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-2 border-t border-slate-200/60 pt-2">
                <span>Availability:</span>
                <span className={currentStock > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {currentStock > 0 ? `${currentStock} items left in stock` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Variants Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <span className="text-xs font-bold text-slate-500">Select Options</span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant?.variant_id === v.variant_id
                    return (
                      <button
                        key={v.variant_id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-4 py-2 border rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          isSelected 
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-650 hover:bg-slate-50 hover:border-slate-350'
                        }`}
                        style={isSelected ? { borderColor: themeColor, color: themeColor } : {}}
                      >
                        {v.variant_name} (৳{parseFloat(v.price).toFixed(2)})
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-500">Quantity</span>
              <div className="flex items-center gap-2 w-32 border border-slate-200 rounded-xl overflow-hidden bg-white p-1">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-550 font-bold hover:bg-slate-100 active:bg-slate-200 transition cursor-pointer"
                >
                  -
                </button>
                <span className="flex-1 text-center text-sm font-bold text-slate-800">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-550 font-bold hover:bg-slate-100 active:bg-slate-200 transition cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-50">
              <button
                onClick={handleAddToCart}
                disabled={currentStock <= 0}
                className="flex-1 py-4 px-6 bg-slate-900 text-white font-bold text-sm rounded-2xl shadow-lg transition flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-400"
                style={currentStock > 0 ? { backgroundColor: themeColor } : {}}
              >
                <BiCart className="text-xl" /> {currentStock > 0 ? 'Add to Cart' : 'Out of Stock'}
              </button>
            </div>

            {/* Trust Assurances */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 text-[10px] text-slate-500 text-center font-bold">
              <div className="flex flex-col items-center gap-1 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <BiCheckShield className="text-lg text-emerald-600" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <BiSolidTruck className="text-lg text-emerald-600" />
                <span>Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                <BiRevision className="text-lg text-emerald-600" />
                <span>Easy Returns</span>
              </div>
            </div>

          </div>

          {/* Description Section */}
          <div className="md:col-span-12 flex flex-col gap-3 pt-6 border-t border-slate-100">
            <h3 className="font-bold text-slate-800 text-sm">Product Description</h3>
            {product.description ? (
              <div 
                className="text-slate-600 text-sm leading-relaxed ProseMirror font-normal"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            ) : (
              <p className="text-slate-600 text-sm leading-relaxed">
                No detailed description available for this product yet. Rest assured, this is a premium quality item backed by full supplier logistics dispatch and quality assurance checks.
              </p>
            )}
          </div>

        </div>

        {/* Same Category Recommendations */}
        <SameCategory categoryId={product.category_id} excludeProductId={product.product_id} />

      </div>
    </div>
  )
}
