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
  BiUser,
  BiPhone,
  BiEnvelope,
  BiBuildingHouse,
  BiMapPin
} from 'react-icons/bi'

export default function DashboardManagerSupplierPage() {
  const { dashSidebar } = useContext(Context)
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const fetchSuppliers = async () => {
    try {
      const res = await axios.get('/api/supplier')
      setSuppliers(res.data)
    } catch (err) {
      toast.error('Failed to load suppliers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supplier? This will not delete historical purchases, but prevents new transactions.')) {
      return
    }
    setDeletingId(id)
    try {
      await axios.delete(`/api/supplier/${id}`)
      toast.success('Supplier deleted successfully')
      fetchSuppliers()
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete supplier')
      console.error(err)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.company_name && s.company_name.toLowerCase().includes(search.toLowerCase())) ||
    (s.phone && s.phone.toLowerCase().includes(search.toLowerCase())) ||
    (s.email && s.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 animate-fade-in">
              <BiUser className="text-emerald-600" />
              Suppliers Directory
            </h1>
            <p className="text-slate-500 text-sm mt-0.5 animate-fade-in">Manage external product suppliers, contacts, and metadata.</p>
          </div>
          <Link
            href="/dashboard/manager/supplier/create"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm shadow-emerald-600/10 cursor-pointer self-start sm:self-auto"
          >
            <BiPlus className="text-lg" /> Create Supplier
          </Link>
        </div>

        {/* Actions bar */}
        <div className="flex items-center gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm animate-fade-in">
          <div className="flex-1 max-w-md relative">
            <BiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
            <input
              type="text"
              placeholder="Search by name, company, email or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>
        </div>

        {/* Table content */}
        {loading ? (
          <div className="w-full h-64 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-center text-slate-500 gap-2">
            <BiLoaderAlt className="animate-spin text-xl text-emerald-600" />
            <span>Loading suppliers...</span>
          </div>
        ) : filteredSuppliers.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-500">
                <thead className="bg-slate-55 bg-slate-50/75 text-xs font-semibold text-slate-700 uppercase border-b border-slate-100">
                  <tr>
                    <th scope="col" className="px-6 py-4">Supplier Info</th>
                    <th scope="col" className="px-6 py-4">Contact Info</th>
                    <th scope="col" className="px-6 py-4">Address</th>
                    <th scope="col" className="px-6 py-4">Status</th>
                    <th scope="col" className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 border-t border-slate-100">
                  {filteredSuppliers.map((supplier) => (
                    <tr key={supplier.supplier_id} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-base">{supplier.name}</span>
                          {supplier.company_name && (
                            <span className="text-slate-500 text-xs flex items-center gap-1 mt-0.5">
                              <BiBuildingHouse className="text-slate-400" />
                              {supplier.company_name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="flex items-center gap-1.5 text-slate-700">
                            <BiPhone className="text-slate-400" />
                            {supplier.phone}
                          </span>
                          {supplier.email && (
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <BiEnvelope className="text-slate-400" />
                              {supplier.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {supplier.address ? (
                          <div className="max-w-[200px] truncate text-xs text-slate-650 flex items-start gap-1" title={supplier.address}>
                            <BiMapPin className="text-slate-450 shrink-0 mt-0.5" />
                            <span>{supplier.address}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          supplier.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {supplier.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/manager/supplier/edit/${supplier.supplier_id}`}
                            className="p-2 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 rounded-lg transition"
                          >
                            <BiEditAlt className="text-lg" />
                          </Link>
                          <button
                            onClick={() => handleDelete(supplier.supplier_id)}
                            disabled={deletingId === supplier.supplier_id}
                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition disabled:opacity-50"
                          >
                            {deletingId === supplier.supplier_id ? (
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
          <div className="w-full py-16 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-slate-400 gap-2 animate-fade-in">
            <BiUser className="text-4xl text-slate-300" />
            <p className="font-semibold text-slate-600">No suppliers found</p>
            <p className="text-xs text-slate-400 mt-0.5">Try a different search query or add a supplier above.</p>
          </div>
        )}

      </div>
    </div>
  )
}
