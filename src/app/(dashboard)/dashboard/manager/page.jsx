'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Context } from '@/component/helper/Context'
import { 
  BiCategory, 
  BiTag, 
  BiPackage, 
  BiArrowToRight,
  BiGridAlt
} from 'react-icons/bi'

export default function DashboardManagerPage() {
  const { dashSidebar, user } = useContext(Context)
  const [stats, setStats] = useState({ categories: 0, brands: 0, products: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/dashboard/stats')
        setStats(res.data)
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm animate-fade-in">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Welcome Back, {user?.name }
            </h1>
            <p className="text-slate-500 text-sm mt-1">Here is an overview of your store components and catalog tools.</p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wider self-start md:self-auto">
            {user?.role }
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-sm font-medium">Total Categories</span>
              <span className="text-3xl font-bold text-slate-800">
                {loading ? <span className="animate-pulse">...</span> : stats.categories}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl">
              <BiCategory />
            </div>
          </div>

          {/* Brands Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-sm font-medium">Total Brands</span>
              <span className="text-3xl font-bold text-slate-800">
                {loading ? <span className="animate-pulse">...</span> : stats.brands}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl">
              <BiTag />
            </div>
          </div>

          {/* Products Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div className="flex flex-col gap-1">
              <span className="text-slate-400 text-sm font-medium">Total Products</span>
              <span className="text-3xl font-bold text-slate-800">
                {loading ? <span className="animate-pulse">...</span> : stats.products}
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl">
              <BiPackage />
            </div>
          </div>
        </div>

        {/* Modules Grid */}
        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BiGridAlt className="text-slate-500" />
            Catalog Management Modules
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Category Module */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:border-emerald-500 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
                  <BiCategory />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Category Catalog</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Manage the hierarchical category tree. Add new departments, upload category visual banners, and organize sub-items.
                </p>
              </div>
              <Link href="/dashboard/manager/category" className="mt-6 flex items-center gap-2 text-emerald-600 font-semibold text-sm hover:gap-3 transition-all">
                Manage Categories <BiArrowToRight />
              </Link>
            </div>

            {/* Brand Module */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:border-blue-500 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl mb-4 group-hover:bg-blue-600 group-hover:text-white transition">
                  <BiTag />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Brand Catalog</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Add and modify product brands. Keep supplier identities aligned, upload logos, and toggle active status.
                </p>
              </div>
              <Link href="/dashboard/manager/brands" className="mt-6 flex items-center gap-2 text-blue-600 font-semibold text-sm hover:gap-3 transition-all">
                Manage Brands <BiArrowToRight />
              </Link>
            </div>

            {/* Product Module */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between hover:border-purple-500 transition-all group">
              <div>
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xl mb-4 group-hover:bg-purple-600 group-hover:text-white transition">
                  <BiPackage />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Product Catalog</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Update your store merchandise. Manage pricing tier fields, inventory units, barcodes, product assets, and variants.
                </p>
              </div>
              <Link href="/dashboard/manager/product" className="mt-6 flex items-center gap-2 text-purple-600 font-semibold text-sm hover:gap-3 transition-all">
                Manage Products <BiArrowToRight />
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  )
}
