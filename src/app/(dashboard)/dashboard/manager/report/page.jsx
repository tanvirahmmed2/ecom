'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import { 
  BiFile, 
  BiPrinter, 
  BiLoaderAlt, 
  BiShieldQuarter, 
  BiTrendingUp, 
  BiCategory, 
  BiDollarCircle, 
  BiCreditCard 
} from 'react-icons/bi'

export default function ManagerReportPage() {
  const { dashSidebar, user, loading: userLoading, website } = useContext(Context)
  
  const [reportData, setReportData] = useState({
    topProducts: [],
    categorySales: [],
    salesTrend: [],
    paymentBreakdown: []
  })
  const [loading, setLoading] = useState(true)

  const fetchReportData = async () => {
    setLoading(true)
    try {
      const res = await axios.get('/api/sale/report')
      setReportData(res.data)
    } catch (err) {
      console.error('Failed to fetch analytics reports:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userLoading) return
    if (user && ['manager', 'admin'].includes(user.role)) {
      fetchReportData()
    }
  }, [user, userLoading])

  const handlePrintReport = () => {
    const printWindow = window.open('', '_blank', 'width=900,height=900')
    if (!printWindow) return

    const storeName = website?.name || 'Store Analytics'
    const today = new Date().toLocaleDateString()

    const trendRows = reportData.salesTrend.map(row => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: left;">${new Date(row.date).toLocaleDateString()}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${row.count}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">৳${parseFloat(row.total).toFixed(2)}</td>
      </tr>
    `).join('')

    const productRows = reportData.topProducts.map((row, idx) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: center; font-weight: bold;">#${idx + 1}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: left; font-weight: 600;">${row.name}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${row.quantity}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">৳${parseFloat(row.revenue).toFixed(2)}</td>
      </tr>
    `).join('')

    const categoryRows = reportData.categorySales.map(row => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: left; font-weight: 600;">${row.name}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${row.quantity}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600;">৳${parseFloat(row.revenue).toFixed(2)}</td>
      </tr>
    `).join('')

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Store Sales Report - ${today}</title>
          <style>
            body { font-family: system-ui, sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 24px; font-weight: 900; color: #0f172a; uppercase; }
            .meta { font-size: 12px; color: #64748b; margin-top: 4px; }
            .section { margin-bottom: 40px; page-break-inside: avoid; }
            .sec-title { font-size: 16px; font-weight: 800; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-bottom: 16px; color: #0f172a; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px; }
            th { background-color: #f8fafc; font-weight: 700; padding: 10px 12px; border-bottom: 2px solid #e2e8f0; text-transform: uppercase; font-size: 10px; color: #475569; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${storeName} - Sales Audit Report</div>
            <div class="meta">Generated on: ${today} | Authority: Manager Portal</div>
          </div>
          
          <div class="section">
            <div class="sec-title">1. Top Selling Products</div>
            <table>
              <thead>
                <tr>
                  <th style="width: 8%; text-align: center;">Rank</th>
                  <th style="width: 52%; text-align: left;">Product</th>
                  <th style="width: 15%; text-align: center;">Qty Sold</th>
                  <th style="width: 25%; text-align: right;">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${productRows || '<tr><td colspan="4" style="text-align: center; padding: 12px;">No products sold in this period.</td></tr>'}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="sec-title">2. Category Distribution</div>
            <table>
              <thead>
                <tr>
                  <th style="text-align: left;">Category Name</th>
                  <th style="text-align: center; width: 25%;">Qty Sold</th>
                  <th style="text-align: right; width: 35%;">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${categoryRows || '<tr><td colspan="3" style="text-align: center; padding: 12px;">No sales by category recorded.</td></tr>'}
              </tbody>
            </table>
          </div>

          <div class="section">
            <div class="sec-title">3. 30-Day Daily Sales Summary</div>
            <table>
              <thead>
                <tr>
                  <th style="text-align: left;">Date</th>
                  <th style="text-align: center; width: 25%;">Orders Count</th>
                  <th style="text-align: right; width: 35%;">Net Revenue</th>
                </tr>
              </thead>
              <tbody>
                ${trendRows || '<tr><td colspan="3" style="text-align: center; padding: 12px;">No trends available for last 30 days.</td></tr>'}
              </tbody>
            </table>
          </div>

          <div style="margin-top: 60px; text-align: center; font-size: 10px; color: #94a3b8; border-top: 1px dashed #e2e8f0; padding-top: 16px;">
            Confidential Report — Internal Management Use Only — Computer Generated Receipt
          </div>

          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  if (userLoading || (loading && reportData.salesTrend.length === 0)) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
          <p className="text-slate-655 text-sm font-semibold animate-pulse">Compiling database analytics report...</p>
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
          <p className="text-slate-605 text-sm">Please sign in with a Manager or Admin account to view reporting.</p>
          <Link href="/login" className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-sm">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // Calculate some aggregates
  const totalQtySold = reportData.topProducts.reduce((acc, curr) => acc + curr.quantity, 0)
  const totalRevenue = reportData.categorySales.reduce((acc, curr) => acc + curr.revenue, 0)

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Analytics Reports</h1>
            <p className="text-xs text-slate-500 mt-1">Review aggregated store indicators, top sellers, category revenue distribution, and daily sales metrics.</p>
          </div>
          <button
            onClick={handlePrintReport}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <BiPrinter className="text-sm" /> Print Audit Sheet
          </button>
        </div>

        {/* Aggregate Overview Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
              <BiDollarCircle />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Gross Items Sales</p>
              <h3 className="text-base font-black text-slate-800 mt-0.5">৳{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              <BiTrendingUp />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Items Dispatched</p>
              <h3 className="text-base font-black text-slate-800 mt-0.5">{totalQtySold} Units</h3>
            </div>
          </div>
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-lg">
              <BiFile />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Audit Coverage</p>
              <h3 className="text-base font-black text-slate-800 mt-0.5">Last 30 Days</h3>
            </div>
          </div>
        </div>

        {/* Top selling & Categories distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Top Selling Products */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-850 border-b border-slate-150 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <BiTrendingUp className="text-slate-500" /> Top Selling Products
            </h3>
            {reportData.topProducts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No product sale data available.</p>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-2 text-center" style={{ width: '10%' }}>Rank</th>
                      <th className="px-3 py-2" style={{ width: '50%' }}>Product Title</th>
                      <th className="px-3 py-2 text-center" style={{ width: '15%' }}>Qty</th>
                      <th className="px-3 py-2 text-right" style={{ width: '25%' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {reportData.topProducts.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="px-3 py-2 text-center font-bold text-slate-500">#{idx + 1}</td>
                        <td className="px-3 py-2 font-bold text-slate-800 truncate max-w-[200px]" title={row.name}>{row.name}</td>
                        <td className="px-3 py-2 text-center font-semibold text-slate-700">{row.quantity}</td>
                        <td className="px-3 py-2 text-right font-black text-slate-900">৳{parseFloat(row.revenue).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sales by Category */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-850 border-b border-slate-150 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <BiCategory className="text-slate-500" /> Sales by Category
            </h3>
            {reportData.categorySales.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No sales logs categorized.</p>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-2">Category Name</th>
                      <th className="px-3 py-2 text-center" style={{ width: '20%' }}>Qty</th>
                      <th className="px-3 py-2 text-right" style={{ width: '30%' }}>Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {reportData.categorySales.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="px-3 py-2 font-bold text-slate-800">{row.name}</td>
                        <td className="px-3 py-2 text-center font-semibold text-slate-700">{row.quantity}</td>
                        <td className="px-3 py-2 text-right font-black text-slate-900">৳{parseFloat(row.revenue).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* 30 day daily sales & Payment splits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* 30 Day daily trends */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm flex flex-col gap-4 lg:col-span-2">
            <h3 className="text-xs font-bold text-slate-850 border-b border-slate-150 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <BiTrendingUp className="text-slate-500" /> Daily Revenue (Last 30 Days)
            </h3>
            {reportData.salesTrend.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No trends available in the last 30 days.</p>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                    <tr>
                      <th className="px-3 py-2">Date</th>
                      <th className="px-3 py-2 text-center">Orders Count</th>
                      <th className="px-3 py-2 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {reportData.salesTrend.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition">
                        <td className="px-3 py-2 font-semibold text-slate-600">{new Date(row.date).toLocaleDateString()}</td>
                        <td className="px-3 py-2 text-center font-bold text-slate-700">{row.count}</td>
                        <td className="px-3 py-2 text-right font-black text-slate-900">৳{parseFloat(row.total).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Payment Type Splits */}
          <div className="bg-white rounded-2xl border border-slate-150 p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-850 border-b border-slate-150 pb-2 flex items-center gap-1.5 uppercase tracking-wider">
              <BiCreditCard className="text-slate-500" /> Payment Methods Share
            </h3>
            {reportData.paymentBreakdown.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No transaction payment data.</p>
            ) : (
              <div className="flex flex-col gap-4 mt-2">
                {reportData.paymentBreakdown.map((row, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Method</span>
                      <h4 className="text-xs font-black text-slate-800 uppercase mt-0.5">{row.type}</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5">{row.count} transactions completed</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sales Value</span>
                      <h4 className="text-sm font-black text-emerald-600 mt-0.5">৳{parseFloat(row.total).toFixed(2)}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
