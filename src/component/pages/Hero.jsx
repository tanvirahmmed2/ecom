'use client'
import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import { Context } from '../helper/Context'
import { BiCart, BiSolidChevronRight } from 'react-icons/bi'
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi'

const Hero = () => {
  const { website, addToCart } = useContext(Context)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const themeColor = website?.theme_color || '#10b981'
  const shopName = website?.name || 'EcoStore'
  const tagline = website?.tagline || 'Premium Quality Collections'

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const res = await axios.get('/api/hero')
        setProducts(res.data.products || [])
      } catch (err) {
        console.error("Failed to load hero products:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHeroData()
  }, [])

  const getProductPriceInfo = (product) => {
    if (!product) return { hasDiscount: false, salePrice: 0, finalPrice: 0, discountPrice: 0, discountPercent: 0 }
    const salePrice = parseFloat(product.sale_price || 0)
    const discountPrice = parseFloat(product.discount_price || 0)
    const hasDiscount = discountPrice > 0
    const finalPrice = hasDiscount ? Math.max(0, salePrice - discountPrice) : salePrice
    const discountPercent = salePrice > 0 ? Math.round((discountPrice / salePrice) * 100) : 0
    return { hasDiscount, salePrice, finalPrice, discountPrice, discountPercent }
  }


  // Ensure we have at least 1 product to draw the structural layout
  if (!products || products.length === 0) {
    return null
  }

  const p1 = products[0]
  const p2 = products[1] || products[0]
  const p3 = products[2] || products[0]

  const p1Price = getProductPriceInfo(p1)
  const p2Price = getProductPriceInfo(p2)
  const p3Price = getProductPriceInfo(p3)

  return (
    <div className="w-full bg-slate-50/50 py-12 px-4 md:px-8 border-b border-slate-100">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 group">
          <div className="flex flex-col md:flex-row h-full">
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between gap-6 relative z-10">
              <div className="space-y-4">
                <span
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm"
                  style={{ color: themeColor, backgroundColor: `${themeColor}10` }}
                >
                  <FiTrendingUp className="text-xs" /> Featured Deal
                </span>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                    {p1.category_name || 'Collection'}
                  </span>
                  <Link href={`/products/${p1.slug}`}>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight hover:text-slate-700 transition duration-300 line-clamp-2">
                      {p1.name}
                    </h2>
                  </Link>
                </div>
                <p
                  className="text-sm text-slate-555 leading-relaxed line-clamp-3 font-normal"
                  dangerouslySetInnerHTML={{ __html: p1.description || 'Elevate your routine with our featured selection, combining top-tier craft, style, and popular acclaim.' }}
                />
              </div>

              <div className="space-y-4">
                {/* Price display */}
                <div className="flex flex-col gap-1">
                  {p1Price.hasDiscount ? (
                    <div className="space-y-1.5">
                      <div className="flex items-baseline gap-2.5">
                        <span className="text-3xl font-extrabold text-slate-900">৳{p1Price.finalPrice.toFixed(2)}</span>
                        <span className="text-sm font-semibold text-slate-400 line-through">৳{p1Price.salePrice.toFixed(2)}</span>
                      </div>
                      <span
                        className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border"
                        style={{ color: '#e11d48', backgroundColor: '#fff1f2', borderColor: '#ffe4e6' }}
                      >
                        Save {p1Price.discountPercent}%
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-extrabold text-slate-900">৳{p1Price.finalPrice.toFixed(2)}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                  <Link
                    href={`/products/${p1.slug}`}
                    className="flex-1 text-center py-3 px-6 text-sm font-bold text-white rounded-2xl shadow-sm hover:shadow-lg transition duration-300 hover:brightness-105 cursor-pointer flex items-center justify-center gap-2 group/btn"
                    style={{ backgroundColor: themeColor }}
                  >
                    Shop Now
                    <FiArrowRight className="text-base transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      addToCart(p1)
                    }}
                    disabled={parseInt(p1.stock || p1.total_stock || 0) <= 0}
                    className="p-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl transition duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                    title="Add to Cart"
                  >
                    <BiCart className="text-xl" />
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-slate-50/50 overflow-hidden min-h-[260px] md:min-h-full border-t md:border-t-0 md:border-l border-slate-100/80 flex items-center justify-center">
              <Link href={`/products/${p1.slug}`} className="absolute inset-0 block">
                <Image
                  src={p1.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60'}
                  alt={p1.name}
                  width={600}
                  height={600}
                  priority
                  className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-700"
                />
              </Link>
            </div>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 gap-6">

          {/* here show the second of top sold product image and show data */}
          <div className="w-full bg-white rounded-3xl p-5 flex items-center justify-between border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200/80 transition-all duration-300 group">
            <div className="flex-1 flex flex-col justify-between pr-4 h-full gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {p2.category_name || 'General'}
                </span>
                <Link href={`/products/${p2.slug}`}>
                  <h3 className="text-base font-bold text-slate-900 line-clamp-1 hover:text-slate-700 transition duration-200 mt-1">
                    {p2.name}
                  </h3>
                </Link>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-extrabold text-slate-900">৳{p2Price.finalPrice.toFixed(2)}</span>
                  {p2Price.hasDiscount && (
                    <span className="text-xs text-slate-400 line-through">৳{p2Price.salePrice.toFixed(2)}</span>
                  )}
                </div>
                <Link
                  href={`/products/${p2.slug}`}
                  className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-all w-fit"
                >
                  View Details <BiSolidChevronRight className="text-sm group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

            <div className="w-24 h-24 md:w-28 md:h-28 relative flex-shrink-0 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/80">
              <Link href={`/products/${p2.slug}`}>
                <Image
                  src={p2.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60'}
                  alt={p2.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
            </div>
          </div>

          {/* here show shop name */}
          <div className="w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 flex flex-col justify-center items-center text-center shadow-md relative overflow-hidden min-h-[140px] group border border-slate-800">
            {/* Background Glow */}
            <div
              className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-2xl opacity-25 group-hover:scale-125 transition-transform duration-500"
              style={{ backgroundColor: themeColor }}
            />
            <div
              className="absolute -left-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-15 group-hover:scale-125 transition-transform duration-500"
              style={{ backgroundColor: themeColor }}
            />

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white select-none">
              {shopName}
            </h1>
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 max-w-[90%] line-clamp-1">
              {tagline}
            </p>
            <Link
              href="/products"
              className="mt-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-5 py-2 bg-white text-slate-900 hover:bg-slate-50 hover:shadow-md active:scale-95 rounded-full transition-all duration-300"
            >
              Explore Shop <FiArrowRight className="text-sm" />
            </Link>
          </div>


        </div>

      </div>
    </div>
  )
}

export default Hero