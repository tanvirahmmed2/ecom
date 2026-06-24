'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { Context } from '../helper/Context'
import { BiShoppingBag, BiPurchaseTagAlt } from 'react-icons/bi'

const Hero = () => {
  const { website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'
  const tagline = website?.tagline || 'Your premium shopping experience'
  const heroTitle = website?.hero_title || 'Discover Premium Quality Products'
  const heroSubtitle = website?.hero_subtitle || 'Shop our exclusive range of handpicked quality products at unbeatable prices.'

  return (
    <div className="relative w-full bg-slate-950 py-24 md:py-36 px-4 md:px-8 overflow-hidden flex flex-col items-center text-center justify-center">

      {/* Ambient background glows */}
      <div
        className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-25 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />
      <div
        className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center gap-6 relative z-10 animate-fade-in">

        {/* Badge Tagline */}
        <span
          className="px-3.5 py-1 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-full border bg-white/5 backdrop-blur-md shadow-sm select-none"
          style={{ borderColor: `${themeColor}40`, color: themeColor }}
        >
          ✨ {tagline}
        </span>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-3xl">
          {heroTitle}
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed font-medium">
          {heroSubtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto justify-center">
          <Link
            href="/products"
            className="px-8 py-3.5 text-white font-bold text-sm rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: themeColor, boxShadow: `0 10px 25px -5px ${themeColor}30` }}
          >
            <BiShoppingBag className="text-lg" /> Explore Catalog
          </Link>
          <Link
            href="/offers"
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-2xl border border-white/10 hover:border-white/20 transition flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md"
          >
            <BiPurchaseTagAlt className="text-lg" /> View Offers
          </Link>
        </div>

      </div>

    </div>
  )
}

export default Hero