'use client'

import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import { BiCart } from 'react-icons/bi';
import { FiSearch, FiChevronDown, FiUser, FiSliders, FiLogOut } from "react-icons/fi";
import { Context } from '../helper/Context';
import axios from 'axios';

const Navbar = () => {
    const router = useRouter()
    const [lastScroll, setLastScroll] = useState(0)
    const [showNavbar, setShowNavbar] = useState(true)
    const { cartbar, setCartbar, user, loading, logout, website } = useContext(Context)

    const [searchValue, setSearchValue] = useState('')
    const [allProducts, setAllProducts] = useState([])
    const [searchResults, setSearchResults] = useState([])
    const [showDropdown, setShowDropdown] = useState(false)

    // Fetch products once on focus to act as instant search cache
    const handleFocus = async () => {
        if (allProducts.length === 0) {
            try {
                const res = await axios.get('/api/product')
                setAllProducts(res.data.filter(p => p.is_active !== false))
            } catch (err) {
                console.error("Failed to fetch products for instant search", err)
            }
        }
        setShowDropdown(true)
    }

    const handleSearchChange = (e) => {
        const val = e.target.value
        setSearchValue(val)
        if (!val.trim()) {
            setSearchResults([])
            return
        }
        const filtered = allProducts.filter(p => 
            p.name.toLowerCase().includes(val.toLowerCase()) ||
            (p.category_name && p.category_name.toLowerCase().includes(val.toLowerCase())) ||
            (p.brand_name && p.brand_name.toLowerCase().includes(val.toLowerCase()))
        )
        setSearchResults(filtered.slice(0, 5))
    }

    const handleSearchSubmit = (e) => {
        if (e) {
            e.preventDefault()
            e.stopPropagation()
        }
        if (searchValue.trim()) {
            router.push(`/search?v=${encodeURIComponent(searchValue.trim())}`)
            setShowDropdown(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearchSubmit()
        }
    }

    const handleBlur = () => {
        setTimeout(() => {
            setShowDropdown(false)
        }, 200)
    }

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
            <Link href={'/'} className='flex items-center gap-2 text-xl font-bold hover:opacity-90 transition'>
                {website?.logo_url ? (
                    <img src={website.logo_url} alt={website.name || 'Ecom'} className="h-8 w-auto object-contain max-w-[120px]" />
                ) : (
                    <span>{website?.name || 'Ecom'}</span>
                )}
            </Link>

            <div className='relative w-48 sm:w-64 md:w-80 flex flex-col z-50'>
                <div className='w-full flex flex-row items-center justify-between h-10 rounded-xl bg-white overflow-hidden border border-slate-200 shadow-sm focus-within:border-slate-400 transition-colors'>
                    <input 
                        type="text" 
                        placeholder="Search products..."
                        value={searchValue}
                        onChange={handleSearchChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className='outline-none w-full px-3 py-2 text-black text-sm bg-transparent placeholder-slate-400' 
                    />
                    <button 
                        onClick={handleSearchSubmit}
                        style={{ backgroundColor: website?.theme_color || '#dc2626' }}
                        className='w-12 text-white flex items-center justify-center h-10 transition hover:brightness-95 cursor-pointer flex-shrink-0'
                    >
                        <FiSearch />
                    </button>
                </div>

                {showDropdown && searchValue.trim() && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden text-slate-800 flex flex-col p-2 gap-1">
                        {searchResults.length > 0 ? (
                            <>
                                {searchResults.map(p => (
                                    <Link
                                        key={p.product_id}
                                        href={`/products/${p.slug}`}
                                        className="flex flex-row items-center gap-3 p-2 hover:bg-slate-50 rounded-xl transition"
                                    >
                                        <img 
                                            src={p.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'} 
                                            alt={p.name} 
                                            className="w-9 h-9 object-cover rounded-lg border border-slate-100 flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-xs font-semibold text-slate-800 truncate">{p.name}</h4>
                                            <p className="text-[10px] text-slate-400 truncate">{p.category_name || 'General'}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <span className="text-xs font-bold text-slate-900">
                                                ৳{(p.discount_price && parseFloat(p.discount_price) > 0)
                                                    ? Math.max(0, parseFloat(p.sale_price) - parseFloat(p.discount_price)).toFixed(2)
                                                    : parseFloat(p.sale_price).toFixed(2)}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                                {allProducts.filter(p => 
                                    p.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                                    (p.category_name && p.category_name.toLowerCase().includes(searchValue.toLowerCase())) ||
                                    (p.brand_name && p.brand_name.toLowerCase().includes(searchValue.toLowerCase()))
                                ).length > 5 && (
                                    <button
                                        onClick={handleSearchSubmit}
                                        className="w-full text-center py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl border-t border-slate-100 mt-1 transition cursor-pointer"
                                    >
                                        View all results
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="p-4 text-center text-xs text-slate-400">
                                No products found
                            </div>
                        )}
                    </div>
                )}
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