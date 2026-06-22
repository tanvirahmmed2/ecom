import Link from 'next/link'
import React from 'react'
import { FaLocationArrow } from 'react-icons/fa6'

const Footer = () => {
  return (
    <footer className='w-full p-4 bg-slate-600 text-white flex flex-col items-center justify-center gap-6'>
      <div className='w-full flex flex-col md:flex-row items-center justify-around gap-4'>
        <div className='w-auto flex flex-col gap-2'>
          <p>We serve quality</p>
          <Link href={'/'} className='text-5xl'>Ecom</Link>
          <p className='w-auto flex flex-row gap-2 items-center'><FaLocationArrow/> Sadar, Mymensingh</p>
          <p>Home delivery available</p>

        </div>

        <div className='w-auto flex flex-col gap-2'>
          <Link href={'/offers'}>Offers</Link>
          <Link href={'/track-order'}>Track Order</Link>
          <Link href={'/products/category'}>Category</Link>
          <Link href={'/'}>Reviews</Link>

        </div>

        <div className='w-auto flex flex-col gap-2'>
          <Link href={'/privacy-policy'}>Privacy & Policy</Link>
          <Link href={'/register'}>Register</Link>
          <Link href={'/about'}>About</Link>
          <Link href={'/contact'}>Contact</Link>
        </div>

      </div>

      <div className='w-full flex flex-col md:flex-row items-center justify-around'>
        <p>All rights are reserved by <Link href={'/'}>Ecom</Link></p>
        <p>Developed by <Link href={'https://disibin.com'}>Disibin</Link></p>
      </div>
    </footer>
  )
}

export default Footer