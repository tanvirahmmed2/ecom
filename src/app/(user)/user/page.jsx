'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'

export default function UserPage() {
  const { user, loading } = useContext(Context)

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 animate-pulse font-medium">Loading profile...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-4 text-center">
          <h1 className="text-2xl font-bold text-rose-600">Access Denied</h1>
          <p className="text-slate-600">Please log in to view your account details.</p>
          <Link href="/login" className="mt-4 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition cursor-pointer">
            Login
          </Link>
        </div>
      </div>
    )
  }

  // Get user initials for avatar
  const initials = user.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-slate-900 text-white text-xl font-bold flex items-center justify-center">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{user.name}</h1>
            <p className="text-sm text-slate-500 uppercase tracking-wider font-semibold">{user.role}</p>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex justify-between border-b border-slate-50 pb-2">
            <span className="text-sm font-semibold text-slate-500">Email Address</span>
            <span className="text-sm text-slate-800 font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-2">
            <span className="text-sm font-semibold text-slate-500">Phone Number</span>
            <span className="text-sm text-slate-800 font-medium">{user.phone || 'N/A'}</span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-2">
            <span className="text-sm font-semibold text-slate-500">Account Status</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800">
              {user.is_active ? 'Active' : 'Suspended'}
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-50 pb-2">
            <span className="text-sm font-semibold text-slate-500">Member Since</span>
            <span className="text-sm text-slate-800 font-medium">
              {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-6">
          <Link href="/" className="px-5 py-2 border border-slate-300 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition cursor-pointer">
            Back to Home
          </Link>
          <Link href="/user/settings" className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition cursor-pointer">
            Account Settings
          </Link>
        </div>
      </div>
    </div>
  )
}
