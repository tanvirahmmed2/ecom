'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { Context } from '../helper/Context'
import Image from 'next/image'

const Categories = () => {
  const { categories, website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  if (!categories || categories.length === 0) return null

  // Duplicate list to achieve a seamless horizontal loop marquee effect
  const marqueeItems = [...categories, ...categories, ...categories]

  return (
    <div className="w-full py-12 bg-slate-50 border-b border-slate-100 overflow-hidden relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll-categories {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .marquee-inner-categories {
          display: flex;
          width: max-content;
          animation: scroll-categories 25s linear infinite;
        }
        .marquee-inner-categories:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="w-full px-4 md:px-8 mb-6">
        <span className="text-xs font-black uppercase tracking-widest text-emerald-600" style={{ color: themeColor }}>
          Departments
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Browse Categories
        </h2>
      </div>

      {/* Marquee Ticker */}
      <div className="w-full overflow-hidden relative py-4 bg-white border-y border-slate-100">
        <div className="marquee-inner-categories flex gap-6 px-4">
          {marqueeItems.map((cat, idx) => (
            <Link
              key={`${cat.id}-${idx}`}
              href={`/products?category=${cat.slug}`}
              className="flex aspect-5/6 items-center flex-col gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-2xl p-2 max-w-50 transition-all hover:scale-[1.02] shadow-sm select-none cursor-pointer shrink-0"
            >
              <div className="w-full rounded-xl overflow-hidden bg-white border border-slate-100 flex items-center justify-center shrink-0">
                <Image width={500} height={500}
                  src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'}
                  alt={cat.category}
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-extrabold text-slate-800 truncate">{cat.category}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Explore</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Categories