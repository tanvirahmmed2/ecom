'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import { BiShoppingBag, BiChevronRight } from 'react-icons/bi'

export default function HomePage() {
  const { website } = useContext(Context)
  
  const themeColor = website?.theme_color || '#10b981' // defaults to emerald
  const logoUrl = website?.logo_url
  const heroTitle = website?.hero_title || 'Welcome to Ecom Store'
  const heroSubtitle = website?.hero_subtitle || 'Discover premium product listings, verified supplier procurement variants, and rapid logistics dispatch.'
  const name = website?.name || 'Ecom'
  const tagline = website?.tagline || 'New Era of Shopping'

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col justify-center items-center relative overflow-hidden py-16">
      
      {/* Visual Ambient Glows */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: themeColor }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-15 pointer-events-none transition-all duration-1000"
        style={{ backgroundColor: themeColor }}
      />

      <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8 relative z-10 animate-fade-in">
        
        {/* Logo and Tagline Accents */}
        <div className="flex flex-col items-center gap-3">
          {logoUrl ? (
            <div className="w-24 h-24 rounded-3xl bg-white/70 backdrop-blur-md p-2 shadow-md border border-slate-200/50 flex items-center justify-center">
              <img 
                src={logoUrl} 
                alt={name} 
                className="object-contain w-full h-full"
              />
            </div>
          ) : (
            <div 
              className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-white shadow-sm shadow-slate-900/10"
              style={{ backgroundColor: themeColor }}
            >
              {name}
            </div>
          )}
          <span className="text-xs font-bold text-slate-450 uppercase tracking-widest text-slate-500 mt-1">
            {tagline}
          </span>
        </div>

        {/* Hero Copywriting */}
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-3xl mx-auto">
            {heroTitle}
          </h1>
          <p className="text-slate-550 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-slate-600">
            {heroSubtitle}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
          <Link
            href="/products"
            className="px-8 py-3.5 text-white font-bold text-sm rounded-2xl shadow-lg transition flex items-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{ 
              backgroundColor: themeColor,
              shadowColor: `${themeColor}33`
            }}
          >
            <BiShoppingBag className="text-lg" /> Explore Products <BiChevronRight className="text-lg" />
          </Link>
          
          <Link
            href="/contact"
            className="px-8 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm rounded-2xl shadow-sm transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Contact Support
          </Link>
        </div>

      </div>
      
    </div>
  )
}