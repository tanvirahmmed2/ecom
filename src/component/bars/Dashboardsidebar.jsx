'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BiCategory, 
  BiTag, 
  BiPackage, 
  BiMessageSquareDetail, 
  BiLogOut, 
  BiChevronRight,
  BiHome,
  BiUser,
  BiDollarCircle,
  BiFile,
  BiCog,
  BiUserVoice,
  BiCart,
  BiHistory,
  BiArrowBack,
  BiTime,
  BiCheckCircle,
  BiStoreAlt
} from 'react-icons/bi'

const Dashboardsidebar = () => {
    const { dashSidebar, logout, user } = useContext(Context)
    const pathname = usePathname()

    const isActive = (path) => pathname === path || pathname.startsWith(path + '/')

    const adminLinks = [
      { name: 'Overview', path: '/dashboard/admin/overview', icon: <BiHome /> },
      { name: 'People (Accounts)', path: '/dashboard/admin/people', icon: <BiUser /> },
      { name: 'Sales', path: '/dashboard/admin/sales', icon: <BiDollarCircle /> },
      { name: 'Stock', path: '/dashboard/admin/stock', icon: <BiPackage /> },
      { name: 'Payments', path: '/dashboard/admin/payments', icon: <BiDollarCircle /> },
      { name: 'Reviews', path: '/dashboard/admin/reviews', icon: <BiUserVoice /> },
      { name: 'Issue Log', path: '/dashboard/admin/issue', icon: <BiMessageSquareDetail /> },
      { name: 'Reports', path: '/dashboard/admin/report', icon: <BiFile /> },
      { name: 'Settings', path: '/dashboard/admin/settings', icon: <BiCog /> },
    ]

    const managerLinks = [
      { name: 'Overview', path: '/dashboard/manager/overview', icon: <BiHome /> },
      { name: 'Categories', path: '/dashboard/manager/category', icon: <BiCategory /> },
      { name: 'Brands', path: '/dashboard/manager/brands', icon: <BiTag /> },
      { name: 'Products', path: '/dashboard/manager/product', icon: <BiPackage /> },
      { name: 'Issues', path: '/dashboard/manager/issues', icon: <BiMessageSquareDetail /> },
      { name: 'Purchases', path: '/dashboard/manager/purchase', icon: <BiDollarCircle /> },
      { name: 'Sales', path: '/dashboard/manager/sales', icon: <BiDollarCircle /> },
      { name: 'Stock', path: '/dashboard/manager/stock', icon: <BiPackage /> },
      { name: 'Suppliers', path: '/dashboard/manager/supplier', icon: <BiStoreAlt /> },
      { name: 'Customers', path: '/dashboard/manager/customers', icon: <BiUser /> },
      { name: 'Support Tickets', path: '/dashboard/manager/support', icon: <BiMessageSquareDetail /> },
      { name: 'Contact Messages', path: '/dashboard/manager/contact', icon: <BiMessageSquareDetail /> },
      { name: 'Reviews', path: '/dashboard/manager/reviews', icon: <BiUserVoice /> },
      { name: 'Payments', path: '/dashboard/manager/payments', icon: <BiDollarCircle /> },
      { name: 'Returns', path: '/dashboard/manager/return', icon: <BiArrowBack /> },
      { name: 'Reports', path: '/dashboard/manager/report', icon: <BiFile /> },
    ]

    const salesLinks = [
      { name: 'Create Sale', path: '/dashboard/sales/sale', icon: <BiCart /> },
      { name: 'Pending Sales', path: '/dashboard/sales/pending-sale', icon: <BiTime /> },
      { name: 'Completed Sales', path: '/dashboard/sales/completed-sale', icon: <BiCheckCircle /> },
      { name: 'Payments', path: '/dashboard/sales/payments', icon: <BiDollarCircle /> },
      { name: 'History', path: '/dashboard/sales/history', icon: <BiHistory /> },
      { name: 'Report Issue', path: '/dashboard/sales/issue', icon: <BiMessageSquareDetail /> },
    ]

    let links = []
    if (user?.role === 'admin') {
      links = adminLinks
    } else if (user?.role === 'manager') {
      links = managerLinks
    } else if (user?.role === 'sales') {
      links = salesLinks
    }

    return (
        <div className={`${dashSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out w-64 h-[calc(100vh-3.5rem)] fixed top-14 left-0 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col justify-between p-4 z-30`}>
            
            <div className="w-full flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1">
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {user?.role || 'Management'} Dashboard
                </div>

                {links.map((link) => {
                  const active = isActive(link.path)
                  return (
                    <Link 
                      key={link.path}
                      href={link.path} 
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active 
                          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/20' 
                          : 'hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{link.icon}</span>
                        <span>{link.name}</span>
                      </div>
                      <BiChevronRight className="text-slate-500" />
                    </Link>
                  )
                })}
            </div>

            {/* Fixed footer logout section */}
            <div className="w-full pt-4 border-t border-slate-800 flex flex-col gap-2 shrink-0">
                <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-slate-800 hover:text-white transition">
                    <BiHome className="text-lg" />
                    <span>Shop Home</span>
                </Link>
                <button 
                  onClick={() => logout()} 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-red-950/30 hover:text-red-400 text-slate-400 transition cursor-pointer"
                >
                    <BiLogOut className="text-lg" />
                    <span>Logout</span>
                </button>
            </div>

        </div>
    )
}

export default Dashboardsidebar