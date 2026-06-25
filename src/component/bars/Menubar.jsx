'use client'
import Link from 'next/link'
import React, { useContext, useState } from 'react'
import { BiCart } from 'react-icons/bi'
import { Context } from '../helper/Context'
import { MdLocalOffer } from 'react-icons/md'
import { AiFillProduct } from 'react-icons/ai'
import { FiLogIn, FiUser } from 'react-icons/fi'

const Menubar = () => {
    const { user, cartbar, setCartbar, website } = useContext(Context)

    // Common style for links/buttons inside the Menubar
    const itemClass = 'hover:text-red-500 transition-colors font-medium text-[10px] bg-black text-white p-2 rounded-full flex flex-col items-center justify-center w-14 h-14 shadow-md border border-neutral-800'

    return (
        <div
            className="fixed bottom-6 left-4 right-4 z-50 md:hidden bg-white/40 dark:bg-slate-900/80 backdrop-blur-md p-2 rounded-2xl flex flex-row items-center justify-around shadow-xl border border-white/20"
        >
            <Link href={'/products'} className={itemClass}>
                <AiFillProduct className="text-xl mb-0.5" />
                <span>Products</span>
            </Link>
            <Link href={'/offers'} className={itemClass}>
                <MdLocalOffer className="text-xl mb-0.5" />
                <span>Offers</span>
            </Link>
            <button
                onClick={() => setCartbar(!cartbar)}
                className={`${itemClass} cursor-pointer`}
            >
                <BiCart className="text-xl mb-0.5" />
                <span>Cart</span>
            </button>
            {
                user ? (
                    <Link href={'/user'} className={itemClass}>
                        <FiUser className="text-xl mb-0.5" />
                        <span>Profile</span>
                    </Link>
                ) : (
                    <Link href={'/login'} className={itemClass}>
                        <FiLogIn className="text-xl mb-0.5" />
                        <span>Login</span>
                    </Link>
                )
            }
        </div>
    )
}

export default Menubar
