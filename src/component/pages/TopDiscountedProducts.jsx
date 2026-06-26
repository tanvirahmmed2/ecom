'use client'
import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import ProductCard from '../cards/Product'
import { Context } from '../helper/Context'
import { BiLoaderAlt, BiSolidChevronRight } from 'react-icons/bi'
import Link from 'next/link'

const TopDiscountedProducts = () => {
  const { website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopDiscounts = async () => {
      try {
        const res = await axios.get('/api/product')
        const activeProducts = res.data.filter(p => p.is_active !== false)
        // Filter products with discount_price > 0 and sort by discount amount descending
        const discountProducts = activeProducts
          .filter(p => p.discount_price && parseFloat(p.discount_price) > 0)
          .sort((a, b) => parseFloat(b.discount_price) - parseFloat(a.discount_price))
        setProducts(discountProducts.slice(0, 4))
      } catch (err) {
        console.error('Failed to load discounted products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchTopDiscounts()
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
    <div className="w-full py-16 px-4 md:px-8 bg-slate-50 border-b border-slate-100">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-red-500">
              Special Offers
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Top Discounted Products
            </h2>
          </div>
          <Link 
            href="/offers" 
            className="flex items-center gap-1 text-xs font-bold hover:gap-1.5 transition-all text-slate-550 hover:text-slate-900"
          >
            View All Offers <BiSolidChevronRight className="text-base" />
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

export default TopDiscountedProducts