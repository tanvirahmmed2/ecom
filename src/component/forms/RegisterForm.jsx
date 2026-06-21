'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'

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
        
        try {
            const response = await axios.post('/api/user', formData,{withCredentials:true})
            toast.success(response.data.message)
            
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            })

            
            window.location.replace('/login')
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.'
            toast.error(errorMessage, { id: toastId })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className='w-full flex flex-col items-center justify-center min-h-screen py-8'>
            <form onSubmit={handleSubmit} className='w-auto min-w-96 flex flex-col items-center justify-center gap-3 shadow-md border border-black/10 p-8 rounded-2xl bg-white'>
                <h2 className='text-2xl font-bold text-slate-800 mb-2'>Create Account</h2>
                
                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="name" className='text-sm font-semibold text-slate-600'>Full Name</label>
                    <input 
                        type="text" 
                        required 
                        onChange={handleChange} 
                        value={formData.name} 
                        name='name' 
                        id='name'  
                        placeholder='Enter your full name'
                        className='standard-input w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-slate-800' 
                    />
                </div>

                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="email" className='text-sm font-semibold text-slate-600'>Email Address</label>
                    <input 
                        type="email" 
                        required 
                        onChange={handleChange} 
                        value={formData.email} 
                        name='email' 
                        id='email'  
                        placeholder='Enter your email address'
                        className='standard-input w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-slate-800' 
                    />
                </div>

                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="phone" className='text-sm font-semibold text-slate-600'>Phone Number (Optional)</label>
                    <input 
                        type="tel" 
                        onChange={handleChange} 
                        value={formData.phone} 
                        name='phone' 
                        id='phone'  
                        placeholder='Enter your phone number'
                        className='standard-input w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-slate-800' 
                    />
                </div>
                
                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="password" className='text-sm font-semibold text-slate-600'>Password</label>
                    <input 
                        type="password" 
                        onChange={handleChange} 
                        value={formData.password} 
                        name='password' 
                        id='password' 
                        required  
                        placeholder='Create password'
                        className='standard-input w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-slate-800'
                    />
                </div>

                <div className='w-full flex flex-col gap-1.5'>
                    <label htmlFor="confirmPassword" className='text-sm font-semibold text-slate-600'>Confirm Password</label>
                    <input 
                        type="password" 
                        onChange={handleChange} 
                        value={formData.confirmPassword} 
                        name='confirmPassword' 
                        id='confirmPassword' 
                        required  
                        placeholder='Re-enter password'
                        className='standard-input w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-slate-800'
                    />
                </div>
                
                <div className='w-full flex flex-row items-center justify-between text-sm mt-1'>
                    <span className='text-slate-500'>Already have an account?</span>
                    <Link href={'/login'} className='text-red-600 hover:underline font-medium'>Login here</Link>
                </div>
                
                <button 
                    type='submit' 
                    disabled={submitting}
                    className={`primary-button w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl cursor-pointer transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {submitting ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    )
}

export default RegisterForm
