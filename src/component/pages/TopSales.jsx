'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import ProductCard from '../cards/Product'
import { Context } from '../helper/Context'
import { BiLoaderAlt, BiSolidChevronRight } from 'react-icons/bi'
import Link from 'next/link'

const TopSales = () => {
  const { website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopSales = async () => {
      try {
        const res = await axios.get('/api/product')
        const activeProducts = res.data.filter(p => p.is_active !== false)
        // Sort by stock quantity descending to represent popular items
        const sortedProducts = activeProducts.sort(
          (a, b) => (parseInt(b.total_stock || b.stock, 10) - parseInt(a.total_stock || a.stock, 10))
        )
        setProducts(sortedProducts.slice(0, 4))
      } catch (err) {
        console.error('Failed to load top sales products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTopSales()
  }, [])

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center items-center">
        <BiLoaderAlt className="text-3xl animate-spin" style={{ color: themeColor }} />
      </div>
    )
  }

  if (products.length === 0) return null

  return (
    <div className="w-full py-16 px-4 md:px-8 bg-white border-b border-slate-100">
      <div className="w-full flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600" style={{ color: themeColor }}>
              Bestsellers
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Popular Items In High Demand
            </h2>
          </div>
          <Link 
            href="/products" 
            className="flex items-center gap-1 text-xs font-bold hover:gap-1.5 transition-all text-slate-550 hover:text-slate-900"
          >
            See All <BiSolidChevronRight className="text-base" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard key={p.product_id} product={p} />
          ))}
        </div>

      </div>
    </div>
  )
}

export default TopSales