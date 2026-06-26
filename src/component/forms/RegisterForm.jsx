'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiLock } from 'react-icons/fi'

const RegisterForm = () => {
    const router = useRouter()
    const [submitting, setSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((data) => ({ ...data, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (submitting) return

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!')
            return
        }

        setSubmitting(true)
        const toastId = toast.loading('Registering account...')

        try {
            const { name, email, phone, password } = formData
            const response = await axios.post('/api/user', { name, email, phone, password })
            toast.success(response.data.message || 'Account registered! Please verify your email.', { 
                id: toastId,
                duration: 6000 
            })
            
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            })

            router.push('/login')
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.'
            toast.error(errorMessage, { id: toastId })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className='w-full flex flex-col items-center justify-center min-h-screen p-4 py-8 relative overflow-hidden'>
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full blur-[120px] opacity-10 pointer-events-none bg-emerald-500" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full blur-[120px] opacity-10 pointer-events-none bg-emerald-500" />

            <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-4 shadow-xl shadow-slate-100/40 border border-slate-100 p-8 md:p-10 rounded-3xl bg-white relative z-10 animate-fade-in'>
                <div className='flex flex-col items-center text-center mb-2'>
                    <div className='p-3 bg-emerald-50 rounded-2xl text-emerald-600 mb-3 shadow-sm'>
                        <FiUser className="w-6 h-6" />
                    </div>
                    <h2 className='text-2xl font-black text-slate-800 tracking-tight'>Create Account</h2>
                    <p className='text-xs text-slate-500 mt-1 font-semibold'>Get access to premium shopping benefits</p>
                </div>
                
                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="name" className='text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5'>
                        <FiUser className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <input 
                        type="text" 
                        required 
                        onChange={handleChange} 
                        value={formData.name} 
                        name='name' 
                        id='name'  
                        className='w-full px-4 py-3 bg-slate-55/40 border border-slate-200/80 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-sm font-medium transition duration-200' 
                    />
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
                        className='w-full px-4 py-3 bg-slate-55/40 border border-slate-200/80 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-sm font-medium transition duration-200' 
                    />
                </div>

                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="phone" className='text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5'>
                        <FiPhone className="w-3.5 h-3.5" /> Phone Number (Optional)
                    </label>
                    <input 
                        type="tel" 
                        onChange={handleChange} 
                        value={formData.phone} 
                        name='phone' 
                        id='phone'  
                        className='w-full px-4 py-3 bg-slate-55/40 border border-slate-200/80 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-sm font-medium transition duration-200' 
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
                        className='w-full px-4 py-3 bg-slate-55/40 border border-slate-200/80 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-sm font-medium transition duration-200'
                    />
                </div>

                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="confirmPassword" className='text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5'>
                        <FiLock className="w-3.5 h-3.5" /> Confirm Password
                    </label>
                    <input 
                        type="password" 
                        onChange={handleChange} 
                        value={formData.confirmPassword} 
                        name='confirmPassword' 
                        id='confirmPassword' 
                        required  
                        className='w-full px-4 py-3 bg-slate-55/40 border border-slate-200/80 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-sm font-medium transition duration-200'
                    />
                </div>
                
                <div className='w-full flex flex-row items-center justify-between text-xs font-bold mt-2'>
                    <span className='text-slate-500'>Already have an account?</span>
                    <Link href={'/login'} className='text-emerald-600 hover:text-emerald-500 hover:underline transition'>Login here</Link>
                </div>
                
                <button 
                    type='submit' 
                    disabled={submitting}
                    className={`w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 rounded-xl cursor-pointer transition shadow-lg shadow-emerald-600/15 hover:scale-[1.01] active:scale-[0.99] ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {submitting ? 'Creating Account...' : 'Register'}
                </button>
            </form>
        </div>
    )
}

export default RegisterForm
