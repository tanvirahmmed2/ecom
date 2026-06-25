'use client'
import React, { useContext, useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Context } from '../helper/Context'
import { BiShoppingBag, BiPurchaseTagAlt, BiTrendingUp } from 'react-icons/bi'

const FALLBACK_PRODUCTS = [
  {
    product_id: 1,
    name: 'Premium Designer Handbag',
    sale_price: 129.99,
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80',
    slug: 'designer-handbag'
  },
  {
    product_id: 2,
    name: 'Classic Casual Wear',
    sale_price: 79.99,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=80',
    slug: 'casual-wear'
  },
  {
    product_id: 3,
    name: 'Luxury Minimal Watch',
    sale_price: 249.99,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80',
    slug: 'minimal-watch'
  }
]

const Hero = () => {
  const { website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'
  const tagline = website?.tagline || 'Your premium shopping experience'
  const heroTitle = website?.hero_title || 'Discover Premium Quality Products'
  const heroSubtitle = website?.hero_subtitle || 'Shop our exclusive range of handpicked quality products at unbeatable prices.'

  const [products, setProducts] = useState(FALLBACK_PRODUCTS)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Fetch active products, filter for on-sale items, shuffle and select top products
  useEffect(() => {
    const fetchTopSalesProducts = async () => {
      try {
        const res = await axios.get('/api/product')
        const allProducts = res.data.filter(p => p.is_active !== false && p.image)

        // Filter for products on sale (having positive discount price)
        let saleProducts = allProducts.filter(p => p.discount_price && parseFloat(p.discount_price) > 0)

        // Fallback to all active products if no specific sale items
        if (saleProducts.length === 0) {
          saleProducts = allProducts
        }

        // Shuffle randomly
        const shuffled = saleProducts.sort(() => 0.5 - Math.random())
        const selected = shuffled.slice(0, 6)

        if (selected.length > 0) {
          setProducts(selected)
        }
      } catch (err) {
        console.error("Failed to load hero products", err)
      }
    }
    fetchTopSalesProducts()
  }, [])

  // Auto slide timer
  useEffect(() => {
    if (products.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [products])

  const activeProduct = products[currentSlide] || FALLBACK_PRODUCTS[0]

  return (
    <div className="relative w-full min-h-[85vh] flex items-center overflow-hidden bg-slate-950 px-6 py-20 md:py-28">

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Ambient background blur glows */}
      <div
        className="absolute top-1/4 left-[-10%] w-[400px] h-[400px] rounded-full blur-[130px] opacity-15 pointer-events-none z-0"
        style={{ backgroundColor: themeColor }}
      />
      <div
        className="absolute bottom-1/4 right-[-10%] w-[500px] h-[500px] rounded-full blur-[140px] opacity-10 pointer-events-none z-0"
        style={{ backgroundColor: themeColor }}
      />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center relative z-10">

        {/* Left Column: Core Text Contents */}
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-6 animate-fade-in order-2 lg:order-1">

          {/* Tagline Badge */}
          <span
            className="px-4 py-1.5 text-[10px] md:text-xs font-black uppercase tracking-wider rounded-full border bg-white/5 backdrop-blur-md shadow-inner select-none flex items-center gap-2"
            style={{ borderColor: `${themeColor}40`, color: themeColor }}
          >
            <BiTrendingUp className="text-sm" />
            <span>{tagline}</span>
          </span>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-2xl">
            {heroTitle.split(' ').map((word, i) => {
              // Highlight selected keywords
              if (i === 1 || i === 2) {
                return (
                  <span
                    key={i}
                    className="bg-clip-text text-transparent bg-gradient-to-r"
                    style={{ backgroundImage: `linear-gradient(to right, ${themeColor}, #ffffff)` }}
                  >
                    {word}{' '}
                  </span>
                )
              }
              return word + ' ';
            })}
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed font-medium">
            {heroSubtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mt-2 w-full sm:w-auto">
            <Link
              href="/products"
              className="px-8 py-4 text-white font-bold text-sm rounded-2xl shadow-lg hover:scale-[1.03] active:scale-[0.97] transition-all flex items-center justify-center gap-2 cursor-pointer"
              style={{ backgroundColor: themeColor, boxShadow: `0 10px 30px -5px ${themeColor}40` }}
            >
              <BiShoppingBag className="text-lg" /> Explore Catalog
            </Link>
            <Link
              href="/offers"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-md hover:scale-[1.03] active:scale-[0.97]"
            >
              <BiPurchaseTagAlt className="text-lg" /> View Offers
            </Link>
          </div>

        </div>

        {/* Right Column: Sliding Portrait Frame */}
        <div className="lg:col-span-5 flex justify-center relative order-1 lg:order-2">

          {/* Glow backdrop specifically for the slider frame */}
          <div
            className="absolute -inset-4 rounded-[2.5rem] blur-[80px] opacity-25 pointer-events-none z-0 transition-colors duration-1000"
            style={{ backgroundColor: themeColor }}
          />

          <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-[2rem] overflow-hidden border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-slate-900 z-10 group">
            {/* Slide Images */}
            {products.map((item, idx) => (
              <img
                key={idx}
                src={item.image}
                alt={item.name}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1200ms] ease-in-out select-none pointer-events-none ${idx === currentSlide ? 'opacity-90 scale-100' : 'opacity-0 scale-105'
                  }`}
              />
            ))}

            {/* Gradient shadow overlay for the slide footer */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent z-10" />

            {/* Floating Info overlay card */}
            {activeProduct && (
              <Link
                href={`/products/${activeProduct.slug}`}
                className="absolute bottom-4 left-4 right-4 bg-slate-900/85 backdrop-blur-md border border-white/10 p-3 rounded-2xl flex items-center justify-between z-20 hover:border-white/25 transition duration-300"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-[9px] uppercase tracking-wider font-extrabold" style={{ color: themeColor }}>Featured</span>
                  <h4 className="text-xs font-bold text-white truncate">{activeProduct.name}</h4>
                </div>
                <span className="text-[11px] font-black text-white px-2.5 py-1.5 rounded-xl shrink-0 flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                  ৳{parseFloat(activeProduct.sale_price).toFixed(2)}
                </span>
              </Link>
            )}
          </div>

          {/* Background decorative shape */}
          <div className="absolute -bottom-8 -left-8 w-24 h-24 border-l-2 border-b-2 border-white/10 rounded-bl-[1.5rem] pointer-events-none z-0" />
          <div className="absolute -top-8 -right-8 w-24 h-24 border-r-2 border-t-2 border-white/10 rounded-tr-[1.5rem] pointer-events-none z-0" />

        </div>

      </div>

    </div>
  )
}

export default Hero