'use client'

import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { BiCart } from 'react-icons/bi';
import { FiSearch, FiChevronDown, FiUser, FiSliders, FiLogOut } from "react-icons/fi";
import { Context } from '../helper/Context';

const Navbar = () => {
    const [lastScroll, setLastScroll] = useState(0)
    const [showNavbar, setShowNavbar] = useState(true)
    const { cartbar, setCartbar, user, loading, logout } = useContext(Context)

    const [searchValue, setSearchValue] = useState(null)

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY
            if (currentScroll <= 10) {
                setShowNavbar(true)
            }
            else if (currentScroll > lastScroll) {
                setShowNavbar(false)
            }
            else {
                setShowNavbar(true)
            }

            setLastScroll(currentScroll)
        }

        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScroll])

    return (
        <nav className={` w-full h-14 bg-slate-900 transition-transform duration-300 ${showNavbar ? 'flex' : 'hidden'} flex-row items-center justify-around text-white`}  >
            <Link href={'/'} className='text-xl font-semibold'>Ecom</Link>

            <div className='w-auto flex flex-row items-center justify-center h-10 rounded-xl bg-white overflow-hidden'>
                <input type="text" onChange={(e) => setSearchValue(e.target.value)} className='outline-none w-full p-2 text-black' />
                <Link href={`/search?v=${searchValue}`} className='w-auto bg-red-600 text-white p-2 flex items-center justify-center h-12'><FiSearch /></Link>
            </div>

            <div className='w-auto hidden md:flex flex-row items-center justify-center gap-4 h-14'>
                <Link href={'/offers'}>Offers</Link>
                <Link href={'/about'}>About</Link>
                <button onClick={() => setCartbar(!cartbar)} className='text-xl text-red-600'><BiCart /></button>
                {loading ? (
                    <span className="text-xs text-slate-400">Loading...</span>
                ) : user ? (
                    <div className="flex items-center gap-3 relative z-50">
                        <div className='w-auto group relative py-2'>
                            <button className="text-sm text-slate-200 cursor-pointer flex items-center gap-1 font-semibold hover:text-white transition">
                                Hi, {user.name.split(' ')[0]}
                                <FiChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                            </button>

                            <div className='absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-100 rounded-2xl shadow-lg p-2 text-slate-800 flex flex-col gap-1 z-50 invisible opacity-0 translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200'>
                                <Link href={'/user'} className="px-3 py-2 text-sm font-semibold hover:bg-slate-50 rounded-xl transition flex items-center gap-2 text-slate-700 hover:text-slate-900">
                                    <FiUser className="w-4 h-4 text-slate-400" /> Profile Panel
                                </Link>
                                {user?.role !== 'user' && (
                                    <Link href={'/dashboard'} className="px-3 py-2 text-sm font-semibold hover:bg-slate-50 rounded-xl transition flex items-center gap-2 text-slate-700 hover:text-slate-900">
                                        <FiSliders className="w-4 h-4 text-slate-400" /> Admin Dashboard
                                    </Link>
                                )}
                                <div className="border-t border-slate-100 my-1"></div>
                                <button
                                    onClick={async () => {
                                        try {
                                            await logout();
                                        } catch (e) {
                                            console.error(e);
                                        }
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition flex items-center gap-2 cursor-pointer"
                                >
                                    <FiLogOut className="w-4 h-4" /> Logout
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Link href={'/login'} className='text-slate-900 bg-white px-4 py-1.5 rounded-2xl font-semibold text-sm hover:bg-slate-100 transition'>Login</Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar