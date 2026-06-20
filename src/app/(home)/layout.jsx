import Categorybar from '@/component/bars/Categorybar'
import Footer from '@/component/bars/Footer'
import Navbar from '@/component/bars/Navbar'
import React from 'react'

const HomeLayout = ({children}) => {
  return (
    <div>
        <div>
            <Navbar/>
            <Categorybar/>
        </div>
        {children}
        <Footer/>
    </div>
  )
}

export default HomeLayout