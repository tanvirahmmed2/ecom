'use client'
import Link from 'next/link'
import React, { useContext } from 'react'
import { FaLocationArrow } from 'react-icons/fa6'
import { Context } from '../helper/Context'
import { BiEnvelope, BiPhoneCall } from 'react-icons/bi'

const Footer = () => {
  const { website } = useContext(Context)

  return (
    <footer className='w-full p-8 bg-slate-900 text-slate-300 flex flex-col items-center justify-center gap-8 border-t border-slate-800 print:hidden'>
      <div className='w-full max-w-6xl flex flex-col md:flex-row items-start justify-between gap-8'>
        
        {/* Left Column: Brand details */}
        <div className='flex flex-col gap-3 max-w-sm'>
          <Link href={'/'} className='flex items-center gap-2 text-3xl font-extrabold text-white tracking-tight hover:opacity-90 transition'>
            {website?.logo_url ? (
              <img src={website.logo_url} alt={website.name || 'Ecom'} className="h-10 w-auto object-contain max-w-[150px]" />
            ) : (
              <span>{website?.name || 'Ecom'}</span>
            )}
          </Link>
          <p className='text-sm text-slate-450 italic text-slate-400'>
            {website?.tagline || 'New Era of Shopping'}
          </p>
          <div className="flex flex-col gap-2 text-xs text-slate-400 mt-2">
            {website?.address ? (
              <p className='flex flex-row gap-2 items-start leading-relaxed'>
                <FaLocationArrow className="mt-0.5 text-emerald-500 shrink-0" /> 
                <span>{website.address}</span>
              </p>
            ) : (
              <p className='flex flex-row gap-2 items-center'>
                <FaLocationArrow className="text-emerald-500 shrink-0" /> 
                <span>Sadar, Mymensingh</span>
              </p>
            )}

            {website?.phone && (
              <p className='flex flex-row gap-2 items-center'>
                <BiPhoneCall className="text-lg text-emerald-500 shrink-0" /> 
                <a href={`tel:${website.phone}`} className="hover:text-emerald-450 hover:text-emerald-400 transition">{website.phone}</a>
              </p>
            )}

            {website?.email && (
              <p className='flex flex-row gap-2 items-center'>
                <BiEnvelope className="text-lg text-emerald-500 shrink-0" /> 
                <a href={`mailto:${website.email}`} className="hover:text-emerald-450 hover:text-emerald-400 transition">{website.email}</a>
              </p>
            )}
          </div>
        </div>

        {/* Middle Column: Quick Links */}
        <div className='flex flex-col gap-2 text-sm'>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Navigation</h4>
          <Link href={'/offers'} className="hover:text-white transition">Offers</Link>
          <Link href={'/track-order'} className="hover:text-white transition">Track Order</Link>
          <Link href={'/products/category'} className="hover:text-white transition">Category</Link>
          <Link href={'/'} className="hover:text-white transition">Reviews</Link>
        </div>

        {/* Right Column: Policies */}
        <div className='flex flex-col gap-2 text-sm'>
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Company</h4>
          <Link href={'/privacy-policy'} className="hover:text-white transition">Privacy & Policy</Link>
          <Link href={'/register'} className="hover:text-white transition">Register</Link>
          <Link href={'/about'} className="hover:text-white transition">About</Link>
          <Link href={'/contact'} className="hover:text-white transition">Contact Us</Link>
        </div>

      </div>

      <div className='w-full max-w-6xl border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4'>
        <p>All rights are reserved by <Link href={'/'} className="hover:text-slate-350 hover:text-slate-300 font-semibold">{website?.name || 'Ecom'}</Link> &copy; {new Date().getFullYear()}</p>
        <p>Developed by <Link href={'https://disibin.com'} target="_blank" className="hover:text-slate-350 hover:text-slate-300 font-semibold transition">Disibin</Link></p>
      </div>
    </footer>
  )
}

export default Footer