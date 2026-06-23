'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'


const Categorybar = () => {

    const { categories } = useContext(Context)
    if (!categories || categories.length === 0) return null

    return (
        <div className='w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm h-14 hidden md:flex flex-row items-center justify-around gap-2 relative z-40'>
            <div className='w-auto flex flex-row items-center justify-center gap-2 h-full'>
                {
                    categories.map((c) => (
                        <div key={c.id} className='relative px-4 h-full group flex items-center'>
                            <Link 
                                href={`/products/category/${c.slug}`}
                                className='text-sm font-semibold text-slate-700 hover:text-emerald-600 transition-colors duration-200 h-full flex items-center cursor-pointer border-b-2 border-transparent group-hover:border-emerald-500'
                            >
                                {c.category}
                            </Link>
                            {
                                c.subcategory && c.subcategory.length > 0 && (
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 w-48 bg-white border border-slate-100 rounded-xl shadow-xl p-2 flex flex-col gap-0.5 opacity-0 invisible scale-95 group-hover:opacity-100 group-hover:visible group-hover:scale-100 transition-all duration-200 z-50">
                                        {c.subcategory.map((sc) => (
                                            <Link 
                                                href={`/products/category/${sc.slug}`} 
                                                key={sc.id}
                                                className="px-3.5 py-2 text-xs font-bold text-slate-650 hover:bg-slate-50 hover:text-emerald-600 rounded-lg transition-colors block text-left"
                                            >
                                                {sc.name}
                                            </Link>
                                        ))}
                                    </div>
                                )
                            }
                        </div>
                    ))
                }
            </div>

            <Link 
                href='/products'
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
                Filter Products
            </Link>
        </div>
    )
}

export default Categorybar