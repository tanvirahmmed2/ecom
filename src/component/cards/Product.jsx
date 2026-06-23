'use client'
import React from 'react'
import Link from 'next/link'
import { BiCart, BiShow } from 'react-icons/bi'

export default function ProductCard({ product }) {
  if (!product) return null

  const {
    name,
    slug,
    image,
    sale_price,
    discount_price,
    category_name,
    brand_name
  } = product

  const finalPrice = discount_price && parseFloat(discount_price) > 0 
    ? parseFloat(discount_price) 
    : parseFloat(sale_price)

  const hasDiscount = discount_price && parseFloat(discount_price) > 0

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
                <span className="text-base font-bold text-slate-900">${finalPrice.toFixed(2)}</span>
                <span className="text-xs text-slate-400 line-through">${parseFloat(sale_price).toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-base font-bold text-slate-900">${finalPrice.toFixed(2)}</span>
            )}
          </div>

          <Link
            href={`/products/${slug}`}
            className="p-2 bg-slate-905 text-slate-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all duration-200 shadow-sm border border-slate-100 flex items-center justify-center gap-1.5"
            title="View product options"
          >
            <BiCart className="text-lg" />
            <span className="text-xs font-bold px-0.5">Buy</span>
          </Link>
        </div>

      </div>

    </div>
  )
}
