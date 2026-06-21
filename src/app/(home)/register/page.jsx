import RegisterForm from '@/component/forms/RegisterForm'
import React from 'react'

const RegisterPage = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center bg-white p-4'>
      <div className='w-full hidden md:flex items-center justify-center gap-4 bg-slate-900 min-h-screen rounded-2xl'>
        <div className='flex flex-col gap-2 text-white p-8'>
          <p className='text-lg uppercase tracking-widest text-red-500 font-semibold'>Join us today</p>
          <h2 className='text-7xl font-bold'>Ecom</h2>
          <p className='text-xl mt-4'>Fastest, secure & trusted e-commerce</p>
          <p className='text-xl'>platform around your city</p>
        </div>
      </div>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
