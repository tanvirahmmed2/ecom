'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'


const Categorybar = () => {

    const { categories } = useContext(Context)
    if (categories === null) return

    return (
        <div className='w-full bg-white shadow-sm h-14 hidden md:flex flex-row items-center justify-around gap-2 relative'>
            <div className='w-auto flex flex-row items-center justify-center gap-4'>
                {
                categories.map((c) => (
                    <div key={c.id} className='relative px-7 h-14 group'>
                        <button className='w-auto h-14 flex items-center justify-center cursor-pointer' >{c.category}</button>
                        {
                            c.subcategory.length > 0 && <div className={`w-full absolute flex-col gap-1 group-hover:flex hidden`}>
                                {c.subcategory.map((sc) => (
                                    <Link href={`/products/category/${sc}`} key={sc}>{sc}</Link>
                                ))}
                            </div>
                        }
                    </div>
                ))
            }
            </div>

            <Link href={'/products'}>Filter</Link>
        </div>
    )
}

export default Categorybar