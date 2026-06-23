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
  BiPackage,
  BiFilterAlt
} from 'react-icons/bi'

export default function DashboardManagerProductPage() {
  const { dashSidebar } = useContext(Context)
  
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const fetchData = async () => {
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        axios.get('/api/product'),
        axios.get('/api/category'),
        axios.get('/api/brand')
      ])
      setProducts(prodRes.data)
      setCategories(catRes.data)
      setBrands(brandRes.data)
    } catch (err) {
      toast.error('Failed to load products database')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? All of its variants will also be deleted!')) {
      return
    }
    setDeletingId(id)
    try {
      await axios.delete(`/api/product/${id}`)
      toast.success('Product deleted successfully')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete product')
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(search.toLowerCase())) ||
      (p.barcode && p.barcode.toLowerCase().includes(search.toLowerCase()))
    
    const matchesCategory = !selectedCategory || p.category_id === parseInt(selectedCategory, 10)
    const matchesBrand = !selectedBrand || p.brand_id === parseInt(selectedBrand, 10)
    
    return matchesSearch && matchesCategory && matchesBrand
  })

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 animate-fade-in">
              <BiPackage className="text-emerald-600" />
              Products Catalog
            </h1>
            <p className="text-slate-500 text-sm mt-0.5 animate-fade-in">Manage items inventory, variants, barcodes, and pricing configurations.</p>
          </div>
          <Link
            href="/dashboard/manager/product/create"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/10 cursor-pointer self-start sm:self-auto"
          >
            <BiPlus className="text-lg" /> Create Product
          </Link>
        </div>

        {/* Actions/Filters bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm animate-fade-in">
          {/* Search */}
          <div className="w-full md:flex-1 relative">
            <BiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search product name, description, barcode..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>
          
          {/* Filters */}
          <div className="w-full md:w-auto flex items-center gap-3 self-stretch md:self-auto">
            <div className="flex-1 md:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 md:w-48">
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              >
                <option value="">All Brands</option>
                {brands.map((br) => (
                  <option key={br.brand_id} value={br.brand_id}>
                    {br.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table content */}
        {loading ? (
          <div className="w-full h-64 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 gap-2">
            <BiLoaderAlt className="animate-spin text-xl text-emerald-600" />
            <span>Loading product database...</span>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                    <th className="px-6 py-4">Product Detail</th>
                    <th className="px-6 py-4">Catalog Linkage</th>
                    <th className="px-6 py-4">Sale / Retail Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredProducts.map((p) => (
                    <tr key={p.product_id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                            {p.image ? (
                              <img src={p.image} alt={p.name} className="object-cover w-full h-full" />
                            ) : (
                              <BiPackage className="text-2xl text-slate-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 text-base block">{p.name}</span>
                            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-0.5 block">
                              Unit: {p.unit || 'pcs'} | Barcode: {p.barcode || 'N/A'} | Stock: {p.stock !== null && p.stock !== undefined ? p.stock : 0}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="font-semibold text-slate-600">Category: {p.category_name || 'N/A'}</span>
                          <span className="font-medium text-slate-500">Brand: {p.brand_name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-semibold text-slate-800">${p.sale_price}</span>
                          {p.discount_price > 0 && (
                            <span className="text-slate-400 text-xs line-through">${p.discount_price}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          p.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {p.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/manager/product/edit/${p.product_id}`}
                            className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition"
                          >
                            <BiEditAlt className="text-lg" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p.product_id)}
                            disabled={deletingId === p.product_id}
                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition disabled:opacity-50"
                          >
                            {deletingId === p.product_id ? (
                              <BiLoaderAlt className="animate-spin text-lg" />
                            ) : (
                              <BiTrash className="text-lg" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="w-full py-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-slate-400 gap-2">
            <BiPackage className="text-4xl text-slate-300" />
            <p className="font-semibold text-slate-600">No products found</p>
            <p className="text-xs text-slate-400 mt-0.5">Try adjusting your filters/search or add a product above.</p>
          </div>
        )}

      </div>
    </div>
  )
}
