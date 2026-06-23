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
  BiChevronRight,
  BiUser,
  BiPhone,
  BiMap,
  BiDollarCircle,
  BiSolidMap,
  BiCheckCircle,
  BiXCircle,
  BiBlock,
  BiTruck
} from 'react-icons/bi'

export default function ManagerSalesOrdersPage() {
  const { dashSidebar, website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const statusParam = statusFilter !== 'all' ? `?status=${statusFilter}` : ''
      const res = await axios.get(`/api/sale${statusParam}`)
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to load orders:', err)
      toast.error('Failed to fetch sales orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_id.toString().includes(searchTerm) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      order.phone.includes(searchTerm) ||
      (order.shipping_address && order.shipping_address.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSearch
  })

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Sales Orders Center</h1>
            <p className="text-xs text-slate-500 mt-1">Review all user checkout sales orders, check statuses, and track revenue.</p>
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
              placeholder="Search by ID, name, phone, address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-800 text-xs w-full placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="w-full py-20 flex flex-col items-center justify-center gap-2">
            <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
            <p className="text-slate-500 text-sm font-semibold animate-pulse">Loading orders database...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="w-full bg-white border border-slate-100 rounded-3xl py-16 px-6 text-center flex flex-col items-center gap-3">
            <h3 className="font-bold text-slate-850 text-base">No Orders Found</h3>
            <p className="text-slate-500 text-xs mt-1">There are no orders that match your active filters or search terms.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-white border border-slate-150 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100/80 text-slate-650 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-center">ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Phone</th>
                  <th className="px-4 py-3">Items Summary</th>
                  <th className="px-4 py-3 text-right">Total Price</th>
                  <th className="px-4 py-3 text-right">Discount</th>
                  <th className="px-4 py-3 text-right">Payable Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {filteredOrders.map((order) => {
                  const itemSummary = order.items
                    ? order.items.map(item => `${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ''} x${item.quantity}`).join(', ')
                    : ''
                  return (
                    <tr key={order.order_id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3.5 text-center font-bold text-slate-800">#ORD-{order.order_id}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-500">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3.5 font-semibold text-slate-800 max-w-[140px] truncate" title={order.customer_name || 'Guest'}>{order.customer_name || 'Guest'}</td>
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 font-medium">{order.phone}</td>
                      <td className="px-4 py-3.5 max-w-[200px] truncate text-slate-500" title={itemSummary}>{itemSummary}</td>
                      <td className="px-4 py-3.5 text-right font-medium">৳{parseFloat(order.subtotal_amount).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right font-medium text-rose-600">-৳{parseFloat(order.total_discount_amount || 0).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right font-black text-slate-900" style={{ color: themeColor }}>৳{parseFloat(order.total_amount).toFixed(2)}</td>
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
