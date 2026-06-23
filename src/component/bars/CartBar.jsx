'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import { BiCart, BiTrash } from 'react-icons/bi'
import { FiX } from 'react-icons/fi'
import Link from 'next/link'

const CartBar = () => {
    const { cartbar, setCartbar, cart, increaseCartQty, decreaseCartQty, removeFromCart, clearCart } = useContext(Context)

    const subtotal = cart?.items ? cart.items.reduce((acc, item) => {
        const itemPrice = parseFloat(item.sale_price) - parseFloat(item.discount_price || 0)
        return acc + (itemPrice * item.quantity)
    }, 0) : 0

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${cartbar ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setCartbar(false)}
            />

            <div
                className={`fixed top-0 right-0 h-screen w-full sm:max-w-md bg-slate-900 border-l border-slate-800 text-white z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${cartbar ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <BiCart className="text-red-500 text-xl" /> Shopping Cart
                    </h2>
                    <div className="flex items-center gap-2">
                        {cart?.items.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 rounded transition cursor-pointer"
                            >
                                Clear All
                            </button>
                        )}
                        <button
                            onClick={() => setCartbar(false)}
                            className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white"
                        >
                            <FiX className="text-xl" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {cart?.items && cart.items.length > 0 ? (
                        cart.items.map((item, index) => {
                            const finalPrice = parseFloat(item.sale_price) - parseFloat(item.discount_price || 0)
                            return (
                                <div key={`${item.product_id}-${item.variant || 'base'}`} className="flex items-center gap-3 bg-slate-950/30 p-3 rounded-xl border border-slate-800/40">
                                    <img 
                                        src={item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150'} 
                                        alt={item.name} 
                                        className="w-12 h-12 object-cover rounded-lg border border-slate-800 shrink-0"
                                    />
                                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                        <Link 
                                            href={`/products/${item.slug}`} 
                                            onClick={() => setCartbar(false)}
                                            className="text-xs font-bold text-slate-200 hover:text-red-500 transition line-clamp-1"
                                        >
                                            {item.name}
                                        </Link>
                                        {item.variant && (
                                            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wide">
                                                Option: {item.variant}
                                            </span>
                                        )}
                                        <div className="flex items-baseline gap-1.5 mt-0.5">
                                            <span className="text-xs font-bold text-slate-200">
                                                ৳{finalPrice.toFixed(2)}
                                            </span>
                                            {parseFloat(item.discount_price) > 0 && (
                                                <span className="text-[9px] text-slate-500 line-through">
                                                    ৳{parseFloat(item.sale_price).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Edit controls */}
                                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 shrink-0">
                                        <button
                                            onClick={() => decreaseCartQty(item.product_id, item.variant)}
                                            className="w-6 h-6 flex items-center justify-center font-black text-xs text-slate-400 hover:text-white hover:bg-slate-850 rounded transition cursor-pointer"
                                        >
                                            -
                                        </button>
                                        <span className="w-5 text-center text-xxs font-black text-slate-200 select-none">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => increaseCartQty(item.product_id, item.variant)}
                                            className="w-6 h-6 flex items-center justify-center font-black text-xs text-slate-400 hover:text-white hover:bg-slate-850 rounded transition cursor-pointer"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => removeFromCart(item.product_id, item.variant)}
                                        className="p-1.5 hover:bg-rose-950/20 text-slate-500 hover:text-red-500 rounded-lg transition shrink-0 cursor-pointer"
                                        title="Remove"
                                    >
                                        <BiTrash className="text-sm" />
                                    </button>
                                </div>
                            )
                        })
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-12">
                            <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 text-3xl">
                                <BiCart />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-200">Your cart is empty</h3>
                                <p className="text-sm text-slate-450 mt-1">Looks like you haven't added anything to your cart yet.</p>
                            </div>
                            <Link href={'/products'}
                                onClick={() => setCartbar(false)}
                                className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    )}
                </div>

                {cart?.items && cart.items.length > 0 && (
                    <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                        <div className="flex justify-between text-sm font-medium text-slate-350 mb-4">
                            <span>Subtotal</span>
                            <span className="font-bold text-white text-base">৳{subtotal.toFixed(2)}</span>
                        </div>

                        <Link href={'/checkout'}
                            onClick={() => setCartbar(false)}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors text-center block cursor-pointer"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    )
}

export default CartBar