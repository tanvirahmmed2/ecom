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
    const {cartBar, setCartBar}=useContext(Context)
    const {menuBar, setMenuBar}=useContext(Context)

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
                <Link href={'/login'} className='text-slate-900 bg-white px-4 rounded-2xl'>Login</Link>
            </div>
        </nav>
    )
}

export default Navbar