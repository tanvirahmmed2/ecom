'use client'
import React, { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

const RecoverAccountForm = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    // Request Stage State
    const [email, setEmail] = useState('')
    
    // Reset Stage State
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [submitting, setSubmitting] = useState(false)
    const [status, setStatus] = useState('idle') // idle, success
    const [message, setMessage] = useState('')

    // Stage 1: Request reset link
    const handleRequestLink = async (e) => {
        e.preventDefault()
        if (submitting) return

        setSubmitting(true)
        const toastId = toast.loading('Sending reset link...')

        try {
            const response = await axios.post('/api/user/recover-account', { email })
            setStatus('success')
            setMessage(response.data.message || 'Recovery email sent.')
            toast.success(response.data.message || 'Recovery link sent!', { id: toastId })
            setEmail('')
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to send recovery link. Please try again.'
            toast.error(errorMsg, { id: toastId })
        } finally {
            setSubmitting(false)
        }
    }

    // Stage 2: Reset password
    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (submitting) return

        if (password !== confirmPassword) {
            toast.error('Passwords do not match!')
            return
        }

        setSubmitting(true)
        const toastId = toast.loading('Resetting password...')

        try {
            const response = await axios.put('/api/user/recover-account', { token, password })
            setStatus('success')
            setMessage(response.data.message || 'Password reset successful.')
            toast.success(response.data.message || 'Password reset successful!', { id: toastId })
            
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Failed to reset password. Link may be invalid or expired.'
            toast.error(errorMsg, { id: toastId })
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className='w-full max-w-md flex flex-col gap-4 shadow-md border border-black/10 p-8 rounded-2xl bg-white'>
            <h2 className='text-2xl font-bold text-slate-800 text-center'>
                {token ? 'Reset Password' : 'Recover Account'}
            </h2>

            {status === 'success' && (
                <div className='p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-center text-sm font-medium'>
                    {message}
                    {token && <div className='mt-2 text-xs text-emerald-600'>Redirecting to login page in 3 seconds...</div>}
                </div>
            )}

            {token ? (
                /* Stage 2: Password Reset Form */
                <form onSubmit={handleResetPassword} className='flex flex-col gap-4'>
                    <p className='text-sm text-slate-500 text-center'>
                        Enter and confirm your new password below.
                    </p>
                    
                    <div className='w-full flex flex-col gap-2'>
                        <label htmlFor="password" className='text-sm font-semibold text-slate-600'>New Password</label>
                        <input 
                            type="password" 
                            required 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            id="password"
                            placeholder='Enter new password'
                            className='w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-slate-800' 
                        />
                    </div>

                    <div className='w-full flex flex-col gap-2'>
                        <label htmlFor="confirmPassword" className='text-sm font-semibold text-slate-600'>Confirm New Password</label>
                        <input 
                            type="password" 
                            required 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            value={confirmPassword} 
                            id="confirmPassword"
                            placeholder='Confirm new password'
                            className='w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-slate-800' 
                        />
                    </div>

                    <button 
                        type='submit' 
                        disabled={submitting || !password || !confirmPassword}
                        className={`primary-button w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl cursor-pointer transition ${submitting || !password || !confirmPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            ) : (
                /* Stage 1: Request Link Form */
                <form onSubmit={handleRequestLink} className='flex flex-col gap-4'>
                    <p className='text-sm text-slate-500 text-center'>
                        Enter your registered email address and we'll send you a password reset link.
                    </p>
                    
                    <div className='w-full flex flex-col gap-2'>
                        <label htmlFor="email" className='text-sm font-semibold text-slate-600'>Email Address</label>
                        <input 
                            type="email" 
                            required 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            id="email"
                            placeholder='Enter email address'
                            className='w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-slate-800' 
                        />
                    </div>

                    <button 
                        type='submit' 
                        disabled={submitting || !email}
                        className={`primary-button w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl cursor-pointer transition ${submitting || !email ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? 'Sending...' : 'Send Recovery Link'}
                    </button>
                </form>
            )}

            <div className='text-center text-sm mt-2 flex justify-between items-center px-1'>
                <Link href={'/login'} className='text-red-600 hover:underline font-medium'>Back to Login</Link>
                <Link href={'/register'} className='text-slate-500 hover:underline'>Create account</Link>
            </div>
        </div>
    )
}

const RecoverAccountPage = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-slate-50 p-4'>
      <Suspense fallback={<div className="text-slate-600 font-medium">Loading parameters...</div>}>
        <RecoverAccountForm />
      </Suspense>
    </div>
  )
}

export default RecoverAccountPage
