import Usernavbar from '@/component/bars/Usernavbar'
import Usersidebar from '@/component/bars/Usersidebar'
import { isUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata = {
  title: "User | Ecom - New Era of Shopping",
  description: "Explore User page on Ecom, the fastest, secure, and trusted e-commerce platform.",
}

export default async function UserLayout({ children }) {
  const auth=await isUser()
  if(!auth.success) redirect('/login')
  return (
    <div className='w-full relative overflow-x-hidden pt-14'>
      <Usernavbar/>
      <Usersidebar/>
      {children}
    </div>
  )
}
