'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { BiUpload, BiChevronLeft, BiLoaderAlt, BiPlus, BiTrash } from 'react-icons/bi'

export default function ProductForm({ initialData, onSubmit, loading }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [brandId, setBrandId] = useState('')
  
  const [purchasePrice, setPurchasePrice] = useState(0)
  const [salePrice, setSalePrice] = useState(0)
  const [discountPrice, setDiscountPrice] = useState(0)
  const [wholesalePrice, setWholesalePrice] = useState(0)
  const [dealerPrice, setDealerPrice] = useState(0)
  const [retailPrice, setRetailPrice] = useState(0)

  const [unit, setUnit] = useState('')
  const [barcode, setBarcode] = useState('')
  const [isActive, setIsActive] = useState(true)
  
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  // Variants list state
  const [variants, setVariants] = useState([])
  const [newVarName, setNewVarName] = useState('')
  const [newVarPrice, setNewVarPrice] = useState(0)
  const [newVarStock, setNewVarStock] = useState(0)

  // Options lists
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [fetchingOptions, setFetchingOptions] = useState(true)

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '')
      setDescription(initialData.description || '')
      setCategoryId(initialData.category_id || '')
      setBrandId(initialData.brand_id || '')
      setPurchasePrice(initialData.purchase_price || 0)
      setSalePrice(initialData.sale_price || 0)
      setDiscountPrice(initialData.discount_price || 0)
      setWholesalePrice(initialData.wholesale_price || 0)
      setDealerPrice(initialData.dealer_price || 0)
      setRetailPrice(initialData.retail_price || 0)
      setUnit(initialData.unit || '')
      setBarcode(initialData.barcode || '')
      setIsActive(initialData.is_active !== false)
      setImagePreview(initialData.image || '')
      setVariants(initialData.variants || [])
    }
  }, [initialData])

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, brandRes] = await Promise.all([
          axios.get('/api/category'),
          axios.get('/api/brand')
        ])
        setCategories(catRes.data)
        setBrands(brandRes.data)
      } catch (err) {
        console.error('Failed to load category/brand selections:', err)
      } finally {
        setFetchingOptions(false)
      }
    }
    fetchOptions()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const addVariant = () => {
    if (!newVarName) return
    setVariants([...variants, {
      variant_name: newVarName,
      price: parseFloat(newVarPrice) || 0,
      stock: parseInt(newVarStock, 10) || 0
    }])
    setNewVarName('')
    setNewVarPrice(0)
    setNewVarStock(0)
  }

  const removeVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('name', name)
    formData.append('description', description)
    formData.append('category_id', categoryId)
    formData.append('brand_id', brandId)
    formData.append('purchase_price', purchasePrice)
    formData.append('sale_price', salePrice)
    formData.append('discount_price', discountPrice)
    formData.append('wholesale_price', wholesalePrice)
    formData.append('dealer_price', dealerPrice)
    formData.append('retail_price', retailPrice)
    formData.append('unit', unit)
    formData.append('barcode', barcode)
    formData.append('is_active', isActive)
    formData.append('variants', JSON.stringify(variants))
    
    if (image) {
      formData.append('image', image)
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 flex flex-col gap-8 animate-fade-in">
      
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
        <Link href="/dashboard/manager/product" className="p-2 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-xl transition">
          <BiChevronLeft className="text-xl" />
        </Link>
        <div>
          <h2 className="font-bold text-slate-800 text-lg">
            {initialData ? 'Update Product Details' : 'Add New Product to Store'}
          </h2>
          <p className="text-slate-500 text-xs mt-0.5">
            {initialData ? 'Modify properties, pricing, and variant options.' : 'Publish a new item asset into active inventories.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Basic Information */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Basic Information</h3>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Product Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Ultra Wireless Headphones"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea
              placeholder="Provide a detailed product description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Category *</label>
              <select
                required
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={fetchingOptions}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition disabled:opacity-50"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.parent_name ? `${cat.parent_name} > ` : ''}{cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Brand *</label>
              <select
                required
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
                disabled={fetchingOptions}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition disabled:opacity-50"
              >
                <option value="">Select Brand</option>
                {brands.map((br) => (
                  <option key={br.brand_id} value={br.brand_id}>
                    {br.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Image Asset upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Product Main Image *</label>
            <div className="flex flex-col md:flex-row items-center gap-4">
              {imagePreview && (
                <div className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition cursor-pointer text-slate-500 hover:text-slate-700">
                <BiUpload className="text-2xl mb-1.5" />
                <span className="text-sm font-medium">Click to upload file</span>
                <span className="text-xs text-slate-400 mt-0.5">PNG, JPG, JPEG up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  required={!initialData}
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Inventory */}
        <div className="flex flex-col gap-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Pricing Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Purchase Price</label>
              <input
                type="number"
                step="0.01"
                required
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Sale Price</label>
              <input
                type="number"
                step="0.01"
                required
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Discount Price</label>
              <input
                type="number"
                step="0.01"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Wholesale Price</label>
              <input
                type="number"
                step="0.01"
                value={wholesalePrice}
                onChange={(e) => setWholesalePrice(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Dealer Price</label>
              <input
                type="number"
                step="0.01"
                value={dealerPrice}
                onChange={(e) => setDealerPrice(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Retail Price</label>
              <input
                type="number"
                step="0.01"
                value={retailPrice}
                onChange={(e) => setRetailPrice(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              />
            </div>
          </div>

          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mt-4">Inventory Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Unit</label>
              <select
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              >
                <option value="">Select Unit</option>
                <option value="Pcs">Pcs</option>
                <option value="Litter">Litter</option>
                <option value="Kg">Kg</option>
                <option value="Bottle">Bottle</option>
                <option value="Box">Box</option>
                <option value="Pack">Pack</option>
                <option value="Gram">Gram</option>
                <option value="Ml">Ml</option>
                <option value="Dozen">Dozen</option>
                <option value="Meter">Meter</option>
                <option value="Roll">Roll</option>
                <option value="Set">Set</option>
                <option value="Bag">Bag</option>
                <option value="Can">Can</option>
                <option value="Pair">Pair</option>
                <option value="Tube">Tube</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Barcode</label>
              <input
                type="text"
                placeholder="UPC-A/EAN barcode"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
              />
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200/60 mt-2">
            <div>
              <label className="text-sm font-semibold text-slate-800">Is Product Active?</label>
              <p className="text-xs text-slate-500 mt-0.5">Toggle product listing visibility on client storefronts.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-none ${
                isActive ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

        </div>
      </div>

      {/* Section: Product Variants */}
      <div className="border-t border-slate-100 pt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Product Variants</h3>
        
        {/* Form to add a new variant */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row items-end gap-4 mb-6">
          <div className="flex-1 w-full flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">Variant Name</label>
            <input
              type="text"
              placeholder="e.g. Red - XL or Blue - M"
              value={newVarName}
              onChange={(e) => setNewVarName(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>
          <div className="w-full md:w-32 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">Variant Price</label>
            <input
              type="number"
              step="0.01"
              value={newVarPrice}
              onChange={(e) => setNewVarPrice(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>
          <div className="w-full md:w-32 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-slate-600">Initial Stock</label>
            <input
              type="number"
              value={newVarStock}
              onChange={(e) => setNewVarStock(e.target.value)}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-800 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>
          <button
            type="button"
            onClick={addVariant}
            className="w-full md:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-1 shrink-0"
          >
            <BiPlus className="text-lg" /> Add
          </button>
        </div>

        {/* Existing variants list */}
        {variants.length > 0 ? (
          <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3">Variant Option</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {variants.map((v, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 font-medium">{v.variant_name}</td>
                    <td className="px-4 py-3">${v.price.toFixed(2)}</td>
                    <td className="px-4 py-3">{v.stock} pcs</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-rose-600 rounded-lg transition"
                      >
                        <BiTrash className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
            No variants created. This product will rely strictly on the primary price tier.
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
        <Link
          href="/dashboard/manager/product"
          className="px-5 py-2 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-500 transition cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-sm shadow-emerald-600/10"
        >
          {loading ? (
            <>
              <BiLoaderAlt className="animate-spin text-lg" />
              Saving...
            </>
          ) : (
            initialData ? 'Save Changes' : 'Create Product'
          )}
        </button>
      </div>

    </form>
  )
}
