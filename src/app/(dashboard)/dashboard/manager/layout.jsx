import { isManager } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata = {
  title: "Dashboard - Manager | Ecom - New Era of Shopping",
  description: "Explore Dashboard - Manager page on Ecom, the fastest, secure, and trusted e-commerce platform.",
}

export default async function DashboardManagerLayout({ children }) {
  const auth=await isManager()
    if(!auth.success) redirect('/dashboard')
  return (
    <>
      {children}
    </>
  )
}
