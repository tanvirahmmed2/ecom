'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import { 
  BiHome,
  BiUser,
  BiDollarCircle,
  BiPackage,
  BiUserVoice,
  BiMessageSquareDetail,
  BiFile,
  BiCog,
  BiChevronRight,
  BiShieldQuarter,
  BiLoaderAlt
} from 'react-icons/bi'

export default function DashboardAdminPage() {
  const { user, loading, dashSidebar, logout } = useContext(Context)

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
          <p className="text-slate-650 text-sm font-semibold animate-pulse">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  const isAdmin = user && user.role === 'admin'
  if (!isAdmin) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-4 text-center">
          <BiShieldQuarter className="text-5xl text-rose-500 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-slate-605 text-sm">Please sign in with an Administrator account to view this panel.</p>
          <Link href="/login" className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-sm">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AD'

  const adminLinks = [
    {
      name: 'Overview stats',
      description: "Monitor catalog indicators, transaction counts, and store performance trends.",
      path: '/dashboard/admin/overview',
      icon: <BiHome />,
      color: 'bg-emerald-50 text-emerald-600 hover:border-emerald-500'
    },
    {
      name: 'People (Accounts)',
      description: "Manage system credentials. Deactivate or ban accounts and configure role levels.",
      path: '/dashboard/admin/people',
      icon: <BiUser />,
      color: 'bg-blue-50 text-blue-600 hover:border-blue-500'
    },
    {
      name: 'Sales Ledger',
      description: "Review comprehensive sales records, receipts, and order statuses.",
      path: '/dashboard/admin/sales',
      icon: <BiDollarCircle />,
      color: 'bg-indigo-50 text-indigo-600 hover:border-indigo-500'
    },
    {
      name: 'Stock Inventory',
      description: "Track inventory, log adjustments, and identify low stock levels.",
      path: '/dashboard/admin/stock',
      icon: <BiPackage />,
      color: 'bg-purple-50 text-purple-600 hover:border-purple-500'
    },
    {
      name: 'Payments Audit',
      description: "Inspect customer transaction invoices, processing logs, and payment receipts.",
      path: '/dashboard/admin/payments',
      icon: <BiDollarCircle />,
      color: 'bg-cyan-50 text-cyan-600 hover:border-cyan-500'
    },
    {
      name: 'User Reviews',
      description: "Inspect customer reviews, check scores, and update approval status.",
      path: '/dashboard/admin/reviews',
      icon: <BiUserVoice />,
      color: 'bg-rose-50 text-rose-600 hover:border-rose-500'
    },
    {
      name: 'Issue Log Logbook',
      description: "Review logs, technical errors, and messages submitted by store staff.",
      path: '/dashboard/admin/issue',
      icon: <BiMessageSquareDetail />,
      color: 'bg-amber-50 text-amber-600 hover:border-amber-500'
    },
    {
      name: 'Analytics Reports',
      description: "Generate sales tax sheets, stock checklists, and business summaries.",
      path: '/dashboard/admin/report',
      icon: <BiFile />,
      color: 'bg-teal-50 text-teal-600 hover:border-teal-500'
    },
    {
      name: 'Global Settings',
      description: "Update store banner texts, logo, contact points, and theme colors.",
      path: '/dashboard/admin/settings',
      icon: <BiCog />,
      color: 'bg-slate-100 text-slate-700 hover:border-slate-800'
    }
  ]

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Profile Card Banner */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 text-white text-xl font-bold flex items-center justify-center shadow-md">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{user.name}</h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded text-xxs font-bold bg-rose-50 text-rose-700 border border-rose-100 uppercase">
                  Administrator Console
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 text-xs text-slate-500 font-medium">
            <div><span className="font-bold text-slate-700">Phone:</span> {user.phone || 'N/A'}</div>
            <div className="mt-1"><span className="font-bold text-slate-700">Member Since:</span> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</div>
            <button 
              onClick={() => logout()}
              className="mt-3 text-left font-bold text-rose-600 hover:underline cursor-pointer"
            >
              Sign Out Account
            </button>
          </div>
        </div>

        {/* Available Modules */}
        <div>
          <h2 className="text-base font-bold text-slate-800 mb-6">Administrator Navigation Center</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminLinks.map((link) => (
              <div 
                key={link.path}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition group"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 transition ${link.color}`}>
                    {link.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base">{link.name}</h3>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    {link.description}
                  </p>
                </div>
                
                <Link 
                  href={link.path} 
                  className="mt-6 flex items-center gap-1.5 text-slate-800 font-bold text-xs hover:gap-2.5 transition-all group-hover:text-rose-600"
                >
                  Configure Module <BiChevronRight className="text-base" />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
