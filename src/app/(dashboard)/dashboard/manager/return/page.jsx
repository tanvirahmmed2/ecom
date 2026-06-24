'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import { 
  BiSearch, 
  BiUndo, 
  BiLoaderAlt, 
  BiShieldQuarter, 
  BiCheckCircle, 
  BiXCircle, 
  BiInfoCircle,
  BiUser,
  BiMap,
  BiPhone
} from 'react-icons/bi'

export default function ManagerReturnDeskPage() {
  const { dashSidebar, user, loading: userLoading } = useContext(Context)
  
  const [returnedOrders, setReturnedOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchOrderId, setSearchOrderId] = useState('')
  const [searchedOrder, setSearchedOrder] = useState(null)
  const [searching, setSearching] = useState(false)
  const [processingId, setProcessingId] = useState(null)

  const fetchReturns = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/sale?status=returned')
      setReturnedOrders(res.data)
    } catch (err) {
      console.error('Failed to load return logs:', err)
      toast.error('Failed to fetch returns history')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userLoading) return
    if (user && ['manager', 'admin'].includes(user.role)) {
      fetchReturns()
    }
  }, [user, userLoading])

  const handleSearchOrder = async (e) => {
    e.preventDefault()
    if (!searchOrderId.trim()) return

    setSearching(true)
    setSearchedOrder(null)
    try {
      const cleanId = searchOrderId.replace(/[^0-9]/g, '')
      if (!cleanId) {
        toast.error('Invalid Order ID format. Please use numerical digits.')
        return
      }
      const res = await axios.get(`/api/sale/${cleanId}`)
      setSearchedOrder(res.data)
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || 'Order record not found.')
    } finally {
      setSearching(false)
    }
  }

  const handleProcessReturn = async (orderId) => {
    if (!window.confirm('Are you sure you want to mark this order as RETURNED? This will return items to inventory stock.')) {
      return
    }

    setProcessingId(orderId)
    try {
      await axios.put(`/api/sale/${orderId}`, { status: 'returned' })
      toast.success('Order processed as returned successfully!')
      setSearchedOrder(null)
      setSearchOrderId('')
      fetchReturns()
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || 'Failed to process return status.')
    } finally {
      setProcessingId(null)
    }
  }

  if (userLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
          <p className="text-slate-655 text-sm font-semibold animate-pulse">Loading return desk...</p>
        </div>
      </div>
    )
  }

  const isManager = user && ['manager', 'admin'].includes(user.role)
  if (!isManager) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col gap-4 text-center">
          <BiShieldQuarter className="text-5xl text-rose-500 mx-auto" />
          <h1 className="text-2xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-slate-600 text-sm">Please sign in with a Manager or Admin account to view returns.</p>
          <Link href="/login" className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-sm">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Returns Processing Desk</h1>
          <p className="text-xs text-slate-500 mt-1">Audit returns, refund clients, restore inventory levels, and check order validity.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left panel - Search & Process */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            
            {/* Search Card */}
            <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">Lookup Order for Return</h3>
              <form onSubmit={handleSearchOrder} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. 5)"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 text-slate-850 rounded-xl text-xs font-medium outline-none flex-1 placeholder:text-slate-400 focus:border-slate-350"
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer disabled:opacity-40"
                >
                  {searching ? <BiLoaderAlt className="animate-spin text-sm" /> : <BiSearch />}
                </button>
              </form>
            </div>

            {/* Found Order Card */}
            {searchedOrder && (
              <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <h3 className="text-xs font-bold text-slate-900">#ORD-{searchedOrder.order_id} Details</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                    searchedOrder.status === 'delivered' ? 'bg-emerald-50 text-emerald-700' :
                    searchedOrder.status === 'returned' ? 'bg-amber-50 text-amber-700' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {searchedOrder.status}
                  </span>
                </div>

                <div className="flex flex-col gap-2 text-xxs text-slate-600 font-medium">
                  <div className="flex gap-1.5 items-center"><BiUser className="text-slate-400" /> <span>{searchedOrder.customer_name || 'Guest'}</span></div>
                  <div className="flex gap-1.5 items-center"><BiPhone className="text-slate-400" /> <span>{searchedOrder.phone}</span></div>
                  <div className="flex gap-1.5 items-start"><BiMap className="text-slate-400 mt-0.5" /> <span className="leading-tight">{searchedOrder.shipping_address || 'In-Store POS'}</span></div>
                  <div className="border-t border-slate-100 my-2 pt-2 flex justify-between items-center">
                    <span className="font-bold text-slate-500">Payable Total:</span>
                    <span className="text-sm font-black text-slate-850">৳{parseFloat(searchedOrder.total_amount).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 border-t border-slate-100 pt-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Ordered Items</span>
                  <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                    {searchedOrder.items?.map((item, index) => (
                      <div key={index} className="text-xxs text-slate-600 flex justify-between">
                        <span className="truncate max-w-[150px]">{item.product_name} {item.variant_name ? `(${item.variant_name})` : ''}</span>
                        <span className="font-bold text-slate-500">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {searchedOrder.status === 'returned' ? (
                  <div className="p-3 bg-amber-50 text-amber-800 border border-amber-100 rounded-xl text-xxs flex gap-2 items-center">
                    <BiInfoCircle className="text-sm shrink-0" />
                    <span>This order has already been marked as returned and items were restocked.</span>
                  </div>
                ) : searchedOrder.status === 'cancelled' ? (
                  <div className="p-3 bg-rose-50 text-rose-800 border border-rose-100 rounded-xl text-xxs flex gap-2 items-center">
                    <BiXCircle className="text-sm shrink-0" />
                    <span>This order was cancelled. Restocking is not applicable for cancelled stubs.</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleProcessReturn(searchedOrder.order_id)}
                    disabled={processingId !== null}
                    className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    {processingId === searchedOrder.order_id ? (
                      <BiLoaderAlt className="animate-spin text-sm" />
                    ) : (
                      <>
                        <BiUndo className="text-sm" /> Mark Order as Returned
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Right panel - Return logs list */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm flex flex-col gap-4 lg:col-span-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide border-b border-slate-100 pb-2">Returned Transactions Register</h3>
            
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-2">
                <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
                <p className="text-slate-500 text-xs font-semibold animate-pulse">Fetching returns archive...</p>
              </div>
            ) : returnedOrders.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-12">No returned orders have been logged yet.</p>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-xxs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-2 text-center">ID</th>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Phone</th>
                      <th className="px-3 py-2">Items Summary</th>
                      <th className="px-3 py-2 text-right">Refund Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {returnedOrders.map(order => {
                      const itemSummary = order.items
                        ? order.items.map(item => `${item.product_name} x${item.quantity}`).join(', ')
                        : 'N/A'
                      return (
                        <tr key={order.order_id} className="hover:bg-slate-50/50 transition">
                          <td className="px-3 py-2.5 text-center font-bold text-slate-800">#ORD-{order.order_id}</td>
                          <td className="px-3 py-2.5 font-bold text-slate-800 truncate max-w-[100px]" title={order.customer_name || 'Guest'}>{order.customer_name || 'Guest'}</td>
                          <td className="px-3 py-2.5 font-semibold text-slate-550">{order.phone}</td>
                          <td className="px-3 py-2.5 text-slate-500 truncate max-w-[150px]" title={itemSummary}>{itemSummary}</td>
                          <td className="px-3 py-2.5 text-right font-black text-rose-600">৳{parseFloat(order.total_amount).toFixed(2)}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
