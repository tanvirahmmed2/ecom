import Dashboardnavbar from '@/component/bars/Dashboardnavbar'
import Dashboardsidebar from '@/component/bars/Dashboardsidebar'
import { isManagementRole } from '@/lib/auth'
import { redirect } from 'next/navigation'
import React from 'react'

export const metadata = {
  title: "Dashboard | Ecom - New Era of Shopping",
  description: "Explore Dashboard page on Ecom, the fastest, secure, and trusted e-commerce platform.",
}

export default async function DashboardLayout({ children }) {
  const auth=await isManagementRole()
  if(!auth.success) redirect('/user')
  return (
    <div className='w-full overflow-x-hidden relative'>
      <Dashboardnavbar/>
      <Dashboardsidebar/>
      {children}
    </div>
  )
}
