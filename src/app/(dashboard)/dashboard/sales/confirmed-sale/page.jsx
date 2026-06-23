'use client'
import React, { useState, useEffect, useContext } from 'react'
import { Context } from '@/component/helper/Context'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  BiCheckCircle, 
  BiUser, 
  BiPhone, 
  BiMap, 
  BiCheck, 
  BiSolidTruck, 
  BiRefresh, 
  BiLoaderAlt,
  BiMessageAltDetail
} from 'react-icons/bi'

export default function ConfirmedSalesPage() {
  const { dashSidebar, website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [courierNames, setCourierNames] = useState({})
  const [courierTrackingIds, setCourierTrackingIds] = useState({})

  const handleCourierChange = (orderId, field, value) => {
    if (field === 'name') {
      setCourierNames(prev => ({ ...prev, [orderId]: value }))
    } else {
      setCourierTrackingIds(prev => ({ ...prev, [orderId]: value }))
    }
  }

  const fetchConfirmedOrders = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/sale?status=confirmed')
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to load confirmed orders:', err)
      toast.error('Failed to fetch confirmed orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfirmedOrders()
  }, [])

  const handleUpdateStatus = async (orderId, newStatus) => {
    const confirmMsg = `Change order status to "${newStatus}"?`
    if (!window.confirm(confirmMsg)) return

    const toastId = toast.loading(`Updating order #${orderId} status...`)
    try {
      const payload = { status: newStatus }
      if (newStatus === 'out_for_delivery') {
        payload.courier_name = courierNames[orderId] || '';
        payload.courier_tracking_id = courierTrackingIds[orderId] || '';
      }
      await axios.put(`/api/sale/${orderId}`, payload)
      toast.success(`Order #${orderId} status changed to ${newStatus}`, { id: toastId })
      fetchConfirmedOrders()
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
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Confirmed Orders Desk</h1>
            <p className="text-xs text-slate-500 mt-1">Review orders that are confirmed and ready for dispatch or delivery.</p>
          </div>
          <button
            onClick={fetchConfirmedOrders}
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
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Fetching confirmed orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="w-full bg-white border border-slate-100 rounded-2xl py-16 px-6 text-center flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
              <BiCheckCircle />
            </div>
            <div>
              <h3 className="font-bold text-slate-850 text-base">No Confirmed Orders</h3>
              <p className="text-slate-500 text-xs mt-1">There are no orders currently sitting in the confirmed queue.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <div 
                key={order.order_id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 flex flex-col lg:flex-row justify-between gap-6 hover:shadow-md transition duration-300"
              >
                {/* Left Side: Order & Customer Meta */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-800">
                      Order #ORD-{order.order_id}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700" style={{ color: themeColor, backgroundColor: themeColor + '10' }}>
                      {order.status}
                    </span>
                    <span className="text-xxs text-slate-400 font-medium">
                      {new Date(order.created_at).toLocaleString()}
                    </span>
                  </div>

                  {/* Customer details card */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/60 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-450 uppercase tracking-wide">Customer</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <BiUser className="text-sm text-slate-500" /> {order.customer_name || 'Guest'}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-450 uppercase tracking-wide">Contact</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1">
                        <BiPhone className="text-sm text-slate-500" /> {order.phone}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-450 uppercase tracking-wide">Shipping City</span>
                      <span className="font-bold text-slate-800">
                        {order.shipping_city} {order.shipping_area ? `(${order.shipping_area})` : ''}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 col-span-1 md:col-span-3 border-t border-slate-200/40 pt-2 mt-1">
                      <span className="font-bold text-slate-450 uppercase tracking-wide">Shipping Address</span>
                      <span className="text-slate-655 text-slate-600 flex items-start gap-1 leading-relaxed">
                        <BiMap className="text-sm text-slate-500 mt-0.5 shrink-0" /> {order.shipping_address}
                      </span>
                    </div>
                    {order.note && (
                      <div className="flex flex-col gap-1 col-span-1 md:col-span-3 border-t border-slate-200/40 pt-2 mt-1">
                        <span className="font-bold text-slate-450 uppercase tracking-wide">Instruction Note</span>
                        <span className="text-slate-600 flex items-start gap-1 leading-relaxed italic">
                          <BiMessageAltDetail className="text-sm text-slate-400 mt-0.5 shrink-0" /> "{order.note}"
                        </span>
                      </div>
                    )}
                    {/* Courier input fields */}
                    <div className="flex flex-col gap-2 col-span-1 md:col-span-3 border-t border-slate-200/40 pt-2 mt-1">
                      <span className="font-bold text-slate-455 uppercase tracking-wide">Courier Dispatch Info</span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Courier Partner Name (e.g. Pathao, RedX)"
                          value={courierNames[order.order_id] || order.courier_name || ''}
                          onChange={(e) => handleCourierChange(order.order_id, 'name', e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none font-medium text-slate-800 focus:border-slate-450"
                        />
                        <input
                          type="text"
                          placeholder="Tracking ID or Reference Number"
                          value={courierTrackingIds[order.order_id] || order.courier_tracking_id || ''}
                          onChange={(e) => handleCourierChange(order.order_id, 'tracking', e.target.value)}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 outline-none font-medium text-slate-800 focus:border-slate-450"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Items Table */}
                  <div className="border border-slate-100 rounded-2xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100">
                        <tr>
                          <th className="px-4 py-2">Product</th>
                          <th className="px-4 py-2 text-center">Qty</th>
                          <th className="px-4 py-2 text-right">Price</th>
                          <th className="px-4 py-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                        {order.items && order.items.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-4 py-2.5 font-medium flex items-center gap-2">
                              {item.product_image && (
                                <img 
                                  src={item.product_image} 
                                  alt={item.product_name} 
                                  className="w-7 h-7 object-cover rounded border border-slate-100 shrink-0"
                                />
                              )}
                              <div>
                                <span className="line-clamp-1">{item.product_name}</span>
                                {item.variant_name && <span className="text-[10px] text-slate-400 font-bold uppercase">{item.variant_name}</span>}
                              </div>
                            </td>
                            <td className="px-4 py-2.5 text-center font-bold">{item.quantity}</td>
                            <td className="px-4 py-2.5 text-right">৳{parseFloat(item.price).toFixed(2)}</td>
                            <td className="px-4 py-2.5 text-right font-bold">৳{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Side: Total Summary & Operations Panel */}
                <div className="w-full lg:w-64 border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-6 flex flex-col justify-between gap-6 shrink-0 text-right">
                  <div className="flex flex-col gap-1.5 text-xs text-slate-500">
                    <div className="flex justify-between items-center lg:justify-end lg:gap-3">
                      <span>Items Subtotal:</span>
                      <span className="font-semibold text-slate-800">৳{parseFloat(order.subtotal_amount).toFixed(2)}</span>
                    </div>
                    {parseFloat(order.total_discount_amount) > 0 && (
                      <div className="flex justify-between items-center lg:justify-end lg:gap-3 text-rose-500">
                        <span>Discount:</span>
                        <span className="font-semibold">-৳{parseFloat(order.total_discount_amount).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center lg:justify-end lg:gap-3">
                      <span>Delivery Charge:</span>
                      <span className="font-semibold text-slate-800">৳{parseFloat(order.delivery_charge).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center lg:justify-end lg:gap-3 border-t border-slate-100 pt-2 text-sm font-bold text-slate-800">
                      <span>Total Invoice:</span>
                      <span className="font-bold text-slate-900">৳{parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center lg:justify-end lg:gap-3 text-[11px]">
                      <span>Paid Amount:</span>
                      <span className="font-bold text-emerald-600">৳{(parseFloat(order.total_amount) - parseFloat(order.due_amount)).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center lg:justify-end lg:gap-3 text-[11px]">
                      <span>Due Amount:</span>
                      <span className="font-bold text-rose-600">৳{parseFloat(order.due_amount).toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col gap-2.5 mt-auto">
                    <button
                      onClick={() => handleUpdateStatus(order.order_id, 'out_for_delivery')}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01]"
                    >
                      <BiSolidTruck className="text-base" /> Out for Delivery
                    </button>
                    
                    <button
                      onClick={() => handleUpdateStatus(order.order_id, 'delivered')}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-500/20 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01]"
                      style={{ backgroundColor: themeColor }}
                    >
                      <BiCheck className="text-lg" /> Deliver Directly
                    </button>
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
