'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'

const Usersidebar = () => {
    const { userSidebar, logout } = useContext(Context)
    return (
        <div className={`${userSidebar ? 'flex' : 'hidden'} w-48 min-h-screen fixed top-14 left-0 bg-slate-800 text-white flex-col gap-2 p-4 justify-between pb-20`}>

            <div className='w-full flex flex-col gap-3'>
                <Link href={'/user/history'}>History</Link>
                <Link href={'/user/payments'}>payments</Link>
                <Link href={'/user/reviews'}>Reviews</Link>
                <Link href={'/user/support'}>Support</Link>
            </div>
            <div className='w-full flex flex-col gap-3'>

                <Link href={'/'}>Shop</Link>
                <Link href={'/user/settings'}>Settings</Link>
                <button onClick={() => logout()} className='w-full text-left'>Logout</button>
            </div>

        </div>
    )
}

export default Usersidebar