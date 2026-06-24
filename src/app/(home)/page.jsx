import Brands from '@/component/pages/Brands'
import Categories from '@/component/pages/Categories'
import Contact from '@/component/pages/Contact'
import Hero from '@/component/pages/Hero'
import LatetsProducts from '@/component/pages/LatetsProducts'
import Reviews from '@/component/pages/Reviews'
import StoreLocation from '@/component/pages/StoreLocation'
import TopDiscountedProducts from '@/component/pages/TopDiscountedProducts'
import TopSales from '@/component/pages/TopSales'
import React from 'react'

const Homepage = () => {
  return (
    <div>
      
      <Hero/>
      <TopSales/>
      <TopDiscountedProducts/>
      <LatetsProducts/>
      <Reviews/>
      <Categories/>
      <Brands/>
      <Contact/>
      <StoreLocation/>
    </div>
  )
}

export default Homepage