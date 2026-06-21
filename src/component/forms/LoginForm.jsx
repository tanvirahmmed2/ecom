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
        <div className='w-full flex flex-col items-center justify-center min-h-screen p-4'>
            <form onSubmit={handleSubmit} className='w-full max-w-md flex flex-col gap-4 shadow-md border border-slate-100 p-8 rounded-3xl bg-white'>
                <div className='flex flex-col items-center text-center mb-2'>
                    <div className='p-3 bg-red-50 rounded-2xl text-red-500 mb-3 shadow-sm'>
                        <FiLock className="w-6 h-6" />
                    </div>
                    <h2 className='text-2xl font-extrabold text-slate-800 tracking-tight'>Welcome Back</h2>
                    <p className='text-sm text-slate-500 mt-1 font-medium'>Access your secure Ecom dashboard</p>
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
                        placeholder='••••••••'
                        className='w-full p-3 border border-slate-200 rounded-xl outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 text-slate-800 transition placeholder-slate-400 bg-slate-50 focus:bg-white text-sm'
                    />
                </div>
                
                <div className='w-full flex flex-row items-center justify-between text-xs font-bold mt-1'>
                    <Link href={'/register'} className='text-red-600 hover:underline'>Register Account</Link>
                    <Link href={'/recover-account'} className='text-slate-500 hover:underline'>Recover password?</Link>
                </div>
                
                <button 
                    type='submit' 
                    disabled={submitting}
                    className={`w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl cursor-pointer transition shadow-md shadow-red-600/10 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {submitting ? 'Authenticating...' : 'Sign In'}
                </button>
            </form>
        </div>
    )
}

export default LoginForm