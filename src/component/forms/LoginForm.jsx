'use client'
import Link from 'next/link'
import React, { useState, useContext } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '../helper/Context'
import { FiLock, FiMail } from 'react-icons/fi'

const LoginForm = () => {
    const router = useRouter()
    const { setUser } = useContext(Context)
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((data) => ({ ...data, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (submitting) return

        setSubmitting(true)
        const toastId = toast.loading('Logging in...')

        try {
            const response = await axios.post('/api/user/login', formData)
            toast.success(response.data.message || 'Logged in successfully!', { id: toastId })
            
            if (response.data.user) {
                setUser(response.data.user)
            }

            router.push('/')
            router.refresh()
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to login. Please try again.'
            toast.error(errorMessage, { id: toastId })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className='w-full flex flex-col items-center justify-center min-h-screen p-4 relative overflow-hidden'>
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full blur-[120px] opacity-10 pointer-events-none bg-emerald-500" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full blur-[120px] opacity-10 pointer-events-none bg-emerald-500" />

            <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-4 shadow-xl shadow-slate-100/40 border border-slate-100 p-8 md:p-10 rounded-3xl bg-white relative z-10 animate-fade-in'>
                <div className='flex flex-col items-center text-center mb-4'>
                    <div className='p-3 bg-emerald-50 rounded-2xl text-emerald-600 mb-3 shadow-sm'>
                        <FiLock className="w-6 h-6" />
                    </div>
                    <h2 className='text-2xl font-black text-slate-800 tracking-tight'>Welcome Back</h2>
                    <p className='text-xs text-slate-500 mt-1 font-semibold'>Access your secure Ecom dashboard</p>
                </div>
                
                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="email" className='text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5'>
                        <FiMail className="w-3.5 h-3.5" /> Email Address
                    </label>
                    <input 
                        type="email" 
                        required 
                        onChange={handleChange} 
                        value={formData.email} 
                        name='email' 
                        id='email'  
                        className='w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-sm font-medium transition duration-200' 
                    />
                </div>
                
                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="password" className='text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5'>
                        <FiLock className="w-3.5 h-3.5" /> Password
                    </label>
                    <input 
                        type="password" 
                        onChange={handleChange} 
                        value={formData.password} 
                        name='password' 
                        id='password' 
                        required  
                        className='w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-sm font-medium transition duration-200'
                    />
                </div>
                
                <div className='w-full flex flex-row items-center justify-between text-xs font-bold mt-2'>
                    <Link href={'/register'} className='text-emerald-600 hover:text-emerald-500 hover:underline transition'>Register Account</Link>
                    <Link href={'/recover-account'} className='text-slate-450 hover:text-slate-600 hover:underline transition'>Recover password?</Link>
                </div>
                
                <button 
                    type='submit' 
                    disabled={submitting}
                    className={`w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 rounded-xl cursor-pointer transition shadow-lg shadow-emerald-600/15 hover:scale-[1.01] active:scale-[0.99] ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {submitting ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
        </div>
    )
}

export default LoginForm