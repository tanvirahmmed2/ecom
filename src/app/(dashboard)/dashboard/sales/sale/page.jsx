'use client'
import React, { useState, useEffect, useContext, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Context } from '@/component/helper/Context'
import { 
  BiSearch, 
  BiTrash, 
  BiPlus, 
  BiMinus, 
  BiLoaderAlt, 
  BiUser, 
  BiPhone, 
  BiCart, 
  BiReceipt, 
  BiBarcode, 
  BiPrinter, 
  BiShieldQuarter,
  BiRefresh
} from 'react-icons/bi'

export default function POSPageClean() {
  const router = useRouter()
  const { user, loading: userLoading, dashSidebar, website } = useContext(Context)
  const themeColor = website?.theme_color || '#0f172a' // fallback to slate-900

  // POS State
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [barcodeSearch, setBarcodeSearch] = useState('')
  
  // Cart & checkout
  const [cart, setCart] = useState([])
  const [discount, setDiscount] = useState(0)
  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const [paymentType, setPaymentType] = useState('cash')
  const [amountReceived, setAmountReceived] = useState('')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Customer State
  const [customerPhone, setCustomerPhone] = useState('')

  // Variant selector
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [productVariants, setProductVariants] = useState([])
  const [loadingVariants, setLoadingVariants] = useState(false)

  const barcodeInputRef = useRef(null)

  // Fetch products & categories
  const fetchData = async () => {
    setLoading(true)
    try {
      const [prodRes, catRes] = await Promise.all([
        axios.get('/api/product'),
        axios.get('/api/category')
      ])
      setProducts(prodRes.data.filter(p => p.is_active !== false))
      setCategories(catRes.data)
    } catch (err) {
      console.error(err)
      toast.error('Failed to load catalog data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user && ['admin', 'manager', 'sales'].includes(user.role)) {
      fetchData()
    }
  }, [user])



  // Handle barcode submit
  const handleBarcodeSubmit = (e) => {
    e.preventDefault()
    if (!barcodeSearch.trim()) return

    const cleanBarcode = barcodeSearch.trim()
    const product = products.find(p => p.barcode === cleanBarcode)

    if (product) {
      triggerAddProduct(product)
      toast.success(`Scanned: ${product.name}`)
      setBarcodeSearch('')
      barcodeInputRef.current?.focus()
    } else {
      toast.error(`No product found with barcode: ${cleanBarcode}`)
    }
  }

  // Handle adding product
  const triggerAddProduct = async (product) => {
    const availStock = product.total_stock !== undefined ? parseInt(product.total_stock, 10) : parseInt(product.stock, 10)
    if (availStock <= 0) {
      toast.error('Out of stock')
      return
    }

    setLoadingVariants(true)
    try {
      const res = await axios.get(`/api/product/${product.slug}`)
      const fetchedVariants = res.data.variants || []
      
      if (fetchedVariants.length > 0) {
        setProductVariants(fetchedVariants)
        setSelectedProduct(product)
      } else {
        addToPOSCart(product, null)
      }
    } catch (err) {
      console.error(err)
      addToPOSCart(product, null)
    } finally {
      setLoadingVariants(false)
    }
  }

  const addToPOSCart = (product, variant = null) => {
    const key = variant ? `${product.product_id}-${variant.variant_id}` : `${product.product_id}-base`
    const existingIndex = cart.findIndex(item => item.cartKey === key)
    const maxStock = variant ? parseInt(variant.stock, 10) : parseInt(product.stock, 10)

    const basePrice = parseFloat(product.sale_price)
    const variantPrice = variant ? parseFloat(variant.price) : 0
    const discountAmt = parseFloat(product.discount_price || 0)
    const finalPrice = Math.max(0, (basePrice + variantPrice) - discountAmt)

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity
      if (currentQty >= maxStock) {
        toast.error(`Only ${maxStock} in stock`)
        return
      }
      const updatedCart = [...cart]
      updatedCart[existingIndex].quantity += 1
      setCart(updatedCart)
    } else {
      if (maxStock <= 0) {
        toast.error('Variant out of stock')
        return
      }
      setCart([
        ...cart,
        {
          cartKey: key,
          product_id: product.product_id,
          variant_id: variant ? variant.variant_id : null,
          name: product.name,
          variant_name: variant ? variant.variant_name : '',
          price: finalPrice,
          quantity: 1,
          maxStock: maxStock,
          image: product.image
        }
      ])
    }
  }

  const updateQty = (key, val) => {
    const updated = cart.map(item => {
      if (item.cartKey === key) {
        return { ...item, quantity: Math.max(1, Math.min(item.maxStock, val)) }
      }
      return item
    })
    setCart(updated)
  }

  const removeCartItem = (key) => {
    setCart(cart.filter(item => item.cartKey !== key))
  }

  // Calculation details
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discountVal = parseFloat(discount) || 0
  const deliveryChargeVal = parseFloat(deliveryCharge) || 0
  const totalAmount = Math.max(0, subtotal + deliveryChargeVal - discountVal)
  const receivedVal = parseFloat(amountReceived) || 0
  const changeAmount = paymentType === 'cash' && receivedVal > totalAmount ? receivedVal - totalAmount : 0

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'all' || p.category_id === parseInt(activeCategory, 10) || p.category_slug === activeCategory
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.barcode && p.barcode.includes(searchTerm))
    return matchesCategory && matchesSearch
  })

  // Submit checkout
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty')
      return
    }
    if (!customerPhone.trim()) {
      toast.error('Customer phone number is required')
      return
    }
    if (paymentType === 'cash' && receivedVal < totalAmount) {
      toast.error('Amount received is less than total amount')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        phone: customerPhone,
        note: note,
        is_pos: true,
        payment_type: paymentType,
        amount_received: paymentType === 'cash' ? receivedVal : totalAmount,
        change_amount: changeAmount,
        items: cart.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity
        }))
      }

      const res = await axios.post('/api/sale', payload)
      toast.success('Sale Completed!')

      // Reset fields
      setCart([])
      setDiscount(0)
      setDeliveryCharge(0)
      setAmountReceived('')
      setNote('')
      setCustomerPhone('')

      // Redirect to dynamic order details page
      router.push(`/dashboard/sales/sale/${res.data.order_id}`)

    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || 'POS sale checkout failed')
    } finally {
      setSubmitting(false)
    }
  }



  if (userLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-white">
        <BiLoaderAlt className="animate-spin text-2xl text-slate-800" />
      </div>
    )
  }

  const isSales = user && ['admin', 'manager', 'sales'].includes(user.role)
  if (!isSales) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-sm bg-white rounded-xl border border-slate-100 p-8 text-center flex flex-col gap-4">
          <BiShieldQuarter className="text-4xl text-rose-500 mx-auto" />
          <h1 className="text-xl font-bold text-slate-800">Access Denied</h1>
          <p className="text-slate-400 text-xs">Sales desk privileges required.</p>
          <Link href="/login" className="px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-850 transition">
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`w-full min-h-screen bg-slate-50/50 pt-20 pb-12 px-4 md:px-6 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        {/* Simple Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Sales Desk Console</h1>
            <p className="text-slate-450 text-xs">Logged in as {user.name}</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Minimal Barcode scan input */}
            <form onSubmit={handleBarcodeSubmit} className="flex items-center border border-slate-200 bg-white rounded-lg px-2.5 py-1">
              <BiBarcode className="text-slate-400 mr-2 text-base" />
              <input
                ref={barcodeInputRef}
                type="text"
                placeholder="Scan Barcode..."
                value={barcodeSearch}
                onChange={(e) => setBarcodeSearch(e.target.value)}
                className="text-xs bg-transparent focus:outline-none w-32 font-medium"
              />
              <button type="submit" className="hidden">Submit</button>
            </form>

            <button
              onClick={fetchData}
              disabled={loading}
              className="p-1.5 border border-slate-200 hover:bg-slate-100 bg-white rounded-lg text-slate-500 transition cursor-pointer"
            >
              <BiRefresh className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: POS checkout panel (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6 sticky top-24">
            
            {/* Customer assigning block */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-3 relative">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1.5">Assign Customer</span>

              {/* Phone search input */}
              <div className="relative">
                <BiPhone className="absolute left-2.5 top-2.5 text-slate-400 text-sm" />
                <input
                  type="text"
                  placeholder="Enter Customer Phone Number..."
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-slate-350 bg-slate-50/50 text-slate-800"
                />
              </div>

            </div>

            {/* POS cart items block */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-4 min-h-[250px]">
              <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Checkout Cart</span>
                {cart.length > 0 && (
                  <button
                    onClick={() => {
                      setCart([])
                      setDiscount(0)
                      setDeliveryCharge(0)
                      setAmountReceived('')
                      setNote('')
                      setCustomerPhone('')
                      toast.success('Cart cleared')
                    }}
                    className="text-[9px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-wider cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {cart.length > 0 ? (
                <div className="flex flex-col gap-2.5 overflow-y-auto max-h-72 pr-1 scrollbar-thin">
                  {cart.map((item) => (
                    <div 
                      key={item.cartKey}
                      className="group flex items-center gap-3 bg-white border border-slate-100 hover:border-slate-200/80 hover:shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] rounded-xl p-2 transition-all duration-200"
                    >
                      {/* Product Image Container */}
                      <div className="w-11 h-11 rounded-lg border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden relative">
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150'} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <h4 className="font-semibold text-slate-805 text-xs truncate leading-tight hover:text-slate-900 transition-colors" title={item.name}>
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.variant_name && (
                            <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1 py-0.5 rounded leading-none">
                              {item.variant_name}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono">৳{item.price.toFixed(2)} each</span>
                        </div>
                      </div>

                      {/* Quantity select */}
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 shrink-0">
                        <button
                          onClick={() => updateQty(item.cartKey, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-white hover:shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-slate-500 hover:text-slate-800 transition cursor-pointer"
                        >
                          <BiMinus className="text-[10px]" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQty(item.cartKey, parseInt(e.target.value, 10) || 1)}
                          className="w-6 text-center text-[10px] font-bold focus:outline-none bg-transparent text-slate-800 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button
                          onClick={() => updateQty(item.cartKey, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-white hover:shadow-[0_1px_3px_rgba(0,0,0,0.05)] text-slate-500 hover:text-slate-800 transition cursor-pointer"
                        >
                          <BiPlus className="text-[10px]" />
                        </button>
                      </div>

                      {/* Total Price & Delete Trigger */}
                      <div className="text-right shrink-0 min-w-[70px] flex flex-col items-end gap-1">
                        <span className="text-xs font-bold text-slate-900 block font-mono">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeCartItem(item.cartKey)}
                          className="flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-rose-600 transition-colors cursor-pointer group/delete"
                        >
                          <BiTrash className="text-[10px] group-hover/delete:scale-110 transition-transform" />
                          <span>Delete</span>
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-1 py-12">
                  <BiCart className="text-3xl text-slate-200" />
                  <span className="text-xxs font-bold text-slate-500">Cart is empty</span>
                </div>
              )}

              {/* Price summary */}
              <div className="border-t border-slate-100 pt-3.5 mt-auto flex flex-col gap-2.5">
                <div className="flex justify-between items-center text-xxs font-bold text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-slate-700">৳{subtotal.toFixed(2)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Discount (৳)</label>
                    <input
                      type="number"
                      min="0"
                      value={discount}
                      onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-xs font-semibold focus:outline-none font-mono bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Delivery (৳)</label>
                    <input
                      type="number"
                      min="0"
                      value={deliveryCharge}
                      onChange={(e) => setDeliveryCharge(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-2 py-1 border border-slate-200 rounded text-xs font-semibold focus:outline-none font-mono bg-white text-slate-800"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-1.5">
                  <span className="text-xs font-bold text-slate-800">Grand Total</span>
                  <span className="font-mono text-slate-900 font-extrabold text-base">৳{totalAmount.toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* Payment & Checkout Block */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col gap-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block border-b border-slate-100 pb-1.5">Payment Method</span>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cash', label: 'Cash' },
                  { id: 'card', label: 'Card' },
                  { id: 'mobile_banking', label: 'MFS' }
                ].map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setPaymentType(type.id)}
                    className={`py-1.5 border text-xxs font-bold rounded transition cursor-pointer ${
                      paymentType === type.id
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>

              {paymentType === 'cash' && (
                <div className="grid grid-cols-2 gap-3.5 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <div>
                    <label className="text-[9px] font-bold text-slate-450 block mb-1">Cash Received (৳)</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      className="w-full px-2.5 py-1 border border-slate-200 rounded text-xs font-semibold focus:outline-none focus:bg-white bg-white text-slate-900 font-mono"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[9px] font-bold text-slate-400 block mb-1">Change Return</span>
                    <span className="text-xs font-bold text-slate-900 font-mono">
                      ৳{changeAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[9px] font-bold text-slate-450 block mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="Sales order reference or note..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs font-medium focus:outline-none bg-white text-slate-800"
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={submitting || cart.length === 0}
                className="w-full py-2.5 text-white bg-slate-900 hover:bg-slate-850 text-xs font-bold rounded-lg transition disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                {submitting ? (
                  <>
                    <BiLoaderAlt className="animate-spin text-sm" /> Processing...
                  </>
                ) : (
                  <>
                    <BiReceipt className="text-sm" /> Complete Sale Checkout
                  </>
                )}
              </button>

            </div>

          </div>

          {/* RIGHT COLUMN: Products grid (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Search & Category Pills */}
            <div className="flex flex-col gap-3">
              <div className="relative">
                <BiSearch className="absolute left-3 top-2.5 text-slate-400 text-base" />
                <input
                  type="text"
                  placeholder="Search catalog by title, brand, or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 bg-white rounded-lg text-xs focus:outline-none focus:border-slate-350 transition text-slate-800"
                />
              </div>

              {/* Minimal category pills */}
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-3 py-1 text-xs font-semibold rounded-md border transition cursor-pointer ${
                    activeCategory === 'all'
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.category_id}
                    onClick={() => setActiveCategory(cat.category_id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md border transition cursor-pointer ${
                      activeCategory === cat.category_id
                        ? 'bg-slate-900 border-slate-900 text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Product items catalog */}
            {loading ? (
              <div className="h-84 flex flex-col items-center justify-center text-slate-400 gap-2 bg-white border border-slate-200 rounded-xl">
                <BiLoaderAlt className="animate-spin text-xl text-slate-900" />
                <span className="text-xs font-medium">Loading catalog...</span>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredProducts.map((p) => {
                  const price = parseFloat(p.sale_price)
                  const discountAmt = parseFloat(p.discount_price || 0)
                  const finalP = Math.max(0, price - discountAmt)
                  const isOutOfStock = (p.total_stock !== undefined ? parseInt(p.total_stock, 10) : parseInt(p.stock, 10)) <= 0

                  return (
                    <div 
                      key={p.product_id}
                      onClick={() => !isOutOfStock && triggerAddProduct(p)}
                      className={`bg-white border border-slate-200 hover:border-slate-400 rounded-lg p-3 flex flex-col justify-between gap-3 transition cursor-pointer select-none ${isOutOfStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex flex-col gap-2">
                        <div className="relative aspect-square w-full rounded-md overflow-hidden bg-slate-50 border border-slate-100 shrink-0">
                          <img 
                            src={p.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100'} 
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">{p.brand_name || 'General'}</span>
                          <h3 className="font-semibold text-slate-800 text-xxs mt-0.5 line-clamp-2 leading-tight">
                            {p.name}
                          </h3>
                        </div>
                      </div>

                      <div className="flex items-end justify-between gap-1 border-t border-slate-100 pt-2">
                        <div className="flex flex-col">
                          {discountAmt > 0 ? (
                            <>
                              <span className="text-xs font-bold text-slate-900">৳{finalP.toFixed(2)}</span>
                              <span className="text-[9px] text-slate-400 line-through">৳{price.toFixed(2)}</span>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-slate-900">৳{price.toFixed(2)}</span>
                          )}
                        </div>

                        {isOutOfStock ? (
                          <span className="text-[8px] font-bold text-rose-600 bg-rose-50 rounded px-1.5 py-0.5 border border-rose-100">
                            No Stock
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-500 bg-slate-50 rounded border border-slate-200 px-1.5 py-0.5 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition">
                            Add
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-80 flex flex-col items-center justify-center text-slate-400 gap-1.5 bg-white border border-slate-200 rounded-xl">
                <span className="text-xs font-bold text-slate-600">No matching products found</span>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* MODAL 1: Variant Selector */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/30 backdrop-blur-xxs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-sm w-full shadow-lg p-5 flex flex-col gap-4 animate-in fade-in duration-100">
            
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-bold text-slate-900 text-xs">{selectedProduct.name}</h3>
                <span className="text-[9px] text-slate-400 font-medium tracking-wide uppercase block mt-0.5">Select Variant</span>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-xs text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
              {productVariants.map((v) => {
                const vPrice = parseFloat(selectedProduct.sale_price) + parseFloat(v.price)
                const discountAmt = parseFloat(selectedProduct.discount_price || 0)
                const finalVPrice = Math.max(0, vPrice - discountAmt)
                const inStock = parseInt(v.stock, 10) > 0

                return (
                  <button
                    key={v.variant_id}
                    disabled={!inStock}
                    onClick={() => {
                      addToPOSCart(selectedProduct, v)
                      setSelectedProduct(null)
                    }}
                    className={`w-full py-2 px-3 border rounded text-left text-xs font-semibold transition flex items-center justify-between cursor-pointer ${
                      inStock 
                        ? 'border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-400' 
                        : 'border-slate-100 bg-slate-50 text-slate-450 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <span>{v.variant_name}</span>
                    <span className="text-xxs font-mono">
                      {inStock ? `৳${finalVPrice.toFixed(2)}` : 'Out of Stock'}
                    </span>
                  </button>
                )
              })}
            </div>

          </div>
        </div>
      )}



    </div>
  )
}
