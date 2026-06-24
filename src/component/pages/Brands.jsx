'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Context } from '../helper/Context'
import { BiLoaderAlt } from 'react-icons/bi'
import Image from 'next/image'

const Brands = () => {
  const { website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const res = await axios.get('/api/brand')
        setBrands(res.data.filter(b => b.is_active !== false))
      } catch (err) {
        console.error('Failed to load brands:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBrands()
  }, [])

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <BiLoaderAlt className="text-3xl animate-spin" style={{ color: themeColor }} />
      </div>
    )
  }

  if (brands.length === 0) return null

  // Duplicate items for infinite marquee loop
  const marqueeItems = [...brands, ...brands, ...brands]

  return (
    <div className="w-full py-12 bg-white border-b border-slate-100 overflow-hidden relative">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll-brands {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.33%); }
        }
        .marquee-inner-brands {
          display: flex;
          width: max-content;
          animation: scroll-brands 20s linear infinite;
        }
        .marquee-inner-brands:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="max-w-6xl mx-auto px-4 md:px-8 mb-6">
        <span className="text-xs font-black uppercase tracking-widest text-emerald-600" style={{ color: themeColor }}>
          Partners
        </span>
        <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mt-1">
          Authorized Brands
        </h2>
      </div>

      {/* Marquee Ticker */}
      <div className="w-full overflow-hidden relative py-4 bg-slate-50 border-y border-slate-200/60">
        <div className="marquee-inner-brands flex gap-8 px-4 items-center">
          {marqueeItems.map((brand, idx) => (
            <div
              key={`${brand.brand_id}-${idx}`}
              className="flex  items-center aspect-5/6 flex-col gap-3.5 bg-white border border-slate-100 hover:border-slate-300 rounded-2xl p-2 max-w-50  justify-start transition-all hover:scale-[1.02] hover:shadow-md select-none shrink-0 cursor-pointer"
            >
              <div className="w-full overflow-hidden bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 p-1">
                <Image width={500} height={500}
                  src={brand.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'}
                  alt={brand.name}
                  className="w-full h-full scale-110 object-cover aspect-square"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black text-slate-800 truncate">{brand.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Brands