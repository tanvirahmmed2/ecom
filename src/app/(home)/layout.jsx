import Categorybar from '@/component/bars/Categorybar'
import Footer from '@/component/bars/Footer'
import Navbar from '@/component/bars/Navbar'
import React from 'react'

const HomeLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden relative pt-28'>
        <div className='w-full fixed top-1 min-h-14'>
            <Navbar/>
            <Categorybar/>
        </div>
        {children}
        <Footer/>
    </div>
  )
}

export default HomeLayout