'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import { printReceipt } from '@/lib/printreceipt'
import { 
  BiSearch, 
  BiPrinter, 
  BiLoaderAlt, 
  BiShieldQuarter, 
  BiDollarCircle, 
  BiCheckCircle, 
  BiXCircle, 
  BiRefresh 
} from 'react-icons/bi'

export default function SalesHistoryPage() {
  const { dashSidebar, user, loading: userLoading, website } = useContext(Context)
  
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const statusParam = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
      const res = await axios.get(`/api/sale${statusParam}`)
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to load orders history:', err)
      toast.error('Failed to load orders history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userLoading) return
    if (user && ['admin', 'manager', 'sales'].includes(user.role)) {
      fetchOrders()
    }
  }, [user, userLoading, statusFilter])

  if (userLoading || (loading && orders.length === 0)) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
          <p className="text-slate-655 text-sm font-semibold animate-pulse">Loading orders history...</p>
        </div>
      </div>
    )
  }

  const isStaff = user && ['admin', 'manager', 'sales'].includes(user.role)
  if (!isStaff) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-4 text-center">
          <BiShieldQuarter className="text-5xl text-rose-500 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-slate-600 text-sm">Please sign in with a Staff account to view orders history.</p>
          <Link href="/login" className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-sm">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // Filter orders by search
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_id.toString().includes(search) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(search.toLowerCase())) ||
      (order.phone && order.phone.includes(search)) ||
      (order.shipping_address && order.shipping_address.toLowerCase().includes(search.toLowerCase()))
    return matchesSearch
  })

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Sales Orders History</h1>
            <p className="text-xs text-slate-500 mt-1">Review past system transactions, client invoices, shipping addresses, and download or print invoice slips.</p>
          </div>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="p-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl border border-slate-200 transition cursor-pointer shadow-sm disabled:opacity-40"
          >
            <BiRefresh className={`text-xl ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {['all', 'pending', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled', 'returned'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border uppercase tracking-wide ${
                  statusFilter === status 
                    ? 'bg-slate-900 text-white border-slate-900' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-350 hover:bg-slate-50'
                }`}
              >
                {status.replace(/_/g, ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 border border-slate-200 rounded-xl w-full md:w-80 shadow-sm">
            <BiSearch className="text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search by ID, name, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-805 text-xs w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Orders List Table */}
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Loading orders list...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="w-full bg-white border border-slate-100 rounded-3xl py-16 px-6 text-center">
            <h3 className="font-bold text-slate-850 text-base">No Orders Logged</h3>
            <p className="text-slate-500 text-xs mt-1">There are no order records that match your filters or search terms.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-white border border-slate-150 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-655 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-center">ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Items Summary</th>
                  <th className="px-4 py-3 text-right">Invoice Total</th>
                  <th className="px-4 py-3 text-center">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {filteredOrders.map(order => {
                  const itemSummary = order.items
                    ? order.items.map(item => `${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ''} x${item.quantity}`).join(', ')
                    : 'N/A'
                  return (
                    <tr key={order.order_id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3.5 text-center font-bold text-slate-850">#ORD-{order.order_id}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-805 max-w-[130px] truncate" title={order.customer_name || 'Guest'}>{order.customer_name || 'Guest'}</td>
                      <td className="px-4 py-3.5 font-medium text-slate-600">{order.phone}</td>
                      <td className="px-4 py-3.5 text-slate-500 max-w-[180px] truncate" title={itemSummary}>{itemSummary}</td>
                      <td className="px-4 py-3.5 text-right font-black text-slate-900">৳{parseFloat(order.total_amount).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                          ['cancelled', 'failed'].includes(order.status) ? 'bg-rose-50 text-rose-600' :
                          order.status === 'returned' ? 'bg-amber-50 text-amber-700' :
                          'bg-blue-50 text-blue-600'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-center flex gap-1 justify-center items-center">
                        <Link href={`/dashboard/sales/sale/${order.order_id}`} className="px-2.5 py-1 bg-slate-900 text-white rounded text-[10px] font-bold hover:bg-slate-800 transition cursor-pointer">
                          Details
                        </Link>
                        <button
                          onClick={() => printReceipt(order, website)}
                          className="p-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded text-base transition cursor-pointer"
                          title="Print Invoice Slip"
                        >
                          <BiPrinter />
                        </button>
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
