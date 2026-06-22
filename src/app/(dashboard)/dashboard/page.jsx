'use client'
import React, { useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'

export default function DashboardPage() {
  const {user}=useContext(Context)
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-4 text-center">
        <h1>Hi , {user?.name.split(' ')[0]}</h1>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-slate-600 leading-relaxed">
          Welcome to the Dashboard section. This page is currently under development and will be active soon with premium components.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href={`/dashboard/${user?.role}`} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition cursor-pointer shadow-sm">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
