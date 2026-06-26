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
        <div className='w-full max-w-md flex flex-col gap-4 shadow-xl shadow-slate-100/40 border border-slate-100 p-8 md:p-10 rounded-3xl bg-white relative z-10 animate-fade-in'>
            <h2 className='text-2xl font-black text-slate-800 text-center tracking-tight'>
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
                    <p className='text-xs text-slate-550 text-center leading-relaxed font-semibold'>
                        Enter and confirm your new password below.
                    </p>
                    
                    <div className='w-full flex flex-col gap-1.5'>
                        <label htmlFor="password" className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>New Password</label>
                        <input 
                            type="password" 
                            required 
                            onChange={(e) => setPassword(e.target.value)} 
                            value={password} 
                            id="password"
                            className='w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-sm font-medium transition duration-200' 
                        />
                    </div>

                    <div className='w-full flex flex-col gap-1.5'>
                        <label htmlFor="confirmPassword" className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>Confirm New Password</label>
                        <input 
                            type="password" 
                            required 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            value={confirmPassword} 
                            id="confirmPassword"
                            className='w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-sm font-medium transition duration-200' 
                        />
                    </div>

                    <button 
                        type='submit' 
                        disabled={submitting || !password || !confirmPassword}
                        className={`w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 rounded-xl cursor-pointer transition shadow-lg shadow-emerald-600/15 hover:scale-[1.01] active:scale-[0.99] ${submitting || !password || !confirmPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            ) : (
                /* Stage 1: Request Link Form */
                <form onSubmit={handleRequestLink} className='flex flex-col gap-4'>
                    <p className='text-xs text-slate-550 text-center leading-relaxed font-semibold'>
                        Enter your registered email address and we'll send you a password reset link.
                    </p>
                    
                    <div className='w-full flex flex-col gap-1.5'>
                        <label htmlFor="email" className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>Email Address</label>
                        <input 
                            type="email" 
                            required 
                            onChange={(e) => setEmail(e.target.value)} 
                            value={email} 
                            id="email"
                            className='w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-sm font-medium transition duration-200' 
                        />
                    </div>

                    <button 
                        type='submit' 
                        disabled={submitting || !email}
                        className={`w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 rounded-xl cursor-pointer transition shadow-lg shadow-emerald-600/15 hover:scale-[1.01] active:scale-[0.99] ${submitting || !email ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {submitting ? 'Sending...' : 'Send Recovery Link'}
                    </button>
                </form>
            )}

            <div className='text-center text-xs mt-3 flex justify-between items-center px-1 font-bold'>
                <Link href={'/login'} className='text-emerald-600 hover:text-emerald-500 hover:underline transition'>Back to Login</Link>
                <Link href={'/register'} className='text-slate-450 hover:text-slate-600 hover:underline transition'>Create account</Link>
            </div>
        </div>
    )
}

const RecoverAccountPage = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden'>
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full blur-[120px] opacity-10 pointer-events-none bg-emerald-500" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full blur-[120px] opacity-10 pointer-events-none bg-emerald-500" />

      <Suspense fallback={<div className="text-slate-600 font-medium">Loading parameters...</div>}>
        <RecoverAccountForm />
      </Suspense>
    </div>
  )
}

export default RecoverAccountPage
