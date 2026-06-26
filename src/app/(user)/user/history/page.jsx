'use client'
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '@/component/helper/Context'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  BiHistory, 
  BiPackage, 
  BiMap, 
  BiTime, 
  BiCheckCircle, 
  BiLoaderAlt,
  BiMessageAltDetail,
  BiSearch,
  BiPrinter
} from 'react-icons/bi'
import { printReceipt } from '@/lib/printreceipt'

export default function UserHistoryPage() {
  const { userSidebar, website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true)
      try {
        const res = await axios.get('/api/sale/history')
        setOrders(res.data)
      } catch (err) {
        console.error('Failed to load user order history:', err)
        toast.error('Failed to fetch order history')
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${userSidebar ? 'lg:pl-60' : 'lg:pl-8'}`}>
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Order History</h1>
          <p className="text-xs text-slate-500 mt-1">Review all your previous orders, shipping addresses, and tracking timelines.</p>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Loading order history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="w-full bg-white border border-slate-100 rounded-3xl py-16 px-6 text-center flex flex-col items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-slate-55 bg-slate-50 flex items-center justify-center text-slate-400 text-3xl">
              <BiPackage />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">No Orders Found</h3>
              <p className="text-slate-500 text-sm mt-1.5">You haven't placed any orders yet. Explore our product collection to find your next purchase.</p>
            </div>
            <Link href="/products" className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-sm">
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-white border border-slate-150 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-655 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-center">Order ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3">Shipping Address</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  <th className="px-4 py-3 text-right">Discount</th>
                  <th className="px-4 py-3 text-right">Shipping Cost</th>
                  <th className="px-4 py-3 text-right">Total Invoice</th>
                  <th className="px-4 py-3 text-right">Paid</th>
                  <th className="px-4 py-3 text-right">Due</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {orders.map((order) => {
                  const productsSummary = order.items
                    ? order.items.map(item => `${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ''} x${item.quantity}`).join(', ')
                    : 'N/A'
                  const paidAmount = parseFloat(order.total_amount) - parseFloat(order.due_amount)
                  return (
                    <tr key={order.order_id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3.5 text-center font-bold text-slate-850">#ORD-{order.order_id}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3.5 text-slate-500 max-w-[185px] truncate" title={productsSummary}>
                        {productsSummary}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-805">{order.shipping_address}, {order.shipping_city}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{order.phone}</div>
                        {order.courier_name && (
                          <div className="text-[9px] text-slate-500 mt-0.5">Courier: {order.courier_name} {order.courier_tracking_id ? `(${order.courier_tracking_id})` : ''}</div>
                        )}
                        {order.note && (
                          <div className="text-[9px] text-rose-500 italic mt-0.5" title={order.note}>Note: "{order.note}"</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium">৳{parseFloat(order.subtotal_amount).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right text-rose-500">৳{parseFloat(order.total_discount_amount).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right">৳{parseFloat(order.delivery_charge).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-900">৳{parseFloat(order.total_amount).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right text-emerald-600 font-bold">৳{paidAmount.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right text-rose-600 font-bold">৳{parseFloat(order.due_amount).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                          ['cancelled', 'failed'].includes(order.status) ? 'bg-rose-50 text-rose-600' :
                          order.status === 'returned' ? 'bg-amber-50 text-amber-700' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex flex-col gap-1.5 justify-center items-center">
                          <Link 
                            href={`/track-order?id=${order.order_id}`}
                            className="w-24 py-1 border border-slate-205 border-slate-200 hover:border-slate-350 rounded text-[10px] font-bold text-slate-650 hover:bg-slate-50 transition text-center"
                          >
                            Track Order
                          </Link>
                          <button 
                            onClick={() => printReceipt(order, website)}
                            className="w-24 py-1 border border-slate-205 border-slate-200 hover:border-slate-350 rounded text-[10px] font-bold text-slate-650 hover:bg-slate-50 transition cursor-pointer"
                          >
                            Print Invoice
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
