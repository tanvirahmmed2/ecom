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
          <div className="w-full overflow-x-auto bg-white border border-slate-150 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-655 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-center">Receipt ID</th>
                  <th className="px-4 py-3">Settled Date</th>
                  <th className="px-4 py-3 text-center">Order Ref</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3 text-center">Method</th>
                  <th className="px-4 py-3 text-right">Settled Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3">Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {payments.map((pay) => (
                  <tr key={pay.payment_id} className="hover:bg-slate-50/50 transition">
                    <td className="px-4 py-3.5 text-center font-bold text-slate-500">#PAY-REC-{pay.payment_id}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">{new Date(pay.paid_at).toLocaleString()}</td>
                    <td className="px-4 py-3.5 text-center font-bold text-slate-850">
                      <Link href={`/track-order?id=${pay.order_id}`} className="hover:underline text-slate-900 cursor-pointer">
                        #ORD-{pay.order_id}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-600 max-w-[150px] truncate" title={pay.sample_product_name || 'In-store Items'}>{pay.sample_product_name || 'In-store Items'}</td>
                    <td className="px-4 py-3.5 text-center"><span className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 font-bold uppercase text-[9px] border border-slate-150">{pay.payment_method}</span></td>
                    <td className="px-4 py-3.5 text-right font-black text-emerald-600">৳{parseFloat(pay.amount).toFixed(2)}</td>
                    <td className="px-4 py-3.5 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700" style={{ color: themeColor, backgroundColor: themeColor + '10' }}>
                        {pay.payment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 italic max-w-[150px] truncate" title={pay.note}>{pay.note ? `"${pay.note}"` : '-'}</td>
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
