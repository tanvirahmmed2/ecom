import Categorybar from '@/component/bars/Categorybar'
import Footer from '@/component/bars/Footer'
import Navbar from '@/component/bars/Navbar'
import Sidebar from '@/component/bars/Sidebar'
import React from 'react'

const HomeLayout = ({children}) => {
  return (
    <div className='w-full overflow-x-hidden relative pt-28'>
        <div className='w-full fixed z-50 top-0 min-h-14'>
            <Navbar/>
            <Categorybar/>
        </div>
        <Sidebar/>
        {children}
        <Footer/>
    </div>
  )
}

export default HomeLayout