'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import { 
  BiPlus, 
  BiSearch, 
  BiEditAlt, 
  BiTrash, 
  BiLoaderAlt, 
  BiTag 
} from 'react-icons/bi'

export default function DashboardManagerBrandsPage() {
  const { dashSidebar } = useContext(Context)
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const fetchBrands = async () => {
    try {
      const res = await axios.get('/api/brand')
      setBrands(res.data)
    } catch (err) {
      toast.error('Failed to load brands')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) {
      return
    }
    setDeletingId(id)
    try {
      await axios.delete(`/api/brand/${id}`)
      toast.success('Brand deleted successfully')
      fetchBrands()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete brand')
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredBrands = brands.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 animate-fade-in">
              <BiTag className="text-emerald-600" />
              Brands Catalog
            </h1>
            <p className="text-slate-500 text-sm mt-0.5 animate-fade-in">Manage product brands and visual store logos.</p>
          </div>
          <Link
            href="/dashboard/manager/brands/create"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/10 cursor-pointer self-start sm:self-auto"
          >
            <BiPlus className="text-lg" /> Create Brand
          </Link>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm animate-fade-in">
          <div className="flex-1 max-w-md relative">
            <BiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search brand name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>
        </div>

        {/* Grid content */}
        {loading ? (
          <div className="w-full h-64 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 gap-2">
            <BiLoaderAlt className="animate-spin text-xl text-emerald-600" />
            <span>Loading brands...</span>
          </div>
        ) : filteredBrands.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBrands.map((brand) => (
              <div key={brand.brand_id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex flex-col justify-between hover:shadow-md transition gap-4">
                
                {/* Logo and Status */}
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                    {brand.image ? (
                      <img src={brand.image} alt={brand.name} className="object-cover w-full h-full" />
                    ) : (
                      <BiTag className="text-2xl text-slate-400" />
                    )}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    brand.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {brand.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {/* Details */}
                <div>
                  <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{brand.name}</h3>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                    {brand.description ? brand.description.replace(/<[^>]*>/g, '') : 'No description available for this brand label.'}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between border-t border-slate-50 pt-3 mt-1">
                  <span className="text-xs text-slate-400 font-mono">ID: #{brand.brand_id}</span>
                  <div className="flex gap-2">
                    <Link
                      href={`/dashboard/manager/brands/edit/${brand.brand_id}`}
                      className="p-1.5 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition"
                    >
                      <BiEditAlt className="text-base" />
                    </Link>
                    <button
                      onClick={() => handleDelete(brand.brand_id)}
                      disabled={deletingId === brand.brand_id}
                      className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition disabled:opacity-50"
                    >
                      {deletingId === brand.brand_id ? (
                        <BiLoaderAlt className="animate-spin text-base" />
                      ) : (
                        <BiTrash className="text-base" />
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="w-full py-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-slate-400 gap-2">
            <BiTag className="text-4xl text-slate-300" />
            <p className="font-semibold text-slate-600">No brands found</p>
            <p className="text-xs text-slate-400 mt-0.5">Try a different search query or add a brand above.</p>
          </div>
        )}

      </div>
    </div>
  )
}
