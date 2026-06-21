'use client'
import Link from 'next/link'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '../helper/Context'

const LoginForm = () => {
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

            window.location.replace('/')
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to login. Please try again.'
            toast.error(errorMessage, { id: toastId })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className='w-full flex flex-col items-center justify-center min-h-screen'>
            <form onSubmit={handleSubmit} className='w-auto min-w-96 flex flex-col items-center justify-center gap-3 shadow-md border border-black/10 p-8 rounded-2xl bg-white'>
                <h2 className='text-2xl font-bold text-slate-800 mb-2'>Account Login</h2>
                
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="email" className='text-sm font-semibold text-slate-600'>Email</label>
                    <input 
                        type="email" 
                        required 
                        onChange={handleChange} 
                        value={formData.email} 
                        name='email' 
                        id='email'  
                        placeholder='Enter your email'
                        className='standard-input w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-slate-800' 
                    />
                </div>
                
                <div className='w-full flex flex-col gap-2'>
                    <label htmlFor="password" className='text-sm font-semibold text-slate-600'>Password</label>
                    <input 
                        type="password" 
                        onChange={handleChange} 
                        value={formData.password} 
                        name='password' 
                        id='password' 
                        required  
                        placeholder='Enter your password'
                        className='standard-input w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-slate-800'
                    />
                </div>
                
                <div className='w-full flex flex-row items-center justify-between text-sm mt-1'>
                    <Link href={'/register'} className='text-red-600 hover:underline'>Register account</Link>
                    <Link href={'/recover-account'} className='text-slate-500 hover:underline'>Recover account?</Link>
                </div>
                
                <button 
                    type='submit' 
                    disabled={submitting}
                    className={`primary-button w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl cursor-pointer transition ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {submitting ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    )
}

export default LoginForm