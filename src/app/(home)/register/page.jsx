import RegisterForm from '@/component/forms/RegisterForm'
import React from 'react'

const RegisterPage = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-slate-50 p-4'>
      <div className='w-full hidden md:flex items-center justify-center gap-4 bg-slate-900 min-h-screen rounded-3xl relative overflow-hidden'>
        <div className="absolute inset-0 opacity-10 bg-radial-gradient from-white to-transparent pointer-events-none"></div>
        <div className='flex flex-col gap-4 text-white p-12 max-w-lg'>
          <span className="text-xs uppercase tracking-widest bg-red-600 text-white font-bold px-3 py-1 rounded-full w-fit">
            Join Us Today
          </span>
          <h2 className='text-6xl font-extrabold tracking-tight text-white'>Ecom</h2>
          <p className='text-slate-300 text-lg leading-relaxed mt-2'>
            Create an account on the fastest, most secure, and trusted e-commerce platform built around your city. Serving you excellence since 2016.
          </p>
        </div>
      </div>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
