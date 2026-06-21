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
        <div className='w-full flex flex-col items-center justify-center min-h-screen p-4 py-8'>
            <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-4 shadow-md border border-slate-100 p-8 rounded-3xl bg-white'>
                <div className='flex flex-col items-center text-center mb-2'>
                    <div className='p-3 bg-red-50 rounded-2xl text-red-500 mb-3 shadow-sm'>
                        <FiUser className="w-6 h-6" />
                    </div>
                    <h2 className='text-2xl font-extrabold text-slate-800 tracking-tight'>Create Account</h2>
                    <p className='text-sm text-slate-500 mt-1 font-medium'>Get access to premium shopping benefits</p>
                </div>
                
                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="name" className='text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5'>
                        <FiUser className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <input 
                        type="text" 
                        required 
                        onChange={handleChange} 
                        value={formData.name} 
                        name='name' 
                        id='name'  
                        placeholder='John Doe'
                        className='w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-800 transition placeholder-slate-400 bg-slate-50 focus:bg-white text-sm' 
                    />
                </div>

                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="email" className='text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5'>
                        <FiMail className="w-3.5 h-3.5" /> Email Address
                    </label>
                    <input 
                        type="email" 
                        required 
                        onChange={handleChange} 
                        value={formData.email} 
                        name='email' 
                        id='email'  
                        placeholder='name@example.com'
                        className='w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-800 transition placeholder-slate-400 bg-slate-50 focus:bg-white text-sm' 
                    />
                </div>

                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="phone" className='text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5'>
                        <FiPhone className="w-3.5 h-3.5" /> Phone Number (Optional)
                    </label>
                    <input 
                        type="tel" 
                        onChange={handleChange} 
                        value={formData.phone} 
                        name='phone' 
                        id='phone'  
                        placeholder='+1 (555) 000-0000'
                        className='w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-800 transition placeholder-slate-400 bg-slate-50 focus:bg-white text-sm' 
                    />
                </div>
                
                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="password" className='text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5'>
                        <FiLock className="w-3.5 h-3.5" /> Password
                    </label>
                    <input 
                        type="password" 
                        onChange={handleChange} 
                        value={formData.password} 
                        name='password' 
                        id='password' 
                        required  
                        placeholder='Create password'
                        className='w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-800 transition placeholder-slate-400 bg-slate-50 focus:bg-white text-sm'
                    />
                </div>

                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="confirmPassword" className='text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5'>
                        <FiLock className="w-3.5 h-3.5" /> Confirm Password
                    </label>
                    <input 
                        type="password" 
                        onChange={handleChange} 
                        value={formData.confirmPassword} 
                        name='confirmPassword' 
                        id='confirmPassword' 
                        required  
                        placeholder='Confirm password'
                        className='w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-800 transition placeholder-slate-400 bg-slate-50 focus:bg-white text-sm'
                    />
                </div>
                
                <div className='w-full flex flex-row items-center justify-between text-xs font-bold mt-1'>
                    <span className='text-slate-500'>Already have an account?</span>
                    <Link href={'/login'} className='text-red-600 hover:underline'>Login here</Link>
                </div>
                
                <button 
                    type='submit' 
                    disabled={submitting}
                    className={`w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl cursor-pointer transition shadow-md shadow-red-600/10 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {submitting ? 'Creating Account...' : 'Register'}
                </button>
            </form>
        </div>
    )
}

export default RegisterForm
