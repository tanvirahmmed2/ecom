'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import { BiMap, BiPhone, BiEnvelope, BiTimeFive } from 'react-icons/bi'

const StoreLocation = () => {
  const { website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'
  const storeName = website?.name || 'Vanguard Store'
  const storeAddress = website?.address || 'House 24, Road 12, Dhanmondi, Dhaka, Bangladesh'
  const storePhone = website?.phone || '+880 1712-345678'
  const storeEmail = website?.email || 'support@vanguard.com'

  return (
    <div className="w-full py-16 px-4 md:px-8 bg-white border-b border-slate-100 animate-fade-in">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 items-stretch">
        
        {/* Info Card */}
        <div className="flex-1 flex flex-col gap-6 justify-center">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600" style={{ color: themeColor }}>
              Find Us
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Visit Our Outlet
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-lg shrink-0" style={{ color: themeColor }}>
                <BiMap />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-extrabold text-slate-700">Office & Store Address</span>
                <span className="text-slate-500 text-[11px] leading-normal">{storeAddress}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-lg shrink-0" style={{ color: themeColor }}>
                <BiPhone />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-extrabold text-slate-700">Phone Hotline</span>
                <span className="text-slate-500 text-[11px] leading-normal">{storePhone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-lg shrink-0" style={{ color: themeColor }}>
                <BiEnvelope />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-extrabold text-slate-700">Email Channels</span>
                <span className="text-slate-500 text-[11px] leading-normal">{storeEmail}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-lg shrink-0" style={{ color: themeColor }}>
                <BiTimeFive />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-extrabold text-slate-700">Store Hours</span>
                <span className="text-slate-500 text-[11px] leading-normal">Saturday – Thursday: 10:00 AM – 9:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Map Placeholder Card */}
        <div className="flex-1 min-h-[300px] rounded-3xl overflow-hidden border border-slate-200/60 bg-slate-50 relative flex items-center justify-center p-6 text-center select-none shadow-sm">
          {/* Decorative Map Pattern Background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
          
          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-2xl shadow-lg" style={{ backgroundColor: themeColor }}>
              <BiMap />
            </div>
            <h4 className="font-extrabold text-slate-800 text-sm">{storeName} Location Hub</h4>
            <p className="text-slate-500 text-[11px] max-w-xs leading-normal">
              Map integration loading. Visit Dhanmondi center located within major commercial shopping complex grids.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default StoreLocation