'use client'

import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { BiCart } from 'react-icons/bi';
import { FiSearch } from "react-icons/fi";
import { Context } from '../helper/Context';
import { MdMenu } from 'react-icons/md';

const Navbar = () => {
    const [lastScroll, setLastScroll] = useState(0)
    const [showNavbar, setShowNavbar] = useState(true)
    const {cartBar, setCartBar, menuBar, setMenuBar, user, loading, logout}=useContext(Context)

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
            <button className='text-2xl flex md:hidden' onClick={()=>setMenuBar(!menuBar)}><MdMenu/></button>
            <Link href={'/'} className='text-xl font-semibold'>Ecom</Link>

            <div className='w-auto flex flex-row items-center justify-center h-10 rounded-xl bg-white overflow-hidden'>
                <input type="text" onChange={(e) => setSearchValue(e.target.value)} className='outline-none w-full p-2 text-black' />
                <Link href={`/search?v=${searchValue}`} className='w-auto bg-red-600 text-white p-2 flex items-center justify-center h-12'><FiSearch /></Link>
            </div>

            <div className='w-auto hidden md:flex flex-row items-center justify-center gap-4 h-14'>
                <Link href={'/offers'}>Offers</Link>
                <Link href={'/about'}>About</Link>
                <button onClick={()=>setCartBar(!cartBar)} className='text-xl text-red-600'><BiCart /></button>
                {loading ? (
                    <span className="text-xs text-slate-400">Loading...</span>
                ) : user ? (
                    <div className="flex items-center gap-3">
                        <Link href={'/user'} className="text-sm text-slate-200">Hi, {user.name.split(' ')[0]}</Link>
                        <button onClick={async () => {
                            try {
                                await logout();
                            } catch (e) {
                                console.error(e);
                            }
                        }} className="text-white cursor-pointer bg-red-600 px-3 py-1 rounded-2xl text-sm font-medium hover:bg-red-700 transition">
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link href={'/login'} className='text-slate-900 bg-white px-4 py-1 rounded-2xl font-medium'>Login</Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar