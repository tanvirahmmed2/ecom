'use client'
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '@/component/helper/Context'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  BiTime, 
  BiUser, 
  BiPhone, 
  BiMap, 
  BiCheck, 
  BiX, 
  BiSolidTruck, 
  BiRefresh, 
  BiLoaderAlt,
  BiMessageAltDetail
} from 'react-icons/bi'

export default function PendingSalesPage() {
  const { dashSidebar, website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchPendingOrders = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/sale?status=pending')
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to load pending sales orders:', err)
      toast.error('Failed to fetch pending orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingOrders()
  }, [])

  const handleUpdateStatus = async (orderId, newStatus) => {
    const confirmMsg = `Are you sure you want to change status to "${newStatus}"?`
    if (!window.confirm(confirmMsg)) return

    const toastId = toast.loading(`Updating order #${orderId} status...`)
    try {
      await axios.put(`/api/sale/${orderId}`, { status: newStatus })
      toast.success(`Order #${orderId} marked as ${newStatus}`, { id: toastId })
      fetchPendingOrders()
    } catch (err) {
      console.error('Failed to update order status:', err)
      toast.error(err.response?.data?.error || `Failed to update status to ${newStatus}`, { id: toastId })
    }
  }

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header section */}
        <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pending Orders Desk</h1>
            <p className="text-xs text-slate-500 mt-1">Review, decline, confirm, or instantly deliver incoming checkout sales orders.</p>
          </div>
          <button
            onClick={fetchPendingOrders}
            disabled={loading}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition cursor-pointer shadow-sm disabled:opacity-40"
          >
            <BiRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Orders list container */}
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Fetching pending sales desk...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="w-full bg-white border border-slate-100 rounded-2xl py-16 px-6 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
              <BiTime />
            </div>
            <div>
              <h3 className="font-bold text-slate-850 text-base">No Pending Orders</h3>
              <p className="text-slate-500 text-xs mt-1">There are no client checkouts waiting in the queue.</p>
            </div>
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-white border border-slate-150 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-655 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-center">Order ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer Details</th>
                  <th className="px-4 py-3">Products</th>
                  <th className="px-4 py-3 text-right">Subtotal</th>
                  <th className="px-4 py-3 text-right">Discount</th>
                  <th className="px-4 py-3 text-right">Shipping</th>
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
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">{new Date(order.created_at).toLocaleString()}</td>
                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-805">{order.customer_name || 'Guest'}</div>
                        <div className="text-[10px] text-slate-500 font-medium">{order.phone}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[150px]" title={order.shipping_address}>{order.shipping_address}</div>
                        {order.note && (
                          <div className="text-[9px] text-rose-500 italic mt-0.5" title={order.note}>Note: "{order.note}"</div>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 max-w-[180px] truncate" title={productsSummary}>
                        {productsSummary}
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium">৳{parseFloat(order.subtotal_amount).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right text-rose-500">৳{parseFloat(order.total_discount_amount).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right">৳{parseFloat(order.delivery_charge).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-900">৳{parseFloat(order.total_amount).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right text-emerald-600 font-bold">৳{paidAmount.toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right text-rose-600 font-bold">৳{parseFloat(order.due_amount).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700">
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <div className="flex flex-col gap-1.5 justify-center items-center">
                          <button
                            onClick={() => handleUpdateStatus(order.order_id, 'confirmed')}
                            className="w-24 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-[10px] font-bold transition flex items-center justify-center gap-0.5 cursor-pointer"
                          >
                            <BiCheck /> Confirm
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order.order_id, 'delivered')}
                            className="w-24 py-1 text-white rounded text-[10px] font-bold transition flex items-center justify-center gap-0.5 cursor-pointer"
                            style={{ backgroundColor: themeColor }}
                          >
                            <BiSolidTruck /> Deliver
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order.order_id, 'cancelled')}
                            className="w-24 py-1 bg-white hover:bg-rose-50 border border-slate-200 text-slate-650 hover:text-rose-600 rounded text-[10px] font-bold transition flex items-center justify-center gap-0.5 cursor-pointer"
                          >
                            <BiX /> Decline
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
