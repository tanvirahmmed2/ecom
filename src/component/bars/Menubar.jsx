'use client'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { BiCart } from 'react-icons/bi'
import { Context } from '../helper/Context'

const Menubar = () => {
    const { user, cartbar, setCartbar } = useContext(Context)

    return (
        <div 
            className="fixed bottom-6 left-4 right-4 z-50 md:hidden  shadow-white bg-emerald-600 backdrop-blur-md h-14 rounded-2xl text-white flex flex-row items-center justify-around shadow-sm"
        >
            <Link href={'/offers'} className='hover:text-red-500 transition-colors font-medium text-sm'>Offer</Link>
            <Link href={'/products'} className='hover:text-red-500 transition-colors font-medium text-sm'>Products</Link>
            <button 
                onClick={() => setCartbar(!cartbar)} 
                className='text-2xl hover:text-red-500 transition-colors cursor-pointer'
            >
                <BiCart />
            </button>
            {
                user ? (
                    <Link href={'/user'}> Hi, {user.name.split(' ')[0]}</Link>
                ) : (
                    <Link href={'/login'} className='hover:text-red-500 transition-colors font-medium text-sm'>Login</Link>
                )
            }
        </div>
    )
}

export default Menubar