'use client'
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '@/component/helper/Context'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  BiRefresh, 
  BiSearch, 
  BiLoaderAlt, 
  BiDollarCircle, 
  BiCalendar, 
  BiUser, 
  BiReceipt,
  BiPackage
} from 'react-icons/bi'

export default function ManagerPaymentsPage() {
  const { dashSidebar, website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/sale/payments')
      setPayments(res.data)
    } catch (err) {
      console.error('Failed to load payments:', err)
      toast.error('Failed to fetch payments logs')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPayments()
  }, [])

  const filteredPayments = payments.filter(pay => {
    const matchesSearch = 
      pay.payment_id.toString().includes(searchTerm) ||
      pay.order_id.toString().includes(searchTerm) ||
      (pay.customer_name && pay.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pay.order_phone && pay.order_phone.includes(searchTerm)) ||
      (pay.payment_method && pay.payment_method.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Payments Settlement Center</h1>
            <p className="text-xs text-slate-500 mt-1">Monitor, review, and track all cash-on-delivery settlements and order payments.</p>
          </div>
          <button
            onClick={fetchPayments}
            disabled={loading}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition cursor-pointer shadow-sm disabled:opacity-40"
          >
            <BiRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Search */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-xl w-full md:w-80 shadow-sm">
            <BiSearch className="text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search by receipt, order ID, customer name, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-800 text-xs w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Payments List */}
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Loading payments logs...</p>
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="w-full bg-white border border-slate-100 rounded-3xl py-16 px-6 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
              <BiDollarCircle />
            </div>
            <div>
              <h3 className="font-bold text-slate-850 text-base">No Payments Recorded</h3>
              <p className="text-slate-500 text-xs mt-1">There are no order payment transactions that match your search query.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPayments.map((pay) => (
              <div 
                key={pay.payment_id}
                className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-between gap-5 shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div className="flex flex-col gap-0.5 text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Receipt No</span>
                    <span className="font-bold text-slate-800 text-xs md:text-sm">#PAY-REC-{pay.payment_id}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700" style={{ color: themeColor, backgroundColor: themeColor + '10' }}>
                    {pay.payment_status}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 text-xs text-slate-600 font-medium">
                  <div className="flex justify-between items-center text-left">
                    <span className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Settled Amount:</span>
                    <span className="text-base font-black" style={{ color: themeColor }}>৳{parseFloat(pay.amount).toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                    <span className="text-slate-450 flex items-center gap-1 font-bold"><BiPackage /> Order Ref:</span>
                    <Link href={`/track-order?id=${pay.order_id}`} target="_blank" className="font-bold text-slate-850 hover:underline">
                      #ORD-{pay.order_id}
                    </Link>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-slate-455 flex items-center gap-1 font-bold"><BiUser /> Customer:</span>
                    <span className="font-bold text-slate-800 truncate max-w-[140px]">{pay.customer_name || 'Guest'}</span>
                  </div>

                  {pay.order_phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-455 font-bold">Contact:</span>
                      <span className="font-semibold text-slate-700">{pay.order_phone}</span>
                    </div>
                  )}

                  {pay.sample_product_name && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-455 font-bold">Sample Product:</span>
                      <span className="font-medium text-slate-600 line-clamp-1 max-w-[130px]" title={pay.sample_product_name}>{pay.sample_product_name}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-slate-455 font-bold">Method:</span>
                    <span className="font-bold text-slate-800 uppercase">{pay.payment_method}</span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-2">
                    <span className="text-slate-455 flex items-center gap-1 font-bold"><BiCalendar /> Date Logged:</span>
                    <span className="text-slate-500 font-semibold">{new Date(pay.paid_at).toLocaleString()}</span>
                  </div>
                </div>

                {pay.note && (
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-500 italic text-left">
                    "{pay.note}"
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
