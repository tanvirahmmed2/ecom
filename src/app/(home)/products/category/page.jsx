'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import { BiCategory, BiChevronRight, BiLoaderAlt } from 'react-icons/bi'
import Image from 'next/image'

export default function ProductsCategoryPage() {
  const { categories, website } = useContext(Context)

  const themeColor = website?.theme_color || '#10b981'

  if (!categories || categories.length === 0) {
    return (
      <div className="w-full min-h-[70vh] flex flex-col items-center justify-center gap-3 bg-slate-55">
        <BiLoaderAlt className="text-3xl text-emerald-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading categories...</span>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 relative overflow-hidden py-16 px-4 md:px-8">
      
      {/* Background Ambient Glows */}
      <div 
        className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />
      <div 
        className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />

      <div className="max-w-6xl mx-auto flex flex-col gap-10 relative z-10">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center justify-center sm:justify-start gap-2.5">
            <BiCategory className="text-emerald-600" />
            Explore Categories
          </h1>
          <p className="text-slate-500 text-sm max-w-lg">
            Browse our curated selection of premium categories and subcategories to find exactly what you need.
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="w-full bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-50/10 flex items-center justify-center text-slate-400 text-2xl">
              <BiCategory />
            </div>
            <h3 className="font-bold text-slate-800">No categories found</h3>
            <p className="text-sm text-slate-500">We couldn't load the shop categories at this moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((c) => (
              <div 
                key={c.id} 
                className="group bg-white rounded-3xl border border-slate-100/85 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden"
              >
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <Image width={1000} height={1000}
                    src={c.image || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=600&auto=format&fit=crop&q=60'}
                    alt={c.category}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                  
                  <div className="absolute bottom-4 left-5 flex flex-col">
                    <h2 className="text-xl font-bold text-white tracking-wide">
                      {c.category}
                    </h2>
                  </div>
                </div>

                {/* Subcategories & Actions */}
                <div className="p-6 flex flex-col flex-1 gap-6">
                  {c.subcategory && c.subcategory.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {c.subcategory.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/products/category/${sub.slug}`}
                          className="px-3.5 py-1.5 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 border border-slate-100 rounded-xl text-xs font-semibold text-slate-600 transition-colors cursor-pointer"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium italic">No subcategories listed</span>
                  )}

                  {/* Browse CTA */}
                  <Link
                    href={`/products/category/${c.slug}`}
                    className="mt-auto py-3 px-4 bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-sm group-hover:bg-emerald-600/90"
                  >
                    Browse {c.category} <BiChevronRight className="text-base" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
