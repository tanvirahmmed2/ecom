'use client'
import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Context } from '@/component/helper/Context'
import { BiLoaderAlt } from 'react-icons/bi'

export default function DashboardPage() {
  const { user, loading } = useContext(Context)
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user && user.role) {
        router.push(`/dashboard/${user.role}`)
      } else {
        router.push('/login')
      }
    }
  }, [user, loading, router])

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
        <p className="text-slate-600 text-sm font-semibold animate-pulse">Loading dashboard portal...</p>
      </div>
    </div>
  )
}
