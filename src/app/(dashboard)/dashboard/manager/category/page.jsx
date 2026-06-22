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
  BiCategory 
} from 'react-icons/bi'

export default function DashboardManagerCategoryPage() {
  const { dashSidebar } = useContext(Context)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/category')
      setCategories(res.data)
    } catch (err) {
      toast.error('Failed to load categories')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Subcategories will also be deleted!')) {
      return
    }
    setDeletingId(id)
    try {
      await axios.delete(`/api/category/${id}`)
      toast.success('Category deleted successfully')
      fetchCategories()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete category')
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.parent_name && c.parent_name.toLowerCase().includes(search.toLowerCase())) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 animate-fade-in">
              <BiCategory className="text-emerald-600" />
              Categories Catalog
            </h1>
            <p className="text-slate-500 text-sm mt-0.5 animate-fade-in">Manage and organize store department segments.</p>
          </div>
          <Link
            href="/dashboard/manager/category/create"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/10 cursor-pointer self-start sm:self-auto"
          >
            <BiPlus className="text-lg" /> Create Category
          </Link>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm animate-fade-in">
          <div className="flex-1 max-w-md relative">
            <BiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search category name, parent, or slug..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>
        </div>

        {/* Table/List content */}
        {loading ? (
          <div className="w-full h-64 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 gap-2">
            <BiLoaderAlt className="animate-spin text-xl text-emerald-600" />
            <span>Loading categories...</span>
          </div>
        ) : filteredCategories.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                    <th className="px-6 py-4">Category Detail</th>
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4">Hierarchy</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredCategories.map((cat) => (
                    <tr key={cat.category_id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg border border-slate-100 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                            {cat.image ? (
                              <img src={cat.image} alt={cat.name} className="object-cover w-full h-full" />
                            ) : (
                              <BiCategory className="text-xl text-slate-400" />
                            )}
                          </div>
                          <span className="font-semibold text-slate-800 text-base">{cat.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{cat.slug}</td>
                      <td className="px-6 py-4">
                        {cat.parent_name ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            Sub of {cat.parent_name}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                            Top Level
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/manager/category/edit/${cat.category_id}`}
                            className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition"
                          >
                            <BiEditAlt className="text-lg" />
                          </Link>
                          <button
                            onClick={() => handleDelete(cat.category_id)}
                            disabled={deletingId === cat.category_id}
                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition disabled:opacity-50"
                          >
                            {deletingId === cat.category_id ? (
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
            <BiCategory className="text-4xl text-slate-300" />
            <p className="font-semibold text-slate-600">No categories found</p>
            <p className="text-xs text-slate-400 mt-0.5">Try a different search query or add a category above.</p>
          </div>
        )}

      </div>
    </div>
  )
}
