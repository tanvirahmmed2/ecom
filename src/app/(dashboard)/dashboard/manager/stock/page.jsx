'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import { 
  BiSearch, 
  BiPackage, 
  BiLoaderAlt, 
  BiShieldQuarter, 
  BiPlusCircle,
  BiTrendingUp,
  BiTag,
  BiCategory,
  BiChevronRight
} from 'react-icons/bi'

export default function ManagerStockInventoryPage() {
  const { dashSidebar, user, loading: userLoading } = useContext(Context)
  
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const fetchStockData = async () => {
    setLoading(true)
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get('/api/product'),
        axios.get('/api/category')
      ])
      setProducts(prodRes.data)
      setCategories(catRes.data)
    } catch (err) {
      console.error('Failed to load stock inventory data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userLoading) return
    if (user && ['manager', 'admin'].includes(user.role)) {
      fetchStockData()
    }
  }, [user, userLoading])

  if (userLoading || (loading && products.length === 0)) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <BiLoaderAlt className="animate-spin text-4xl text-slate-800" />
          <p className="text-slate-655 text-sm font-semibold animate-pulse">Loading stock inventory database...</p>
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
          <p className="text-slate-600 text-sm">Please sign in with a Manager or Admin account to view inventory.</p>
          <Link href="/login" className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition cursor-pointer shadow-sm">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // Filter products by category & search
  const filteredProducts = products.filter(prod => {
    const matchesCategory = selectedCategory === 'all' || prod.category_id?.toString() === selectedCategory
    const matchesSearch = 
      prod.name.toLowerCase().includes(search.toLowerCase()) ||
      (prod.barcode && prod.barcode.includes(search))
    return matchesCategory && matchesSearch
  })

  // Stock counters
  const totalItems = products.length
  const outOfStockCount = products.filter(p => (p.total_stock || p.stock || 0) === 0).length
  const lowStockCount = products.filter(p => {
    const stock = p.total_stock || p.stock || 0
    return stock > 0 && stock <= 5
  }).length

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Stock Inventory</h1>
            <p className="text-xs text-slate-500 mt-1">Track physical warehouse listings, check barcodes, purchase price, and restock warning signs.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard/manager/purchase/create" className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm cursor-pointer">
              <BiPlusCircle /> Restock Order (Purchase)
            </Link>
          </div>
        </div>

        {/* Inventory Analytics Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-lg">
              <BiPackage />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Catalog Items</p>
              <h3 className="text-base font-black text-slate-800 mt-0.5">{totalItems} Products</h3>
            </div>
          </div>
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg">
              <BiShieldQuarter />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Out of Stock</p>
              <h3 className="text-base font-black text-slate-800 mt-0.5">{outOfStockCount} Products</h3>
            </div>
          </div>
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
              <BiTrendingUp />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Low Stock Warn</p>
              <h3 className="text-base font-black text-slate-800 mt-0.5">{lowStockCount} Products</h3>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex gap-2 items-center bg-white px-3 py-2 border border-slate-200 rounded-xl w-full md:w-80 shadow-sm">
            <BiSearch className="text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search by name or barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-slate-850 text-xs w-full placeholder:text-slate-450"
            />
          </div>

          <div className="flex gap-2 items-center w-full md:w-auto">
            <span className="text-xs text-slate-500 font-bold hidden sm:inline">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold outline-none cursor-pointer shadow-sm w-full md:w-48"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Stock Ledger Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl py-16 px-6 text-center">
            <h3 className="font-bold text-slate-850 text-base">No Products Found</h3>
            <p className="text-slate-550 text-xs mt-1">There are no inventory items matching your query or active category filters.</p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto bg-white border border-slate-150 rounded-2xl shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50 text-slate-655 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Product Name</th>
                  <th className="px-4 py-3">Barcode</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Purchase P.</th>
                  <th className="px-4 py-3 text-right">Sale Price</th>
                  <th className="px-4 py-3 text-center">Stock Level</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                {filteredProducts.map(prod => {
                  const stock = prod.total_stock || prod.stock || 0
                  return (
                    <tr key={prod.product_id} className="hover:bg-slate-50/50 transition">
                      <td className="px-4 py-3.5">
                        <div className="font-bold text-slate-900 leading-tight">{prod.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{prod.unit ? `Unit: ${prod.unit}` : ''}</div>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-500 text-xxs">
                        <div>{prod.barcode || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600 font-semibold">{prod.brand_name || 'Generic'}</td>
                      <td className="px-4 py-3.5 text-slate-600 font-semibold">{prod.category_name || 'Uncategorized'}</td>
                      <td className="px-4 py-3.5 text-right font-medium text-slate-500">৳{parseFloat(prod.purchase_price || 0).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-slate-800">৳{parseFloat(prod.sale_price || 0).toFixed(2)}</td>
                      <td className="px-4 py-3.5 text-center font-bold font-mono text-slate-800">{stock}</td>
                      <td className="px-4 py-3.5 text-center">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          stock === 0 ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                          stock <= 5 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-100'
                        }`}>
                          {stock === 0 ? 'Out Of Stock' : stock <= 5 ? 'Low Stock' : 'In Stock'}
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
