'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import { BiCart, BiHome } from 'react-icons/bi'
import { Context } from '../helper/Context'
import { MdLocalOffer } from 'react-icons/md'
import { AiFillProduct } from 'react-icons/ai'
import { FiLogIn, FiUser } from 'react-icons/fi'

const Menubar = () => {
    const { user, cartbar, setCartbar, website } = useContext(Context)
    const pathname = usePathname()

    const themeColor = website?.theme_color || '#ef4444'

    const getLinkClass = (isActive) => {
        return `relative p-3.5 rounded-full transition-all duration-300 flex items-center justify-center active:scale-90 ${
            isActive 
                ? 'bg-white/10 text-white scale-110 shadow-inner' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`
    }

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden bg-slate-950/90 backdrop-blur-xl py-2 px-5 rounded-full flex flex-row items-center justify-center gap-4 shadow-[0_15px_30px_-5px_rgba(0,0,0,0.6)] border border-white/10">
            {/* Home */}
            <Link href="/" className={getLinkClass(pathname === '/')} title="Home">
                <BiHome className="text-2xl" />
                {pathname === '/' && (
                    <span 
                        className="absolute bottom-1 w-1.5 h-1.5 rounded-full animate-pulse" 
                        style={{ backgroundColor: themeColor }}
                    />
                )}
            </Link>

            <Link href="/products" className={getLinkClass(pathname === '/products')} title="Products">
                <AiFillProduct className="text-2xl" />
                {pathname === '/products' && (
                    <span 
                        className="absolute bottom-1 w-1.5 h-1.5 rounded-full animate-pulse" 
                        style={{ backgroundColor: themeColor }}
                    />
                )}
            </Link>

            {/* Offers */}
            <Link href="/offers" className={getLinkClass(pathname === '/offers')} title="Offers">
                <MdLocalOffer className="text-2xl" />
                {pathname === '/offers' && (
                    <span 
                        className="absolute bottom-1 w-1.5 h-1.5 rounded-full animate-pulse" 
                        style={{ backgroundColor: themeColor }}
                    />
                )}
            </Link>

            {/* Cart */}
            <button
                onClick={() => setCartbar(!cartbar)}
                className={`${getLinkClass(cartbar)} cursor-pointer`}
                title="Cart"
            >
                <BiCart className="text-2xl" />
                {cartbar && (
                    <span 
                        className="absolute bottom-1 w-1.5 h-1.5 rounded-full animate-pulse" 
                        style={{ backgroundColor: themeColor }}
                    />
                )}
            </button>

            {/* User Profile / Login */}
            {user ? (
                <Link href="/user" className={getLinkClass(pathname?.startsWith('/user'))} title="Profile">
                    <FiUser className="text-2xl" />
                    {pathname?.startsWith('/user') && (
                        <span 
                            className="absolute bottom-1 w-1.5 h-1.5 rounded-full animate-pulse" 
                            style={{ backgroundColor: themeColor }}
                        />
                    )}
                </Link>
            ) : (
                <Link href="/login" className={getLinkClass(pathname === '/login')} title="Login">
                    <FiLogIn className="text-2xl" />
                    {pathname === '/login' && (
                        <span 
                            className="absolute bottom-1 w-1.5 h-1.5 rounded-full animate-pulse" 
                            style={{ backgroundColor: themeColor }}
                        />
                    )}
                </Link>
            )}
        </div>
    )
}

export default Menubar

