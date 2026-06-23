'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import { 
  BiUser, 
  BiEnvelope, 
  BiPhone, 
  BiLoaderAlt, 
  BiArrowBack,
  BiSave
} from 'react-icons/bi'

export default function UserSettingsPage() {
  const { user, setUser, loading: userLoading } = useContext(Context)

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Load user info into local states on load or update
  useEffect(() => {
    if (user) {
      setName(user.name || '')
      setEmail(user.email || '')
      setPhone(user.phone || '')
    }
  }, [user])

  const handleUpdateSettings = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }
    if (!email.trim()) {
      toast.error('Email is required')
      return
    }

    setSubmitting(true)
    try {
      const res = await axios.put('/api/user', {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim()
      })
      toast.success(res.data.message || 'Profile settings updated successfully!')
      // Update Context user state so changes reflect globally
      setUser(res.data.user)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile settings')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (userLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <BiLoaderAlt className="animate-spin text-4xl text-slate-900" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-4 text-center">
          <BiUser className="text-5xl text-slate-400 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-800">Settings Access</h1>
          <p className="text-slate-650 text-sm">Please log in to your user profile to access settings.</p>
          <div className="mt-4">
            <Link href="/login" className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-850 transition cursor-pointer shadow-sm">
              Log In
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const initials = name
    ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'US'

  return (
    <div className="w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto flex flex-col gap-6">
        
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
            <p className="text-slate-500 text-sm mt-0.5">Modify your profile details and contact methods.</p>
          </div>
          <Link href="/user" className="px-4 py-2 border border-slate-200 text-slate-600 bg-white rounded-xl text-xs font-semibold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-xs">
            <BiArrowBack /> Back to Profile
          </Link>
        </div>

        {/* Main Settings Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left panel (Avatar block) */}
          <div className="md:col-span-4 bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-100 gap-3">
            <div className="w-20 h-20 rounded-full bg-slate-900 text-white font-extrabold text-2xl flex items-center justify-center shadow-md select-none">
              {initials}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm leading-normal">{name || user.name}</h3>
              <span className="px-2 py-0.5 rounded text-xxs font-bold bg-slate-200 text-slate-700 uppercase tracking-wider mt-1 inline-block">
                {user.role}
              </span>
            </div>
            <p className="text-xxs text-slate-450 mt-2 max-w-[150px] leading-relaxed">
              Updates to your email or phone number will sync with your customer database profile.
            </p>
          </div>

          {/* Right panel (Form inputs) */}
          <form onSubmit={handleUpdateSettings} className="md:col-span-8 p-6 flex flex-col gap-4">
            
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase">Full Name <span className="text-red-500">*</span></label>
              <div className="relative">
                <BiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  required
                  type="text"
                  placeholder="Your display name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-705 uppercase">Email Address <span className="text-red-500">*</span></label>
              <div className="relative">
                <BiEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  required
                  type="email"
                  placeholder="example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-705 uppercase">Phone Number</label>
              <div className="relative">
                <BiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="tel"
                  placeholder="e.g. +8801700000000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-205 rounded-xl text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-slate-500/20 focus:border-slate-500 outline-none transition"
                />
              </div>
            </div>

            {/* Submit btn */}
            <div className="flex justify-end pt-4 border-t border-slate-100 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <BiLoaderAlt className="animate-spin" /> Saving Changes...
                  </>
                ) : (
                  <>
                    <BiSave className="text-sm" /> Save Settings
                  </>
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  )
}