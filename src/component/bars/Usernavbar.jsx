'use client'
import React, { useContext } from 'react'
import { BiMenu } from 'react-icons/bi'
import { Context } from '../helper/Context'
import Link from 'next/link'

const Usernavbar = () => {
  const { user, userSidebar, setUserSidebar } = useContext(Context)
  console.log(user)
  return (
    <div className='w-full h-14 bg-slate-900 fixed top-0 z-40 text-white flex items-center justify-between px-4'>

      <div className='w-auto h-14 flex items-center justify-center gap-4'>
        <button className='text-2xl cursor-pointer' onClick={() => setUserSidebar(!userSidebar)} ><BiMenu /></button>
        <Link href={'/user'}>Panel</Link>
      </div>
      <div className='w-auto flex flex-row items-center justify-center gap-4'>
        {
          user?.role !== 'user' && <Link href={'/dashboard'}>Dashboard</Link>
        }
        <h1>{user?.name}</h1>
      </div>
    </div>
  )
}

export default Usernavbar