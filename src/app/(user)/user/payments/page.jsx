'use client'
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '@/component/helper/Context'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  BiDollarCircle, 
  BiCalendar, 
  BiCheckShield, 
  BiPackage, 
  BiLoaderAlt,
  BiDetail
} from 'react-icons/bi'

export default function UserPaymentsPage() {
  const { userSidebar, website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true)
      try {
        const res = await axios.get('/api/sale/payments')
        setPayments(res.data)
      } catch (err) {
        console.error('Failed to load user payments:', err)
        toast.error('Failed to fetch payments logs')
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${userSidebar ? 'lg:pl-60' : 'lg:pl-8'}`}>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Payments Log</h1>
          <p className="text-xs text-slate-500 mt-1">Check cash collection settlements, payment methods, and invoice receipts.</p>
        </div>

        {/* Payments list */}
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="w-full bg-white border border-slate-100 rounded-3xl py-16 px-6 text-center flex flex-col items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 text-3xl">
              <BiDollarCircle />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">No Payments Recorded</h3>
              <p className="text-slate-500 text-sm mt-1.5">You don't have any payment settlements recorded in your logs yet.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {payments.map((pay) => (
              <div 
                key={pay.payment_id}
                className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition duration-300"
              >
                <div className="flex justify-between items-start border-b border-slate-50 pb-3">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment Receipt</span>
                    <span className="font-bold text-slate-800 text-xs md:text-sm">#PAY-REC-{pay.payment_id}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700" style={{ color: themeColor, backgroundColor: themeColor + '10' }}>
                    {pay.payment_status}
                  </span>
                </div>

                <div className="flex flex-col gap-2.5 text-xs text-slate-655 font-medium">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase tracking-wide text-[10px]">Settled Amount:</span>
                    <span className="text-base font-black text-slate-905" style={{ color: themeColor }}>৳{parseFloat(pay.amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200/40 pt-2">
                    <span className="text-slate-450 flex items-center gap-1 font-bold"><BiPackage /> Order Reference:</span>
                    <Link href={`/track-order?id=${pay.order_id}`} className="font-bold text-slate-800 hover:underline">
                      #ORD-{pay.order_id}
                    </Link>
                  </div>
                  {pay.sample_product_name && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-450 font-bold">Product:</span>
                      <span className="text-slate-600 line-clamp-1 max-w-[150px] font-bold">{pay.sample_product_name}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-slate-450 font-bold">Method:</span>
                    <span className="text-slate-705 uppercase font-bold">{pay.payment_method}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200/40 pt-2">
                    <span className="text-slate-450 flex items-center gap-1 font-bold"><BiCalendar /> Settled Date:</span>
                    <span className="text-slate-500 font-semibold">{new Date(pay.paid_at).toLocaleString()}</span>
                  </div>
                </div>

                {pay.note && (
                  <div className="mt-1 p-3 bg-slate-50 border border-slate-100/60 rounded-xl text-[10px] text-slate-500 italic font-medium">
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
