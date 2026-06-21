'use client'
import React from 'react'
import Link from 'next/link'
import { FiCheckCircle, FiShield, FiTruck, FiUsers, FiClock, FiAward, FiTrendingUp, FiThumbsUp, FiDatabase, FiSettings, FiHeart } from 'react-icons/fi'

export default function AboutPage() {
  const stats = [
    { id: 1, label: 'Years in Service', value: '10+', icon: <FiClock className="w-6 h-6 text-red-500" /> },
    { id: 2, label: 'Happy Customers', value: '1M+', icon: <FiUsers className="w-6 h-6 text-red-500" /> },
    { id: 3, label: 'Delivered Orders', value: '5M+', icon: <FiCheckCircle className="w-6 h-6 text-red-500" /> },
    { id: 4, label: 'Secured Transactions', value: '100%', icon: <FiShield className="w-6 h-6 text-red-500" /> },
  ]

  const pillars = [
    {
      id: 1,
      title: 'Customer Obsession',
      description: 'We start with the customer and work backwards. Every operational process, software upgrade, and shipping optimization is designed to bring you maximum convenience and total peace of mind.',
      icon: <FiHeart className="w-6 h-6 text-red-500" />
    },
    {
      id: 2,
      title: 'Operational Excellence',
      description: 'Our automated warehousing, catalog management, and stock auditing tools ensure catalog pricing is transparent, inventories are accurate, and delays are completely eliminated.',
      icon: <FiSettings className="w-6 h-6 text-red-500" />
    },
    {
      id: 3,
      title: 'Digital-First Innovation',
      description: 'From serverless next-generation API routers to real-time parcel dispatch tracking, we harness state-of-the-art software systems to redefine the modern shopping experience.',
      icon: <FiDatabase className="w-6 h-6 text-red-500" />
    }
  ]

  const facilities = [
    {
      id: 1,
      title: 'Lightning-Fast Logistics',
      description: 'Our proprietary shipping network and local delivery hubs guarantee dispatch within hours, ensuring your package arrives safely inside a 24-hour window with live tracking.',
      icon: <FiTruck className="w-8 h-8 text-slate-800" />,
    },
    {
      id: 2,
      title: 'Certified Product Authenticity',
      description: 'We partner directly with official manufacturers and licensed distributors. Every item on Ecom goes through double-inspection audits to guarantee 100% genuine quality.',
      icon: <FiAward className="w-8 h-8 text-slate-800" />,
    },
    {
      id: 3,
      title: 'Encrypted Checkouts & COD',
      description: 'Shop with absolute peace of mind. We provide complete SSL-secured gateways for cards and mobile banking, alongside our widely trusted Cash on Delivery facility.',
      icon: <FiShield className="w-8 h-8 text-slate-800" />,
    },
    {
      id: 4,
      title: '24/7 Premium Support Desk',
      description: 'Our highly trained customer success managers are online around the clock. Get instant assistance on order queries, refunds, and technical support requests.',
      icon: <FiClock className="w-8 h-8 text-slate-800" />,
    },
    {
      id: 5,
      title: 'Hassle-Free Return Policy',
      description: 'Not satisfied with your product? Return it within 7 days using our automated system for a full refund or direct exchange, no complicated paperwork required.',
      icon: <FiThumbsUp className="w-8 h-8 text-slate-800" />,
    },
    {
      id: 6,
      title: 'Ecom Rewards & VIP Tier',
      description: 'Earn loyalty points with every checkout. Enjoy exclusive discount prices, free shipping offers, and priority customer support queues as a member of our VIP club.',
      icon: <FiTrendingUp className="w-8 h-8 text-slate-800" />,
    },
  ]

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">
      {/* 1. Hero Section */}
      <section className="w-full bg-slate-900 text-white py-24 px-8 text-center flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-radial-gradient from-white to-transparent pointer-events-none"></div>
        <span className="text-xs uppercase tracking-widest bg-red-600 text-white font-bold px-4 py-1 rounded-full mb-4 shadow-sm">
          A Decade of Digital Innovation
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
          Celebrating 10 Years of Ecom
        </h1>
        <p className="text-slate-300 max-w-3xl text-lg md:text-xl leading-relaxed">
          Launched in 2016 as a fully digital online shop, we have spent the last ten years perfecting the online shopping experience. Serving your city with authentic products and fast logistics.
        </p>
      </section>

      {/* 2. Stats Grid */}
      <section className="w-full max-w-6xl -mt-12 px-8 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl shadow-md border border-slate-100">
          {stats.map(stat => (
            <div key={stat.id} className="flex flex-col items-center text-center p-4 border-r last:border-r-0 border-slate-100 last:border-none">
              <div className="p-3 bg-red-50 rounded-full mb-3">{stat.icon}</div>
              <span className="text-3xl font-extrabold text-slate-800">{stat.value}</span>
              <span className="text-sm text-slate-500 font-medium mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Detailed Story & History */}
      <section className="w-full max-w-4xl px-8 py-16 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-slate-800">Our Decade-Long Journey</h2>
          <p className="text-slate-600 leading-relaxed text-base">
            Ecom was founded in 2016 with a singular, clear vision: to establish a premier, fully online storefront that bridges the gap between quality products and seamless digital delivery. Unlike traditional brick-and-mortar retailers that transitioned online, Ecom was built as a digital-native platform from day one, optimizing every single layer of cataloging, stock control, and shipment.
          </p>
          <p className="text-slate-600 leading-relaxed text-base">
            Over the past ten years, we have continuously iterated on our web technologies to offer an intuitive user interface, lightning-fast search capabilities, and highly structured inventory logging. We have focused on cultivating direct relationships with brands and global suppliers, removing middlemen to pass savings directly to our customers.
          </p>
          <p className="text-slate-600 leading-relaxed text-base">
            Today, Ecom stands at the forefront of the digital commerce industry, boasting automated order routing pipelines, state-of-the-art encryption standards, and a dedicated network of warehouses. Whether you are ordering consumer electronics, daily necessities, or fashion items, Ecom ensures that your transaction remains secure and your package arrives on schedule.
          </p>
        </div>

        {/* Core Pillars Section */}
        <div className="flex flex-col gap-6 mt-4">
          <h3 className="text-2xl font-bold text-slate-800">Our Core Pillars</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map(pillar => (
              <div key={pillar.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3">
                <div className="p-2 bg-red-50 w-fit rounded-lg">{pillar.icon}</div>
                <h4 className="text-lg font-bold text-slate-800">{pillar.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Extended Technical Infrastructure */}
        <div className="flex flex-col gap-4 bg-slate-900 text-white rounded-2xl p-8 shadow-md mt-4">
          <h3 className="text-xl font-bold">Secure and Scalable Infrastructure</h3>
          <p className="text-slate-300 text-sm leading-relaxed">
            Our platform is engineered for speed, safety, and reliability. Running on high-performance database infrastructures with secure SSL configurations, Ecom processes thousands of queries in milliseconds. By combining real-time inventory synchronization with direct API checks, we protect vendor stock counts and prevent transaction delays. Every session is encrypted via advanced JSON Web Token (JWT) standards and hosted using state-of-the-art serverless hosting networks.
          </p>
        </div>

        {/* 4. Core Values Timeline */}
        <div className="flex flex-col gap-6 bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-3">Decade Milestones</h3>
          
          <div className="relative border-l border-slate-200 pl-6 ml-3 flex flex-col gap-8">
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-red-500 border-4 border-white shadow-sm"></div>
              <span className="text-sm font-bold text-red-600">2016</span>
              <h4 className="font-semibold text-slate-800 mt-0.5">Founding & Digital Storefront Launch</h4>
              <p className="text-sm text-slate-500 mt-1">Ecom opens its fully digital online marketplace, enabling instant secure checkouts and establishing direct relationships with core suppliers.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-4 border-white shadow-sm"></div>
              <span className="text-sm font-bold text-slate-800">2019</span>
              <h4 className="font-semibold text-slate-800 mt-0.5">Logistics Overhaul & Hub Network</h4>
              <p className="text-sm text-slate-500 mt-1">Established local delivery hubs and custom packaging centers, reducing transit times across metropolitan areas to under 24 hours.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-4 border-white shadow-sm"></div>
              <span className="text-sm font-bold text-slate-800">2023</span>
              <h4 className="font-semibold text-slate-800 mt-0.5">Direct Brand & Manufacturer Integration</h4>
              <p className="text-sm text-slate-500 mt-1">Formed strict brand-auditing standards and direct manufacturer contracts, establishing Ecom as a trusted provider of genuine goods.</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-4 border-white shadow-sm"></div>
              <span className="text-sm font-bold text-slate-800">2026</span>
              <h4 className="font-semibold text-slate-800 mt-0.5">Ecom v2 Core Upgrade</h4>
              <p className="text-sm text-slate-500 mt-1">Upgraded our core backend engine, introducing modern API architectures, real-time inventory synchronization, and automated client notifications.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Key Facilities */}
      <section className="w-full bg-white border-t border-slate-100 py-16 px-8 flex flex-col items-center">
        <div className="w-full max-w-5xl flex flex-col gap-10">
          <div className="text-center flex flex-col gap-2">
            <h2 className="text-3xl font-bold text-slate-800">Premium Shopping Facilities</h2>
            <p className="text-slate-500 max-w-xl mx-auto">We provide premium amenities that place customer satisfaction and transaction safety first.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {facilities.map(facility => (
              <div key={facility.id} className="p-6 border border-slate-100 rounded-2xl bg-slate-50 hover:shadow-md transition duration-300">
                <div className="mb-4">{facility.icon}</div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{facility.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{facility.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="w-full max-w-4xl px-8 py-16 text-center">
        <div className="bg-slate-950 text-white rounded-3xl p-8 md:p-12 flex flex-col items-center gap-6 shadow-lg">
          <h2 className="text-2xl md:text-4xl font-bold">Ready to Experience Ecom?</h2>
          <p className="text-slate-300 text-sm md:text-base max-w-md">
            Create an account today to access thousands of certified products and experience fast, trusted deliveries.
          </p>
          <div className="flex gap-4 mt-2">
            <Link href="/products" className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-xl text-sm hover:bg-red-700 transition cursor-pointer shadow-md">
              Start Shopping
            </Link>
            <Link href="/register" className="px-6 py-2.5 bg-white text-slate-950 font-semibold rounded-xl text-sm hover:bg-slate-100 transition cursor-pointer shadow-md">
              Create Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
