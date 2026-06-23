'use client'
import React, { useState, useContext } from 'react'
import { Context } from '@/component/helper/Context'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  BiSearch, 
  BiPackage, 
  BiMap, 
  BiTime, 
  BiCheckCircle, 
  BiSolidMap, 
  BiChevronRight,
  BiLoaderAlt,
  BiMessageAltDetail,
  BiInfoCircle
} from 'react-icons/bi'

export default function TrackOrderPage() {
  const { website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [orderIdInput, setOrderIdInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [searched, setSearched] = useState(false)

  const handleTrackOrder = async (e) => {
    e.preventDefault()
    
    // Extract numerical digits from input (e.g., #ORD-12 -> 12)
    const cleanId = orderIdInput.replace(/\D/g, '').trim()
    if (!cleanId) {
      toast.error('Please enter a valid numeric Order ID')
      return
    }

    setLoading(true)
    setSearched(true)
    setOrder(null)

    try {
      const res = await axios.get(`/api/sale/${cleanId}`)
      setOrder(res.data)
    } catch (err) {
      console.error('Failed to track order:', err)
      // We don't toast error here because we show the "Order not found" section in the UI
    } finally {
      setLoading(false)
    }
  }

  // Get active step index for the status progress bar
  const getStatusStep = (status) => {
    switch (status) {
      case 'pending': return 1
      case 'confirmed':
      case 'processing':
      case 'shipped':
        return 2
      case 'out_for_delivery': return 3
      case 'delivered': return 4
      default: return 0 // cancelled, returned, etc.
    }
  }

  const activeStep = order ? getStatusStep(order.status) : 0

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 md:px-8 relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />

      <div className="max-w-3xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Page title */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Track Your Order</h1>
          <p className="text-slate-500 text-sm mt-1.5">Enter your order identifier number to check the dispatch and delivery status.</p>
        </div>

        {/* Search input form */}
        <form onSubmit={handleTrackOrder} className="w-full max-w-xl mx-auto flex gap-3 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex-1 flex items-center gap-2 px-3">
            <BiSearch className="text-slate-400 text-xl" />
            <input
              type="text"
              required
              placeholder="e.g. #ORD-12 or simply 12"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              className="w-full bg-transparent border-none text-slate-800 text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            style={{ backgroundColor: themeColor }}
          >
            {loading ? <BiLoaderAlt className="animate-spin text-lg" /> : 'Track'}
          </button>
        </form>

        {/* Loading placeholder */}
        {loading && (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Checking tracking system logs...</p>
          </div>
        )}

        {/* Track results */}
        {searched && !loading && !order && (
          <div className="w-full bg-white border border-slate-100 rounded-3xl p-8 text-center flex flex-col items-center gap-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 text-3xl">
              <BiInfoCircle />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Order Not Found</h3>
              <p className="text-slate-500 text-sm mt-1.5">We couldn't find any checkout details matching the ID "{orderIdInput}". Please check the ID and try again.</p>
            </div>
          </div>
        )}

        {order && !loading && (
          <div className="flex flex-col gap-6 w-full bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-sm">
            
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
              <div className="flex flex-col gap-0.5">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest">Order ID</span>
                <span className="text-lg font-black text-slate-850">#ORD-{order.order_id}</span>
              </div>
              <div className="flex flex-col sm:items-end gap-1.5">
                <span className="text-xxs font-bold text-slate-400 uppercase tracking-widest text-left sm:text-right">Current Status</span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                  ['cancelled', 'failed'].includes(order.status) ? 'bg-rose-50 text-rose-600' :
                  order.status === 'returned' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Timeline Progress Bar (only show if not cancelled/returned) */}
            {!['cancelled', 'returned', 'failed'].includes(order.status) && activeStep > 0 && (
              <div className="py-6 border-b border-slate-100">
                <div className="flex items-center justify-between w-full relative text-slate-400 text-xxs md:text-xs">
                  {/* Progress Line */}
                  <div className="absolute top-4 left-[10%] right-[10%] h-1 bg-slate-100 z-0">
                    <div 
                      className="h-full transition-all duration-500" 
                      style={{ 
                        backgroundColor: themeColor,
                        width: `${((activeStep - 1) / 3) * 100}%`
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div className="flex flex-col items-center gap-1.5 z-10 w-[20%]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition ${
                      activeStep >= 1 ? 'border-emerald-600 bg-white text-emerald-600 font-bold' : 'border-slate-200 bg-white text-slate-350'
                    }`} style={activeStep >= 1 ? { borderColor: themeColor, color: themeColor } : {}}>
                      ✓
                    </div>
                    <span className="font-bold">Order Placed</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 z-10 w-[20%]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition ${
                      activeStep >= 2 ? 'border-emerald-600 bg-white text-emerald-600 font-bold' : 'border-slate-200 bg-white text-slate-350'
                    }`} style={activeStep >= 2 ? { borderColor: themeColor, color: themeColor } : {}}>
                      {activeStep > 2 ? '✓' : '2'}
                    </div>
                    <span className="font-bold">Confirmed</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 z-10 w-[20%]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition ${
                      activeStep >= 3 ? 'border-emerald-600 bg-white text-emerald-600 font-bold' : 'border-slate-200 bg-white text-slate-350'
                    }`} style={activeStep >= 3 ? { borderColor: themeColor, color: themeColor } : {}}>
                      {activeStep > 3 ? '✓' : '3'}
                    </div>
                    <span className="font-bold">Dispatched</span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 z-10 w-[20%]">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition ${
                      activeStep >= 4 ? 'border-emerald-600 bg-white text-emerald-600 font-bold' : 'border-slate-200 bg-white text-slate-350'
                    }`} style={activeStep >= 4 ? { borderColor: themeColor, color: themeColor } : {}}>
                      {activeStep > 4 ? '✓' : '4'}
                    </div>
                    <span className="font-bold">Delivered</span>
                  </div>
                </div>
              </div>
            )}

            {/* Shipment address details */}
            <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100/60 text-xs">
              <div className="flex flex-col gap-1">
                <span className="font-bold text-slate-400 uppercase tracking-wide">Recipient Details</span>
                <span className="font-bold text-slate-800">{order.customer_name || 'Customer'}</span>
              </div>
              <div className="flex flex-col gap-1 border-t border-slate-200/40 pt-2.5 mt-1">
                <span className="font-bold text-slate-400 uppercase tracking-wide">Shipping Address</span>
                <span className="text-slate-655 text-slate-600 flex items-start gap-1 leading-relaxed font-semibold">
                  <BiSolidMap className="text-sm text-slate-500 mt-0.5 shrink-0" /> {order.shipping_address}, {order.shipping_city} {order.shipping_area ? `(${order.shipping_area})` : ''}
                </span>
              </div>
              {order.courier_name && (
                <div className="flex flex-col gap-1 border-t border-slate-200/40 pt-2.5 mt-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wide">Courier Dispatch Details</span>
                  <span className="font-semibold text-slate-800">
                    {order.courier_name} {order.courier_tracking_id ? ` (Tracking ID: ${order.courier_tracking_id})` : ''}
                  </span>
                </div>
              )}
              {order.note && (
                <div className="flex flex-col gap-1 border-t border-slate-200/40 pt-2.5 mt-1">
                  <span className="font-bold text-slate-400 uppercase tracking-wide">Delivery Note</span>
                  <span className="text-slate-600 flex items-start gap-1 leading-relaxed italic font-medium">
                    <BiMessageAltDetail className="text-sm text-slate-450 mt-0.5 shrink-0" /> "{order.note}"
                  </span>
                </div>
              )}
            </div>

            {/* Items Summary list */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ordered Items</span>
              <div className="flex flex-col border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                {order.items && order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-white hover:bg-slate-50/50 transition">
                    {item.product_image && (
                      <img 
                        src={item.product_image} 
                        alt={item.product_name} 
                        className="w-10 h-10 object-cover rounded border border-slate-100 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <span className="font-bold text-slate-800 line-clamp-1">{item.product_name}</span>
                      {item.variant_name && <span className="text-[9px] text-slate-450 font-bold uppercase">Option: {item.variant_name}</span>}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-slate-800">৳{(parseFloat(item.price) * item.quantity).toFixed(2)}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium">৳{parseFloat(item.price).toFixed(2)} x {item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown summary */}
            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2.5 text-xs md:text-sm items-end text-right">
              <div className="flex justify-between items-center w-full max-w-xs text-slate-500">
                <span>Items Subtotal:</span>
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
        )}
      </div>
    </div>
  )
}
