'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import { 
  BiCategory, 
  BiTag, 
  BiPackage, 
  BiDollarCircle,
  BiMessageSquareDetail,
  BiStoreAlt,
  BiUser,
  BiSupport,
  BiEnvelope,
  BiArrowBack,
  BiFile,
  BiHome,
  BiChevronRight,
  BiLoaderAlt,
  BiShieldQuarter
} from 'react-icons/bi'

export default function DashboardManagerPage() {
  const { dashSidebar, user, loading: userLoading, logout } = useContext(Context)
  const [stats, setStats] = useState({ categories: 0, brands: 0, products: 0 })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard/stats')
        setStats(res.data)
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err)
      } finally {
        setStatsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (userLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
          <p className="text-slate-650 text-sm font-semibold animate-pulse">Loading manager dashboard...</p>
        </div>
      </div>
    )
  }

  const isManager = user && ['admin', 'manager'].includes(user.role)
  if (!isManager) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-4 text-center">
          <BiShieldQuarter className="text-5xl text-rose-500 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-slate-605 text-sm">Please sign in with a Manager account to view this panel.</p>
          <Link href="/login" className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-sm">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'MN'

  const managerLinks = [
    {
      name: 'Overview Dashboard',
      description: "Analyze key sales trends, inventory valuations, and order volumes.",
      path: '/dashboard/manager/overview',
      icon: <BiHome />,
      color: 'bg-emerald-50 text-emerald-600 hover:border-emerald-500'
    },
    {
      name: 'Categories Catalog',
      description: "Manage classification groups, add nesting, and upload category banners.",
      path: '/dashboard/manager/category',
      icon: <BiCategory />,
      color: 'bg-blue-50 text-blue-600 hover:border-blue-500'
    },
    {
      name: 'Brands Catalog',
      description: "Define manufacturer names, upload logos, and toggle active status.",
      path: '/dashboard/manager/brands',
      icon: <BiTag />,
      color: 'bg-indigo-50 text-indigo-600 hover:border-indigo-500'
    },
    {
      name: 'Products Catalog',
      description: "Update pricing tiers, define product variants, images, and description details.",
      path: '/dashboard/manager/product',
      icon: <BiPackage />,
      color: 'bg-purple-50 text-purple-600 hover:border-purple-500'
    },
    {
      name: 'Issues Logbook',
      description: "Submit and review internal announcements and team reports.",
      path: '/dashboard/manager/issues',
      icon: <BiMessageSquareDetail />,
      color: 'bg-cyan-50 text-cyan-600 hover:border-cyan-500'
    },
    {
      name: 'Purchases Desk',
      description: "Manage vendor purchases, create orders, and check invoices.",
      path: '/dashboard/manager/purchase',
      icon: <BiDollarCircle />,
      color: 'bg-teal-50 text-teal-600 hover:border-teal-500'
    },
    {
      name: 'Sales Ledger',
      description: "Review client order checkouts, confirm transactions, and track shipping.",
      path: '/dashboard/manager/sales',
      icon: <BiDollarCircle />,
      color: 'bg-emerald-50 text-emerald-600 hover:border-emerald-500'
    },
    {
      name: 'Stock Valuations',
      description: "Audit item transactions, inventory log entries, and adjust units.",
      path: '/dashboard/manager/stock',
      icon: <BiPackage />,
      color: 'bg-amber-50 text-amber-600 hover:border-amber-500'
    },
    {
      name: 'Suppliers Catalog',
      description: "Register wholesale supply contacts, companies, and billing details.",
      path: '/dashboard/manager/supplier',
      icon: <BiStoreAlt />,
      color: 'bg-blue-50 text-blue-600 hover:border-blue-500'
    },
    {
      name: 'Customers Registry',
      description: "Review customer logs, account activities, and address checklists.",
      path: '/dashboard/manager/customers',
      icon: <BiUser />,
      color: 'bg-indigo-50 text-indigo-600 hover:border-indigo-500'
    },
    {
      name: 'Support Tickets',
      description: "Access customer support inquiries, reply to tickets, and update status.",
      path: '/dashboard/manager/support',
      icon: <BiSupport />,
      color: 'bg-rose-50 text-rose-600 hover:border-rose-500'
    },
    {
      name: 'Contact Messages',
      description: "Inspect generic queries, write responses, and send client email updates.",
      path: '/dashboard/manager/contact',
      icon: <BiEnvelope />,
      color: 'bg-rose-50 text-rose-600 hover:border-rose-550 bg-rose-50 text-rose-600 hover:border-rose-500'
    },
    {
      name: 'Reviews Moderation',
      description: "Approve customer product feedback and reviews or reject inappropriate posts.",
      path: '/dashboard/manager/reviews',
      icon: <BiSupport />,
      color: 'bg-indigo-50 text-indigo-600 hover:border-indigo-500'
    },
    {
      name: 'Payments Audit',
      description: "Audit order invoices, transaction numbers, and due balances.",
      path: '/dashboard/manager/payments',
      icon: <BiDollarCircle />,
      color: 'bg-cyan-50 text-cyan-600 hover:border-cyan-500'
    },
    {
      name: 'Returns & Refunds',
      description: "Track return logs, log damage assessments, and approve cash refunds.",
      path: '/dashboard/manager/return',
      icon: <BiArrowBack />,
      color: 'bg-orange-50 text-orange-600 hover:border-orange-500'
    },
    {
      name: 'Reports Center',
      description: "Generate sales taxesheets, stock audits, and performance records.",
      path: '/dashboard/manager/report',
      icon: <BiFile />,
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
                <span className="px-2.5 py-0.5 rounded text-xxs font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                  Manager Dashboard
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div className="flex flex-col gap-1">
              <span className="text-slate-455 text-slate-400 text-sm font-medium">Total Categories</span>
              <span className="text-3xl font-bold text-slate-800">
                {statsLoading ? <span className="animate-pulse">...</span> : stats.categories}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
              <BiCategory />
            </div>
          </div>

          {/* Brands Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div className="flex flex-col gap-1">
              <span className="text-slate-455 text-slate-400 text-sm font-medium">Total Brands</span>
              <span className="text-3xl font-bold text-slate-800">
                {statsLoading ? <span className="animate-pulse">...</span> : stats.brands}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
              <BiTag />
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div className="flex flex-col gap-1">
              <span className="text-slate-455 text-slate-400 text-sm font-medium">Total Products</span>
              <span className="text-3xl font-bold text-slate-800">
                {statsLoading ? <span className="animate-pulse">...</span> : stats.products}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
              <BiPackage />
            </div>
          </div>
        </div>

        {/* Manager Links */}
        <div>
          <h2 className="text-base font-bold text-slate-805 text-slate-800 mb-6">Manager Navigation Center</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {managerLinks.map((link) => (
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
                  className="mt-6 flex items-center gap-1.5 text-slate-800 font-bold text-xs hover:gap-2.5 transition-all group-hover:text-blue-650 group-hover:text-blue-600"
                >
                  Manage Module <BiChevronRight className="text-base" />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
