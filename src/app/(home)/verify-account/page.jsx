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
        <div className='w-full max-w-md flex flex-col gap-4 shadow-md border border-black/10 p-8 rounded-2xl bg-white'>
            <h2 className='text-2xl font-bold text-slate-800 text-center'>Verify Account</h2>
            
            {status === 'success' && (
                <div className='p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-center text-sm font-medium'>
                    {message}
                    <div className='mt-2 text-xs text-emerald-600'>Redirecting to login page in 3 seconds...</div>
                </div>
            )}

            {status === 'error' && (
                <div className='p-4 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-center text-sm font-medium'>
                    {message}
                </div>
            )}

            {tokenFromUrl ? (
                <div className='text-center py-4'>
                    {verifying ? (
                        <p className='text-slate-600 animate-pulse font-medium'>Verifying token from URL, please wait...</p>
                    ) : status === 'success' ? (
                        <Link href='/login' className='text-red-600 hover:underline font-semibold'>Go to Login page</Link>
                    ) : (
                        <button 
                            onClick={() => verifyAccount(token)} 
                            className='primary-button bg-slate-900 text-white font-medium px-6 py-2 rounded-xl'
                        >
                            Retry Verification
                        </button>
                    )}
                </div>
            ) : (
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <p className='text-sm text-slate-500 text-center'>
                        If you didn't click the link in your email directly, paste the verification token below:
                    </p>
                    <div className='w-full flex flex-col gap-2'>
                        <input 
                            type="text" 
                            required 
                            onChange={(e) => setToken(e.target.value)} 
                            value={token} 
                            placeholder='Paste verification token here'
                            className='w-full p-2 border border-slate-300 rounded-lg outline-none focus:border-slate-800 text-center font-mono' 
                        />
                    </div>
                    <button 
                        type='submit' 
                        disabled={verifying || !token.trim()}
                        className={`primary-button w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl cursor-pointer transition ${verifying || !token.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {verifying ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            )}

            <div className='text-center text-sm mt-2'>
                <Link href={'/login'} className='text-slate-500 hover:underline'>Back to Login</Link>
            </div>
        </div>
    )
}

const VerifyPage = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-slate-50 p-4'>
      <Suspense fallback={<div className="text-slate-600 font-medium">Loading search parameters...</div>}>
        <VerifyForm />
      </Suspense>
    </div>
  )
}

export default VerifyPage
