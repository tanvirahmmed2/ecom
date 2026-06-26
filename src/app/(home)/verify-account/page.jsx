'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'

// Helper subcomponent to handle search params in Suspense
const VerifyForm = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const tokenFromUrl = searchParams.get('token')

    const [token, setToken] = useState('')
    const [verifying, setVerifying] = useState(false)
    const [status, setStatus] = useState('idle') // idle, success, error
    const [message, setMessage] = useState('')

    const verifyAccount = async (verifyToken) => {
        if (!verifyToken) return
        setVerifying(true)
        setStatus('idle')
        const toastId = toast.loading('Verifying account...')

        try {
            const response = await axios.post('/api/user/verify-account', { token: verifyToken })
            setStatus('success')
            setMessage(response.data.message || 'Account verified successfully!')
            toast.success(response.data.message || 'Account verified!', { id: toastId })
            
            // Auto redirect to login after 3 seconds
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        } catch (error) {
            setStatus('error')
            const errorMsg = error.response?.data?.error || 'Verification failed. Invalid or expired token.'
            setMessage(errorMsg)
            toast.error(errorMsg, { id: toastId })
        } finally {
            setVerifying(false)
        }
    }

    // Auto verify if token is present in the URL on load
    useEffect(() => {
        if (tokenFromUrl) {
            setToken(tokenFromUrl)
            verifyAccount(tokenFromUrl)
        }
    }, [tokenFromUrl])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (token.trim()) {
            verifyAccount(token.trim())
        }
    }

    return (
        <div className='w-full max-w-md flex flex-col gap-4 shadow-xl shadow-slate-100/40 border border-slate-100 p-8 md:p-10 rounded-3xl bg-white relative z-10 animate-fade-in'>
            <h2 className='text-2xl font-black text-slate-800 text-center tracking-tight'>Verify Account</h2>
            
            {status === 'success' && (
                <div className='p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-center text-sm font-medium animate-fade-in'>
                    {message}
                    <div className='mt-2 text-xs text-emerald-600'>Redirecting to login page in 3 seconds...</div>
                </div>
            )}

            {status === 'error' && (
                <div className='p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-center text-sm font-medium animate-fade-in'>
                    {message}
                </div>
            )}

            {tokenFromUrl ? (
                <div className='text-center py-4'>
                    {verifying ? (
                        <p className='text-xs text-slate-500 animate-pulse font-bold uppercase tracking-wider'>Verifying token from URL, please wait...</p>
                    ) : status === 'success' ? (
                        <Link href='/login' className='text-emerald-600 hover:text-emerald-500 hover:underline font-bold text-sm transition'>Go to Login page</Link>
                    ) : (
                        <button 
                            onClick={() => verifyAccount(token)} 
                            className='w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 rounded-xl cursor-pointer transition shadow-lg shadow-emerald-600/15 hover:scale-[1.01] active:scale-[0.99]'
                        >
                            Retry Verification
                        </button>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <p className='text-xs text-slate-550 text-center leading-relaxed font-semibold'>
                        If you didn't click the link in your email directly, paste the verification token below:
                    </p>
                    <div className='w-full flex flex-col gap-1.5'>
                        <label htmlFor="token" className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>Verification Token</label>
                        <input 
                            type="text" 
                            required 
                            onChange={(e) => setToken(e.target.value)} 
                            value={token} 
                            id="token"
                            className='w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl outline-none focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 text-slate-800 text-sm font-medium text-center font-mono transition duration-200' 
                        />
                    </div>
                    <button 
                        type='submit' 
                        disabled={verifying || !token.trim()}
                        className={`w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm py-3.5 rounded-xl cursor-pointer transition shadow-lg shadow-emerald-600/15 hover:scale-[1.01] active:scale-[0.99] ${verifying || !token.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {verifying ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            )}

            <div className='text-center text-xs mt-3 font-bold'>
                <Link href={'/login'} className='text-slate-455 hover:text-slate-600 hover:underline transition'>Back to Login</Link>
            </div>
        </div>
    )
}

const VerifyPage = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-slate-50 p-4 relative overflow-hidden'>
      {/* Ambient Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full blur-[120px] opacity-10 pointer-events-none bg-emerald-500" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[45%] h-[45%] rounded-full blur-[120px] opacity-10 pointer-events-none bg-emerald-500" />

      <Suspense fallback={<div className="text-slate-600 font-medium">Loading search parameters...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  )
}

export default VerifyPage
