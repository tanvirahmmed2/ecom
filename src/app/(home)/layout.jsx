import CartBar from '@/component/bars/CartBar'
import Categorybar from '@/component/bars/Categorybar'
import Footer from '@/component/bars/Footer'
import Menubar from '@/component/bars/Menubar'
import Navbar from '@/component/bars/Navbar'
import React from 'react'

const HomeLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden relative pt-14'>
        <div className='w-full fixed z-50 top-0 min-h-14'>
            <Navbar/>
            <Categorybar/>
        </div>
        <Menubar/>
        <CartBar/>
        {children}
        <Footer/>
    </div>
  )
}

export default HomeLayout