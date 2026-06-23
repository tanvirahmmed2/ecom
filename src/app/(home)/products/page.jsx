'use client'
import React, { useState, useEffect, useContext } from 'react'
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
  BiDollar,
  BiCheckCircle
} from 'react-icons/bi'

export default function ProductsPage() {
  const { categories, website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters, Category Selection, & Sorting State
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [inStockOnly, setInStockOnly] = useState(false)

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Fetch all active products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const res = await axios.get('/api/product')
        setProducts(res.data.filter(p => p.is_active !== false))
      } catch (err) {
        console.error('Failed to load products list:', err)
        toast.error('Failed to load products catalog')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Reset pagination to page 1 whenever any filter parameter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortBy, minPrice, maxPrice, inStockOnly, selectedCategoryId])

  // Get active parent category object if selected
  const activeParentCat = categories.find(c => c.id === selectedCategoryId)
  
  // Also check if the selected category is a subcategory of a parent
  let activeSubCat = null
  let activeParentOfSub = null
  
  if (!activeParentCat && selectedCategoryId) {
    for (const parent of categories) {
      const matchedSub = parent.subcategory?.find(s => s.id === selectedCategoryId)
      if (matchedSub) {
        activeSubCat = matchedSub
        activeParentOfSub = parent
        break
      }
    }
  }

  // Filter & Sort Logic
  const filteredProducts = products
    .filter(p => {
      // 1. Search term match
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
      
      // 2. Category & Subcategory match
      let matchesCategory = true
      if (selectedCategoryId) {
        if (activeParentCat) {
          // If parent category is selected, include products from this parent and all its subcategories
          const subIds = activeParentCat.subcategory?.map(sub => sub.id) || []
          matchesCategory = p.category_id === selectedCategoryId || subIds.includes(p.category_id)
        } else {
          // If subcategory is selected, match strictly
          matchesCategory = p.category_id === selectedCategoryId
        }
      }

      // 3. Price Range match
      const finalPrice = p.discount_price && parseFloat(p.discount_price) > 0 
        ? Math.max(0, parseFloat(p.sale_price) - parseFloat(p.discount_price)) 
        : parseFloat(p.sale_price)
      const matchesMin = minPrice === '' || finalPrice >= parseFloat(minPrice)
      const matchesMax = maxPrice === '' || finalPrice <= parseFloat(maxPrice)

      // 4. In Stock match
      const matchesStock = !inStockOnly || (p.total_stock ? parseInt(p.total_stock, 10) > 0 : (parseInt(p.stock, 10) > 0))

      return matchesSearch && matchesCategory && matchesMin && matchesMax && matchesStock
    })
    .sort((a, b) => {
      const priceA = a.discount_price && parseFloat(a.discount_price) > 0 ? Math.max(0, parseFloat(a.sale_price) - parseFloat(a.discount_price)) : parseFloat(a.sale_price)
      const priceB = b.discount_price && parseFloat(b.discount_price) > 0 ? Math.max(0, parseFloat(b.sale_price) - parseFloat(b.discount_price)) : parseFloat(b.sale_price)

      if (sortBy === 'price-low') return priceA - priceB
      if (sortBy === 'price-high') return priceB - priceA
      if (sortBy === 'name-az') return a.name.localeCompare(b.name)
      return b.product_id - a.product_id // newest first
    })

  // Slicing products for current page
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
          <span className="text-slate-700">All Products</span>
          {activeParentCat && (
            <>
              <BiChevronRight />
              <span className="text-slate-700">{activeParentCat.category}</span>
            </>
          )}
          {activeSubCat && (
            <>
              <BiChevronRight />
              <button 
                onClick={() => setSelectedCategoryId(activeParentOfSub.id)} 
                className="hover:text-slate-600 transition font-semibold"
              >
                {activeParentOfSub.category}
              </button>
              <BiChevronRight />
              <span className="text-slate-700">{activeSubCat.name}</span>
            </>
          )}
        </div>

        {/* Hero Section */}
        <div 
          className="relative rounded-3xl p-8 md:p-10 shadow-sm border border-slate-100 flex flex-col gap-2 min-h-[120px] justify-center"
          style={{
            background: `linear-gradient(135deg, ${themeColor}1a, ${themeColor}05)`,
            borderLeft: `5px solid ${themeColor}`
          }}
        >
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            {activeParentCat?.category || activeSubCat?.name || 'All Products Catalog'}
          </h1>
          <p className="text-slate-500 text-xs max-w-xl">
            Explore our curated collections of high-quality premium products at unmatched value prices.
          </p>
        </div>

        {/* Filters and Product Catalog Container */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters */}
          <div className="flex flex-col gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm self-start lg:sticky lg:top-24">
            
            {/* Header */}
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
              <BiFilterAlt className="text-emerald-600 text-base" /> Filters
            </h3>

            {/* Keyword Search */}
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

            {/* In Stock Only Checkbox */}
            <div className="flex items-center gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
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

            {/* Category Hierarchy Filters */}
            <div className="flex flex-col gap-2 border-t border-slate-100 pt-4">
              <label className="text-xs font-bold text-slate-500 flex items-center justify-between">
                <span>Categories</span>
                {selectedCategoryId && (
                  <button 
                    onClick={() => setSelectedCategoryId(null)}
                    className="text-[10px] text-emerald-600 hover:text-emerald-500 font-bold uppercase transition"
                  >
                    Clear
                  </button>
                )}
              </label>
              
              <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategoryId(null)}
                  className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                    selectedCategoryId === null 
                      ? 'bg-slate-900 text-white font-bold' 
                      : 'text-slate-650 hover:bg-slate-50'
                  }`}
                >
                  All Categories
                </button>

                {categories.map((parent) => {
                  const isParentActive = selectedCategoryId === parent.id
                  const isChildActive = parent.subcategory?.some(sub => sub.id === selectedCategoryId)
                  const showSubcategories = isParentActive || isChildActive

                  return (
                    <div key={parent.id} className="flex flex-col">
                      <button
                        onClick={() => setSelectedCategoryId(parent.id)}
                        className={`w-full text-left px-3 py-1.5 text-xs font-semibold rounded-lg transition flex items-center justify-between gap-1.5 ${
                          isParentActive 
                            ? 'bg-slate-900 text-white font-bold' 
                            : isChildActive
                              ? 'bg-slate-100 text-slate-800 font-bold'
                              : 'text-slate-650 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{parent.category}</span>
                        {parent.subcategory?.length > 0 && (
                          <span className="text-[10px] opacity-60">
                            {showSubcategories ? '▼' : '▶'}
                          </span>
                        )}
                      </button>

                      {/* Nested Subcategories */}
                      {showSubcategories && parent.subcategory?.length > 0 && (
                        <div className="pl-4 border-l border-slate-200 ml-3.5 my-1 flex flex-col gap-0.5">
                          {parent.subcategory.map((sub) => {
                            const isSubActive = selectedCategoryId === sub.id
                            return (
                              <button
                                key={sub.id}
                                onClick={() => setSelectedCategoryId(sub.id)}
                                className={`w-full text-left px-2.5 py-1 text-xxs font-semibold rounded-md transition ${
                                  isSubActive 
                                    ? 'bg-slate-900 text-white font-bold' 
                                    : 'text-slate-550 hover:bg-slate-50'
                                }`}
                              >
                                {sub.name}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Clear All Filters */}
            {(searchTerm || minPrice || maxPrice || inStockOnly || selectedCategoryId) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setMinPrice('')
                  setMaxPrice('')
                  setInStockOnly(false)
                  setSelectedCategoryId(null)
                }}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer text-center"
              >
                Clear Filters
              </button>
            )}

          </div>

          {/* Products Grid & Pagination */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-slate-500">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
              </span>
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="w-full bg-white rounded-3xl border border-slate-100 p-16 text-center shadow-sm flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-350 text-4xl">
                  <BiCategory />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">No products found</h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                    Try adjusting your filters, price range criteria, or categories to locate products.
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
                      
                      // Show limited page numbers to keep it clean (e.g. only show current and sibling page selectors if totalPages is large)
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
