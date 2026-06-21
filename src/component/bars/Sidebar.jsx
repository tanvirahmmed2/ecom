'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'

const Sidebar = () => {
    const { menuBar, user, logout } = useContext(Context)
    return (
        <div className={`w-48  ${menuBar ? 'flex' : "hidden"} md:hidden fixed top-0 z-40 min-h-screen pt-4 pb-14 flex flex-col justify-between p-4 bg-slate-800 text-white`}>
            <div className='w-full flex flex-col gap-4'>
                <Link href={'/'}>Home</Link>
                <Link href={'/offers'}>Offers</Link>
                <Link href={'/products'}>Products</Link>
                <Link href={'/contact'}>Contact</Link>
                <Link href={'/about'}>About</Link>
                <Link href={'/reviews'}>Reviews</Link>
            </div>
            {
                user !== null ? <div className='w-full flex flex-col gap-2'>
                    <Link href={'/user'}>Panel</Link>
                    {
                        user?.role !== 'user' && <Link href={'/dashboard'}>Dashboard</Link>
                    }
                    <button className='' onClick={() => logout()}>Logout</button>
                </div> : <div className='w-full flex flex-col gap-2'>
                    <Link href={'/login'}>Login</Link>
                    <Link href={'/register'}>Register</Link>
                </div>
            }

        </div>
    )
}

export default Sidebar