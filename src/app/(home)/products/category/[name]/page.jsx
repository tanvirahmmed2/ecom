'use client'
import React, { useState, useEffect, useContext } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  const router = useRouter()

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
  const [inStockOnly, setInStockOnly] = useState(false)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

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

  // Reset pagination to page 1 on any filter parameter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy, minPrice, maxPrice, inStockOnly])

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      
      const finalPrice = p.discount_price && parseFloat(p.discount_price) > 0 
        ? Math.max(0, parseFloat(p.sale_price) - parseFloat(p.discount_price)) 
        : parseFloat(p.sale_price)

      const matchesMin = minPrice === '' || finalPrice >= parseFloat(minPrice)
      const matchesMax = maxPrice === '' || finalPrice <= parseFloat(maxPrice)
      const matchesStock = !inStockOnly || ((p.total_stock !== undefined ? parseInt(p.total_stock, 10) : parseInt(p.stock, 10)) > 0)

      return matchesSearch && matchesMin && matchesMax && matchesStock
    })
    .sort((a, b) => {
      const priceA = a.discount_price && parseFloat(a.discount_price) > 0 ? Math.max(0, parseFloat(a.sale_price) - parseFloat(a.discount_price)) : parseFloat(a.sale_price)
      const priceB = b.discount_price && parseFloat(b.discount_price) > 0 ? Math.max(0, parseFloat(b.sale_price) - parseFloat(b.discount_price)) : parseFloat(b.sale_price)

      if (sortBy === 'price-low') return priceA - priceB
      if (sortBy === 'price-high') return priceB - priceA
      if (sortBy === 'name-az') return a.name.localeCompare(b.name)
      return b.product_id - a.product_id // newest first
    })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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

        {/* Category Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{category.name}</h1>
          <p className="text-xs text-slate-550">
            {category.description || `Browse products under the ${category.name} category`}
          </p>
        </div>

        {/* Filters and Product Catalog Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm self-start lg:sticky lg:top-24">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <BiFilterAlt className="text-emerald-600 text-base" /> Filters
            </h3>

            {/* Subcategory Select Filter */}
            {subcategories.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-500">Subcategory</label>
                <div className="relative">
                  <BiCategory className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
                  <select
                    value={slug || ''}
                    onChange={(e) => {
                      if (e.target.value) {
                        router.push(`/products/category/${e.target.value}`)
                      }
                    }}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition cursor-pointer"
                  >
                    {parentCat ? (
                      <option value={parentCat.slug}>All {parentCat.category}</option>
                    ) : (
                      <option value={category.slug}>All {category.name}</option>
                    )}
                    {subcategories.map((sub) => (
                      <option key={sub.id} value={sub.slug}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

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
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">৳</span>
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
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">৳</span>
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

            {/* In Stock Only Checkbox */}
            <div className="flex items-center gap-2.5 mt-1 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <input
                type="checkbox"
                id="inStockOnly"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500 cursor-pointer"
              />
              <label htmlFor="inStockOnly" className="text-xs font-bold text-slate-700 cursor-pointer select-none">
                In Stock Only
              </label>
            </div>

            {(searchTerm || minPrice || maxPrice || inStockOnly) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setMinPrice('')
                  setMaxPrice('')
                  setInStockOnly(false)
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

            {paginatedProducts.length === 0 ? (
              <div className="w-full bg-white rounded-3xl border border-slate-105 p-16 text-center shadow-sm flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-350 text-4xl">
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
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {paginatedProducts.map((p) => (
                    <ProductCard key={p.product_id} product={p} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 mt-8 border-t border-slate-100 pt-6">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, index) => {
                      const pageNum = index + 1
                      const isCurrent = currentPage === pageNum
                      
                      if (totalPages > 5 && Math.abs(currentPage - pageNum) > 2 && pageNum !== 1 && pageNum !== totalPages) {
                        if (pageNum === 2 || pageNum === totalPages - 1) {
                          return <span key={pageNum} className="text-slate-400 text-xs px-1">...</span>
                        }
                        return null
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                            isCurrent 
                              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-605/10' 
                              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-350'
                          }`}
                          style={isCurrent ? { backgroundColor: themeColor } : {}}
                        >
                          {pageNum}
                        </button>
                      )
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

          </div>

        </div>

      </div>
    </div>
  )
}
