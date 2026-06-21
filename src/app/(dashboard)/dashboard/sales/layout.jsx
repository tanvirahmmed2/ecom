import { isSales } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata = {
  title: "Dashboard - Sales | Ecom - New Era of Shopping",
  description: "Explore Dashboard - Sales page on Ecom, the fastest, secure, and trusted e-commerce platform.",
}

export default async function DashboardSalesLayout({ children }) {
  const auth=await isSales()
    if(!auth.success) redirect('/dashboard')
  return (
    <>
      {children}
    </>
  )
}
