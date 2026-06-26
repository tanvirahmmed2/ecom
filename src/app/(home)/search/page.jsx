'use client'
import React, { Suspense, useState, useEffect, useContext } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import ProductCard from '@/component/cards/Product'
import { BiLoaderAlt, BiSearch } from 'react-icons/bi'

function SearchResultsContent() {
    const searchParams = useSearchParams()
    const queryStr = searchParams.get('v') || ''

    const { website } = useContext(Context)
    const themeColor = website?.theme_color || '#10b981'

    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const res = await axios.get('/api/product')
                // Filter active products
                const activeProducts = res.data.filter(p => p.is_active !== false)
                
                // Filter matching query
                const filtered = activeProducts.filter(p => {
                    const term = queryStr.toLowerCase()
                    return p.name.toLowerCase().includes(term) ||
                        (p.description && p.description.toLowerCase().includes(term)) ||
                        (p.category_name && p.category_name.toLowerCase().includes(term)) ||
                        (p.brand_name && p.brand_name.toLowerCase().includes(term))
                })
                setProducts(filtered)
            } catch (err) {
                console.error('Failed to search products:', err)
                toast.error('Failed to load search results')
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [queryStr])

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-16 min-h-[60vh]">
            <div className="mb-8 border-b border-slate-100 pb-5">
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                    <BiSearch style={{ color: themeColor }} />
                    Search Results
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                    {loading ? (
                        <span>Searching for "{queryStr}"...</span>
                    ) : (
                        <span>Found {products.length} {products.length === 1 ? 'product' : 'products'} for "{queryStr}"</span>
                    )}
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <BiLoaderAlt className="animate-spin text-4xl" style={{ color: themeColor }} />
                    <p className="text-slate-400 font-medium">Searching catalog...</p>
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map(product => (
                        <ProductCard key={product.product_id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                    <BiSearch className="text-6xl text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-800">No matches found</h3>
                    <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
                        We couldn't find any products matching your search term. Try checking your spelling or using more general keywords.
                    </p>
                    <div className="mt-6">
                        <a 
                            href="/products" 
                            style={{ backgroundColor: themeColor }}
                            className="inline-flex items-center justify-center px-6 py-2.5 rounded-full text-white font-bold text-sm shadow-md hover:brightness-95 transition"
                        >
                            Browse All Products
                        </a>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center py-40 gap-3">
                <BiLoaderAlt className="animate-spin text-4xl text-slate-300" />
                <p className="text-slate-400 font-medium">Loading search parameters...</p>
            </div>
        }>
            <SearchResultsContent />
        </Suspense>
    )
}
