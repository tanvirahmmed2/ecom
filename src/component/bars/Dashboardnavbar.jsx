'use client'
import React, { useContext } from 'react'
import { BiMenu } from 'react-icons/bi'
import { Context } from '../helper/Context'
import Link from 'next/link'

const Dashboardnavbar = () => {
    const {user,dashSidebar, setDashSidebar}=useContext(Context)
    console.log(user)
  return (
    <div className='w-full h-14 bg-slate-900 fixed top-0 z-40 text-white flex items-center justify-between px-4'>
        
        <div className='w-auto h-14 flex items-center justify-center gap-4'>
           <button className='text-2xl cursor-pointer' onClick={()=>setDashSidebar(!dashSidebar)} ><BiMenu/></button> 
           <Link href={'/dashboard'}>Dashboard</Link>
        </div>
        <h1>{user?.name}</h1>
    </div>
  )
}

export default Dashboardnavbar 