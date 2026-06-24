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
          <div className="flex flex-col gap-6">
            {orders.map((order) => (
              <div 
                key={order.order_id} 
                className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col gap-5 shadow-sm hover:shadow-md transition duration-300"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-800">#ORD-{order.order_id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                      ['cancelled', 'failed'].includes(order.status) ? 'bg-rose-50 text-rose-600' :
                      order.status === 'returned' ? 'bg-amber-50 text-amber-700' :
                      'bg-blue-50 text-blue-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-slate-455">
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    <Link 
                      href={`/track-order?id=${order.order_id}`}
                      className="px-3 py-1.5 border border-slate-200 hover:border-slate-350 rounded-xl flex items-center gap-1 hover:bg-slate-50 transition text-slate-650"
                    >
                      <BiSearch className="text-sm" /> Track Order
                    </Link>
                    <button 
                      onClick={() => printReceipt(order, website)}
                      className="px-3 py-1.5 border border-slate-200 hover:border-slate-350 rounded-xl flex items-center gap-1 hover:bg-slate-50 transition text-slate-650 cursor-pointer font-semibold"
                    >
                      <BiPrinter className="text-sm" /> Print Invoice
                    </button>
                  </div>
                </div>

                {/* Shipping info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-100/60">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-450 uppercase tracking-wide">Shipping Address</span>
                    <span className="text-slate-655 font-medium">{order.shipping_address}, {order.shipping_city}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-450 uppercase tracking-wide">Contact Phone</span>
                    <span className="text-slate-655 font-medium">{order.phone}</span>
                  </div>
                  {order.courier_name && (
                    <div className="flex flex-col gap-1 col-span-1 md:col-span-2 border-t border-slate-200/40 pt-2">
                      <span className="font-bold text-slate-450 uppercase tracking-wide">Courier Dispatch</span>
                      <span className="text-slate-655 font-medium">
                        {order.courier_name} {order.courier_tracking_id ? `(Tracking: ${order.courier_tracking_id})` : ''}
                      </span>
                    </div>
                  )}
                  {order.note && (
                    <div className="flex flex-col gap-1 col-span-1 md:col-span-2 border-t border-slate-200/40 pt-2">
                      <span className="font-bold text-slate-450 uppercase tracking-wide">Instructions</span>
                      <span className="text-slate-600 italic font-medium">"{order.note}"</span>
                    </div>
                  )}
                </div>

                {/* Items loop */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest">Ordered Items</span>
                  <div className="flex flex-col border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs bg-white">
                    {order.items && order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white hover:bg-slate-50/50 transition">
                        {item.product_image && (
                          <img 
                            src={item.product_image} 
                            alt={item.product_name} 
                            className="w-8 h-8 object-cover rounded border border-slate-100 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                          <Link 
                            href={`/products/${item.slug}`} 
                            className="font-bold text-slate-750 hover:text-emerald-600 transition truncate block"
                          >
                            {item.product_name}
                          </Link>
                          {item.variant_name && <span className="text-[9px] text-slate-450 font-bold uppercase">Option: {item.variant_name}</span>}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="font-bold text-slate-800">৳{(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">৳{parseFloat(item.price).toFixed(2)} x {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Summary */}
                <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 text-xs md:text-sm items-end text-right">
                  <div className="flex justify-between items-center w-full max-w-xs text-slate-500">
                    <span>Subtotal:</span>
                    <span className="font-bold text-slate-800">৳{parseFloat(order.subtotal_amount).toFixed(2)}</span>
                  </div>
                  {parseFloat(order.total_discount_amount) > 0 && (
                    <div className="flex justify-between items-center w-full max-w-xs text-rose-500">
                      <span>Discount:</span>
                      <span className="font-bold">-৳{parseFloat(order.total_discount_amount).toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center w-full max-w-xs text-slate-500">
                    <span>Delivery Charge:</span>
                    <span className="font-bold text-slate-800">৳{parseFloat(order.delivery_charge).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center w-full max-w-xs text-slate-800 border-t border-slate-100 pt-2 text-sm font-bold">
                    <span>Total Invoice:</span>
                    <span className="font-bold">৳{parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center w-full max-w-xs text-slate-500 text-xs">
                    <span>Paid Amount:</span>
                    <span className="font-bold text-emerald-600">৳{(parseFloat(order.total_amount) - parseFloat(order.due_amount)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center w-full max-w-xs text-slate-500 text-xs">
                    <span>Due Amount:</span>
                    <span className="font-bold text-rose-600">৳{parseFloat(order.due_amount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
