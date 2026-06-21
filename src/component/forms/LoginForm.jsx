'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi'
import { FaGoogle, FaGithub } from 'react-icons/fa'
import toast from 'react-hot-toast'

const LoginForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    })
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((data) => ({
            ...data,
            [name]: type === 'checkbox' ? checked : value
        }))
        // Clear errors as user types
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }))
        }
    }

    const validate = () => {
        const tempErrors = {}
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

        if (!formData.email) {
            tempErrors.email = 'Email address is required'
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = 'Please enter a valid email address'
        }

        if (!formData.password) {
            tempErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            tempErrors.password = 'Password must be at least 6 characters'
        }

        setErrors(tempErrors)
        return Object.keys(tempErrors).length === 0
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validate()) {
            toast.error('Please correct the errors in the form.')
            return
        }

        setIsLoading(true)
        const toastId = toast.loading('Checking credentials...')

        try {
            // Simulate API Request
            await new Promise((resolve) => setTimeout(resolve, 1500))
            toast.success('Logged in successfully! Redirecting...', { id: toastId })
            // For production, the user can hook up login API and token storing here.
        } catch (err) {
            toast.error('Authentication failed. Please try again.', { id: toastId })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md mx-auto p-6 md:p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl relative overflow-hidden transition-all duration-300">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-slate-800">Welcome Back</h3>
                <p className="text-sm text-slate-500 mt-1">Enter your credentials to access your account</p>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <button 
                    type="button" 
                    className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:scale-98 transition-all duration-200 cursor-pointer"
                >
                    <FaGoogle className="text-red-500" />
                    <span>Google</span>
                </button>
                <button 
                    type="button" 
                    className="flex items-center justify-center gap-2 py-2.5 px-4 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 active:scale-98 transition-all duration-200 cursor-pointer"
                >
                    <FaGithub className="text-slate-900" />
                    <span>GitHub</span>
                </button>
            </div>

            {/* Separator */}
            <div className="flex items-center justify-center gap-3 my-6">
                <div className="h-px bg-slate-100 flex-grow" />
                <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Or email login</span>
                <div className="h-px bg-slate-100 flex-grow" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Field */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="email">
                        Email Address
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-700 transition-colors">
                            <FiMail className="w-5 h-5" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="name@example.com"
                            className={`w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border rounded-xl text-slate-800 placeholder-slate-400 outline-none transition-all duration-250 ${
                                errors.email 
                                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/20' 
                                    : 'border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-100'
                            }`}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1.5 animate-fade-in">
                            <FiAlertCircle className="w-3.5 h-3.5" />
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="password">
                            Password
                        </label>
                        <Link 
                            href="/recover-account" 
                            className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-700 transition-colors">
                            <FiLock className="w-5 h-5" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className={`w-full pl-10 pr-10 py-2.5 bg-slate-50/50 border rounded-xl text-slate-800 placeholder-slate-400 outline-none transition-all duration-250 ${
                                errors.password 
                                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 bg-rose-50/20' 
                                    : 'border-slate-200 focus:border-slate-800 focus:ring-2 focus:ring-slate-100'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        >
                            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1.5 animate-fade-in">
                            <FiAlertCircle className="w-3.5 h-3.5" />
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Remember Me Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                        className="w-4.5 h-4.5 text-rose-600 bg-slate-50 border-slate-300 rounded-md focus:ring-rose-500/20 transition-all duration-200 cursor-pointer"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-slate-600 cursor-pointer select-none">
                        Keep me logged in
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 active:scale-99 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Signing in...</span>
                        </>
                    ) : (
                        <span>Sign In</span>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link 
                        href="/register" 
                        className="font-bold text-rose-600 hover:text-rose-700 hover:underline transition-all"
                    >
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default LoginForm