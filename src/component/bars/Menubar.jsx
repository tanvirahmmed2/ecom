'use client'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { BiCart } from 'react-icons/bi'
import { Context } from '../helper/Context'
import { MdLocalOffer } from 'react-icons/md'
import { AiFillProduct } from 'react-icons/ai'
import { FiLogIn } from 'react-icons/fi'

const Menubar = () => {
    const { user, cartbar, setCartbar } = useContext(Context)

    return (
        <div
            className="fixed bottom-6 left-4 right-4 z-50 md:hidden bg-white/20 backdrop-blur-md p-2 rounded-2xl  flex flex-row items-center justify-around shadow-sm"
        >
            
            <Link href={'/products'} className='hover:text-red-500 transition-colors font-medium text-sm bg-black text-white p-2 rounded-full flex flex-col items-center justify-center w-16 h-16'>
            <AiFillProduct/>
            Products
            </Link>
            <Link href={'/offers'} className='hover:text-red-500 transition-colors font-medium text-sm bg-black text-white p-2 rounded-full flex flex-col items-center justify-center w-16 h-16'>
                <MdLocalOffer />
                Offer
            </Link>
            <button
                onClick={() => setCartbar(!cartbar)}
                className='hover:text-red-500 transition-colors cursor-pointer bg-black text-white p-2 rounded-full flex flex-col items-center justify-center w-16 h-16'
            >
                <BiCart />
                Cart
            </button>
            {
                user ? (
                    <Link href={'/user'}> Hi, {user.name.split(' ')[0]}</Link>
                ) : (
                    <Link href={'/login'} className='hover:text-red-500 transition-colors font-medium text-sm bg-black text-white p-2 rounded-full flex flex-col items-center justify-center w-16 h-16'>
                        <FiLogIn/>
                        Login
                        </Link>
                )
            }
        </div>
    )
}

export default Menubar