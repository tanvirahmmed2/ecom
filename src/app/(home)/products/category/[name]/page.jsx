'use client'
import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import ProductCard from '@/component/cards/Product'
import { 
  BiSearch, 
  BiFilterAlt, 
  BiSort, 
  BiChevronRight, 
  BiLoaderAlt, 
  BiCategory,
  BiArrowBack,
  BiDollar
} from 'react-icons/bi'
import Image from 'next/image'

export default function ProductsCategorySlugPage() {
  const params = useParams()
  const slug = params?.name

  const { categories, website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [category, setCategory] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters & Sorting state
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => {
    if (!slug) return

    const fetchCategoryAndProducts = async () => {
      setLoading(true)
      try {
        const [catRes, prodRes] = await Promise.all([
          axios.get(`/api/category/${slug}`),
          axios.get(`/api/product?category=${slug}`)
        ])
        setCategory(catRes.data)
        setProducts(prodRes.data)
      } catch (err) {
        console.error('Failed to load category products:', err)
        toast.error('Category not found or empty catalog')
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryAndProducts()
  }, [slug])

  // Get parent and sibling subcategories for quick filters
  let parentCat = null
  let subcategories = []

  if (category && categories) {
    if (category.parent_id === null) {
      // Active category is a Parent Category
      const matched = categories.find(c => c.id === category.category_id)
      subcategories = matched?.subcategory || []
    } else {
      // Active category is a Subcategory
      parentCat = categories.find(c => c.id === category.parent_id)
      subcategories = parentCat?.subcategory || []
    }
  }

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const finalPrice = p.discount_price && parseFloat(p.discount_price) > 0 
        ? parseFloat(p.discount_price) 
        : parseFloat(p.sale_price)

      const matchesMin = minPrice === '' || finalPrice >= parseFloat(minPrice)
      const matchesMax = maxPrice === '' || finalPrice <= parseFloat(maxPrice)

      return matchesSearch && matchesMin && matchesMax
    })
    .sort((a, b) => {
      const priceA = a.discount_price && parseFloat(a.discount_price) > 0 ? parseFloat(a.discount_price) : parseFloat(a.sale_price)
      const priceB = b.discount_price && parseFloat(b.discount_price) > 0 ? parseFloat(b.discount_price) : parseFloat(b.sale_price)

      if (sortBy === 'price-low') return priceA - priceB
      if (sortBy === 'price-high') return priceB - priceA
      if (sortBy === 'name-az') return a.name.localeCompare(b.name)
      return b.product_id - a.product_id // newest first
    })

  if (loading) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center gap-3 bg-slate-50">
        <BiLoaderAlt className="text-4xl text-emerald-600 animate-spin" />
        <span className="text-sm font-semibold text-slate-500">Loading products catalog...</span>
      </div>
    )
  }

  if (!category) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 p-8 text-center shadow-sm flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 text-3xl">
            <BiCategory />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Category Not Found</h2>
          <p className="text-sm text-slate-500">The category you are looking for does not exist or has been removed.</p>
          <Link href="/products/category" className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition">
            Back to Categories
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 py-12 px-4 md:px-8 relative overflow-hidden">
      
      {/* Visual Ambient Glows */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full blur-[100px] opacity-10 pointer-events-none"
        style={{ backgroundColor: themeColor }}
      />

      <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
        
        {/* Breadcrumb Trail */}
        <div className="flex items-center flex-wrap gap-1.5 text-xs font-semibold text-slate-400">
          <Link href="/" className="hover:text-slate-600 transition">Home</Link>
          <BiChevronRight />
          <Link href="/products/category" className="hover:text-slate-600 transition">Categories</Link>
          <BiChevronRight />
          {parentCat ? (
            <>
              <Link href={`/products/category/${parentCat.slug}`} className="hover:text-slate-600 transition">
                {parentCat.category}
              </Link>
              <BiChevronRight />
            </>
          ) : null}
          <span className="text-slate-700">{category.name}</span>
        </div>

        {/* Hero Section of Category */}
        <div className="relative h-28 w-full rounded-3xl overflow-hidden bg-slate-900 shadow-sm border border-slate-100 flex items-end">
          <Image width={1000} height={100}
            src={category.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80'}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
          
          <div className="relative p-8 md:p-10 flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              {category.name}
            </h1>
            
          </div>
        </div>

        {/* Subcategories Filter Chips */}
        {subcategories.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filter by Subcategory</span>
            <div className="flex flex-wrap gap-2.5">
              {/* Parent Category option if currently viewing subcategory */}
              {parentCat && (
                <Link
                  href={`/products/category/${parentCat.slug}`}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                >
                  <BiArrowBack className="text-sm" /> All {parentCat.category}
                </Link>
              )}
              {subcategories.map((sub) => {
                const isActive = sub.slug === slug
                return (
                  <Link
                    key={sub.id}
                    href={`/products/category/${sub.slug}`}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      isActive 
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-605/10'
                        : 'bg-white hover:bg-slate-50 text-slate-650 border border-slate-200 hover:border-slate-300'
                    }`}
                    style={isActive ? { backgroundColor: themeColor } : {}}
                  >
                    {sub.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Filters and Product Catalog Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm self-start lg:sticky lg:top-24">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <BiFilterAlt className="text-emerald-600 text-base" /> Filters
            </h3>

            {/* Search */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500">Search Products</label>
              <div className="relative">
                <BiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <input
                  type="text"
                  placeholder="Type to search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500">Price Range</label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"><BiDollar /></span>
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <span className="text-slate-400 text-xs">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]"><BiDollar /></span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full pl-6 pr-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:bg-white focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Sort Order */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500">Sort By</label>
              <div className="relative">
                <BiSort className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name-az">Name: A to Z</option>
                </select>
              </div>
            </div>

            {(searchTerm || minPrice || maxPrice) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setMinPrice('')
                  setMaxPrice('')
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer text-center"
              >
                Clear Filters
              </button>
            )}

          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="w-full bg-white rounded-3xl border border-slate-105 p-16 text-center shadow-sm flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 text-4xl">
                  <BiSearch />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">No products found</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                    Try adjusting your search criteria, price range filters, or subcategories to locate items.
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.product_id} product={p} />
                ))}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
