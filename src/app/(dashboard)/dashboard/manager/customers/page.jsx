'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import { 
  BiSearch, 
  BiUser, 
  BiLoaderAlt, 
  BiShieldQuarter, 
  BiPhone, 
  BiEnvelope, 
  BiMap, 
  BiCalendar 
} from 'react-icons/bi'

export default function ManagerCustomersDirectoryPage() {
  const { dashSidebar, user, loading: userLoading } = useContext(Context)
  
  const [customers, setCustomers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchCustomers = async (queryStr = '') => {
    setLoading(true)
    try {
      const searchParam = queryStr ? `?search=${queryStr}` : ''
      const res = await axios.get(`/api/customer${searchParam}`)
      setCustomers(res.data)
    } catch (err) {
      console.error('Failed to fetch customers directory:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userLoading) return
    if (user && ['manager', 'admin'].includes(user.role)) {
      fetchCustomers()
    }
  }, [user, userLoading])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    fetchCustomers(search)
  }

  if (userLoading || (loading && customers.length === 0)) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
          <p className="text-slate-655 text-sm font-semibold animate-pulse">Loading customers directory...</p>
        </div>
      </div>
    )
  }

  const isManager = user && ['manager', 'admin'].includes(user.role)
  if (!isManager) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-4 text-center">
          <BiShieldQuarter className="text-5xl text-rose-500 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-slate-600 text-sm">Please sign in with a Manager or Admin account to view clients.</p>
          <Link href="/login" className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-sm">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Clients Directory</h1>
            <p className="text-xs text-slate-500 mt-1">Browse customer profiles, checkout transaction histories, contact details, and locations.</p>
          </div>
        </div>

        {/* Search Panel */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2 items-center bg-white px-3 py-2 border border-slate-200 rounded-xl w-full md:w-80 shadow-sm">
          <BiSearch className="text-slate-400 text-lg" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-slate-850 text-xs w-full placeholder:text-slate-400"
          />
          <button type="submit" className="hidden">Search</button>
        </form>

        {/* Customers Table */}
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Filtering directory records...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl py-16 px-6 text-center">
            <h3 className="font-bold text-slate-850 text-base">No Customers Found</h3>
            <p className="text-slate-550 text-xs mt-1">There are no client profile records matching your search criteria.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-white border border-slate-150 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-55 text-slate-655 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-center">ID</th>
                  <th className="px-4 py-3">Customer Profile</th>
                  <th className="px-4 py-3"><div className="flex items-center gap-1"><BiPhone /> Phone</div></th>
                  <th className="px-4 py-3"><div className="flex items-center gap-1"><BiEnvelope /> Email</div></th>
                  <th className="px-4 py-3"><div className="flex items-center gap-1"><BiMap /> Physical Address</div></th>
                  <th className="px-4 py-3 text-center"><div className="flex items-center justify-center gap-1"><BiCalendar /> Date Joined</div></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {customers.map(cust => (
                  <tr key={cust.customer_id} className="hover:bg-slate-50/50 transition">
                    <td className="px-4 py-3.5 text-center font-bold text-slate-500">#CUST-{cust.customer_id}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                          {cust.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="font-bold text-slate-900">{cust.name}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-600">{cust.phone}</td>
                    <td className="px-4 py-3.5 text-slate-550 font-mono text-[10px]">{cust.email || 'N/A'}</td>
                    <td className="px-4 py-3.5 text-slate-550 font-medium max-w-[200px] truncate" title={cust.address}>{cust.address || 'N/A'}</td>
                    <td className="px-4 py-3.5 text-center text-slate-400 font-mono text-[10px]">
                      {cust.created_at ? new Date(cust.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  )
}
