import LoginForm from '@/component/forms/LoginForm'
import React from 'react'

const LoginPage = () => {
  return (
    <div className='w-full min-h-screen flex items-center justify-center'>
      <div className='w-full hidden md:flex items-center justify-center gap-4 bg-red-400 min-h-screen'>
        <div className='flex flex-col gap-2 text-white'>
          <p>Welcome to</p>
          <h2 className='text-7xl'>Ecom</h2>
          <p>Fastest , secure & trusted e-commerce</p>
          <p>platform around your city</p>
        </div>
      </div>
      <LoginForm />
    </div>
  )
}

export default LoginPage