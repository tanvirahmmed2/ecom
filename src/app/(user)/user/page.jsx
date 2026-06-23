'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import { 
  BiHistory, 
  BiDollarCircle, 
  BiUserVoice, 
  BiSupport, 
  BiCog, 
  BiHome,
  BiChevronRight,
  BiUserCircle,
  BiLoaderAlt
} from 'react-icons/bi'

export default function UserPage() {
  const { user, loading, logout } = useContext(Context)

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
          <p className="text-slate-650 text-sm font-semibold animate-pulse">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-4 text-center">
          <BiUserCircle className="text-5xl text-rose-500 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-slate-600 text-sm">Please log in to view your user profile details.</p>
          <Link href="/login" className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-sm">
            Log In
          </Link>
        </div>
      </div>
    )
  }

  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'US'

  const userLinks = [
    {
      name: 'Order History',
      description: 'Review your past orders, delivery tracking status, and invoice summaries.',
      path: '/user/history',
      icon: <BiHistory />,
      color: 'bg-emerald-50 text-emerald-600 hover:border-emerald-500'
    },
    {
      name: 'Payments Log',
      description: 'Track transaction details, methods, and receipt history.',
      path: '/user/payments',
      icon: <BiDollarCircle />,
      color: 'bg-blue-50 text-blue-600 hover:border-blue-500'
    },
    {
      name: 'My Reviews',
      description: 'Check ratings and comments you submitted for purchased products.',
      path: '/user/reviews',
      icon: <BiUserVoice />,
      color: 'bg-indigo-50 text-indigo-600 hover:border-indigo-500'
    },
    {
      name: 'Support Tickets',
      description: 'Submit issues and chat directly with customer support agents.',
      path: '/user/support',
      icon: <BiSupport />,
      color: 'bg-rose-50 text-rose-600 hover:border-rose-500'
    },
    {
      name: 'Account Settings',
      description: 'Update your display name, contact phone, and change password.',
      path: '/user/settings',
      icon: <BiCog />,
      color: 'bg-amber-50 text-amber-600 hover:border-amber-500'
    },
    {
      name: 'Back to Shop',
      description: 'Navigate back to the storefront homepage and browse products.',
      path: '/',
      icon: <BiHome />,
      color: 'bg-slate-100 text-slate-700 hover:border-slate-800'
    }
  ]

  return (
    <div className="w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Profile Card Summary Banner */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 text-white text-xl font-bold flex items-center justify-center shadow-md">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{user.name}</h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 text-xxs font-semibold uppercase tracking-wider rounded-md bg-slate-100 text-slate-700">
                  {user.role} Account
                </span>
                <span className={`px-2 py-0.5 text-xxs font-semibold uppercase tracking-wider rounded-md ${
                  user.is_active ? 'bg-emerald-55 bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {user.is_active ? 'Active' : 'Suspended'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 text-xs text-slate-500 font-medium">
            <div><span className="font-bold text-slate-750 text-slate-700">Phone:</span> {user.phone || 'N/A'}</div>
            <div className="mt-1"><span className="font-bold text-slate-750 text-slate-700">Member Since:</span> {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</div>
            <button 
              onClick={() => logout()}
              className="mt-3 text-left font-bold text-rose-650 text-rose-600 hover:underline cursor-pointer"
            >
              Sign Out Account
            </button>
          </div>
        </div>

        {/* Dashboard Grid Modules */}
        <div>
          <h2 className="text-base font-bold text-slate-850 text-slate-800 mb-6">Available User Modules</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userLinks.map((link) => (
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
                  className="mt-6 flex items-center gap-1.5 text-slate-800 font-bold text-xs hover:gap-2.5 transition-all group-hover:text-indigo-600"
                >
                  Access Module <BiChevronRight className="text-base" />
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
