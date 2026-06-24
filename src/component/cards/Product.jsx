'use client'
import React, { useContext, useState } from 'react'
import Link from 'next/link'
import { BiCart, BiShow, BiLoaderAlt } from 'react-icons/bi'
import { Context } from '../helper/Context'
import axios from 'axios'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  if (!product) return null

  const { addToCart } = useContext(Context)

  const {
    product_id,
    name,
    slug,
    image,
    sale_price,
    discount_price,
    category_name,
    brand_name,
    stock,
    total_stock
  } = product

  const [variants, setVariants] = useState([])
  const [loadingVariants, setLoadingVariants] = useState(false)
  const [showVariants, setShowVariants] = useState(false)

  const hasDiscount = discount_price && parseFloat(discount_price) > 0

  const finalPrice = hasDiscount
    ? Math.max(0, parseFloat(sale_price) - parseFloat(discount_price))
    : parseFloat(sale_price)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    // Fetch variants on-demand if we haven't done so and they are not present
    if (variants.length === 0 && !loadingVariants) {
      setLoadingVariants(true)
      try {
        const res = await axios.get(`/api/product/${slug}`)
        const fetchedVariants = res.data.variants || []
        setVariants(fetchedVariants)
        if (fetchedVariants.length > 0) {
          setShowVariants(true)
        } else {
          addToCart(product)
        }
      } catch (err) {
        console.error('Failed to load variants:', err)
        toast.error('Failed to check variant options')
        addToCart(product) // fallback to add base
      } finally {
        setLoadingVariants(false)
      }
    } else if (variants.length > 0) {
      setShowVariants(true)
    } else {
      addToCart(product)
    }
  }

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden relative">
      
      {/* Product Image Section */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 border-b border-slate-100">
        {hasDiscount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10 shadow-sm animate-pulse">
            Sale
          </div>
        )}
        
        <img
          src={image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60'}
          alt={name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 z-10">
          <Link
            href={`/products/${slug}`}
            className="p-2.5 bg-white/95 backdrop-blur-sm text-slate-800 rounded-full hover:bg-emerald-600 hover:text-white transition-all duration-200 transform translate-y-4 group-hover:translate-y-0 shadow-md"
            title="View Details"
          >
            <BiShow className="text-lg" />
          </Link>
        </div>
      </div>

      {/* Info Content Section */}
      <div className="p-4 flex flex-col flex-1 gap-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>{category_name || 'General'}</span>
          {brand_name && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              <span>{brand_name}</span>
            </>
          )}
        </div>

        <Link href={`/products/${slug}`} className="block">
          <h3 className="text-sm font-bold text-slate-850 hover:text-emerald-605 transition line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Pricing & Add to Cart button */}
        <div className="mt-auto pt-2.5 flex items-center justify-between gap-2 border-t border-slate-50">
          <div className="flex flex-col">
            {hasDiscount ? (
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-bold text-slate-900">৳{finalPrice.toFixed(2)}</span>
                <span className="text-xs text-slate-400 line-through">৳{parseFloat(sale_price).toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-base font-bold text-slate-900">৳{finalPrice.toFixed(2)}</span>
            )}
          </div>

          {((total_stock !== undefined ? parseInt(total_stock, 10) : parseInt(stock, 10)) <= 0) ? (
            <button
              disabled
              className="p-2 bg-slate-100 text-slate-400 rounded-xl cursor-not-allowed border border-slate-150 flex items-center justify-center gap-1.5"
              title="Out of Stock"
            >
              <span className="text-[10px] font-bold px-0.5">Out of Stock</span>
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={loadingVariants}
              className="p-2 bg-slate-900/5 text-slate-650 hover:bg-emerald-600 hover:text-white rounded-xl transition-all duration-200 shadow-sm border border-slate-100 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              title="Add to Cart"
            >
              {loadingVariants ? (
                <BiLoaderAlt className="text-lg animate-spin text-emerald-600" />
              ) : (
                <BiCart className="text-lg" />
              )}
              <span className="text-xs font-bold px-0.5">
                {loadingVariants ? 'Loading...' : 'Add'}
              </span>
            </button>
          )}
        </div>

      </div>

      {/* Dynamic Variant Selector Overlay */}
      {showVariants && (
        <div 
          className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 p-4 flex flex-col justify-between items-center transition-all duration-300"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <div className="w-full flex justify-between items-center border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-800">Select Option</span>
            <button 
              onClick={() => setShowVariants(false)}
              className="text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              Cancel
            </button>
          </div>
          
          <div className="flex-1 w-full overflow-y-auto my-3 flex flex-col gap-2 pr-1">
            {variants.map((v) => {
              const vPrice = parseFloat(sale_price) + parseFloat(v.price)
              const finalVPrice = hasDiscount ? Math.max(0, vPrice - parseFloat(discount_price || 0)) : vPrice
              const inStock = parseInt(v.stock, 10) > 0
              
              return (
                <button
                  key={v.variant_id}
                  disabled={!inStock}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    addToCart(product, v, 1)
                    setShowVariants(false)
                  }}
                  className={`w-full py-2 px-3 border rounded-xl text-left text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                    inStock 
                      ? 'border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700' 
                      : 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="truncate">{v.variant_name}</span>
                  <span className="shrink-0">
                    {inStock ? `৳${finalVPrice.toFixed(2)}` : 'Out of Stock'}
                  </span>
                </button>
              )
            })}
          </div>
          
          <div className="text-[10px] text-slate-400 text-center font-medium">
            Choose a variant to add to cart
          </div>
        </div>
      )}

    </div>
  )
}
