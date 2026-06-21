import { isAdmin } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata = {
  title: "Dashboard - Admin | Ecom - New Era of Shopping",
  description: "Explore Dashboard - Admin page on Ecom, the fastest, secure, and trusted e-commerce platform.",
}

export default async function DashboardAdminLayout({ children }) {
  const auth=await isAdmin()
    if(!auth.success) redirect('/dashboard')
  return (
    <>
      {children}
    </>
  )
}
