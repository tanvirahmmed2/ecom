'use client'
import React from 'react'
import Link from 'next/link'

export default function DashboardSalesPendingSalePage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 text-slate-600 mx-auto text-2xl mb-2 font-bold">
          EC
        </div>
        <h1 className="text-3xl font-bold text-slate-800">Dashboard - Sales - Pending Sale</h1>
        <p className="text-slate-600 leading-relaxed">
          Welcome to the Dashboard - Sales - Pending Sale section. This page is currently under development and will be active soon with premium components.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link href="/dashboard" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition cursor-pointer shadow-sm">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
