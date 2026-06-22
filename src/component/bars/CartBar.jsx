'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import { BiCart } from 'react-icons/bi'
import { FiX } from 'react-icons/fi'
import Link from 'next/link'

const CartBar = () => {
    const { cartbar, setCartbar, cart, setCart } = useContext(Context)

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
                    <button
                        onClick={() => setCartbar(false)}
                        className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-slate-400 hover:text-white"
                    >
                        <FiX className="text-xl" />
                    </button>
                </div>

                {
                    cart?.items.length > 0 ? <div>
                        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
                            <div className="flex justify-between text-sm font-medium text-slate-300 mb-4">
                                <span>Subtotal</span>
                                <span>$0.00</span>
                            </div>

                            <Link href={'/'}
                                disabled
                                className="w-full py-3 bg-slate-800 text-slate-500 rounded-xl font-bold text-sm cursor-not-allowed transition-colors"
                            >
                                Checkout
                            </Link>
                        </div>
                    </div> : <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-slate-400 text-3xl">
                            <BiCart />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-200">Your cart is empty</h3>
                            <p className="text-sm text-slate-400 mt-1">Looks like you haven't added anything to your cart yet.</p>
                        </div>
                        <Link href={'/products'}
                            onClick={() => setCartbar(false)}
                            className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                        >
                            Continue Shopping
                        </Link>
                    </div>

                }


            </div>
        </>
    )
}

export default CartBar