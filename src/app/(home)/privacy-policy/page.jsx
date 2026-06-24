'use client'
import React from 'react'
import Link from 'next/link'
import { BiShieldQuarter, BiLockAlt, BiUserCheck, BiCookie, BiEnvelope } from 'react-icons/bi'

export default function PrivacyPolicyPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-12 flex flex-col gap-8">
        
        {/* Header Section */}
        <div className="border-b border-slate-100 pb-6 text-center md:text-left">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-900 text-white text-xl mb-4">
            <BiShieldQuarter />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Privacy Policy</h1>
          <p className="text-slate-500 text-sm mt-2">Last Updated: June 24, 2026</p>
        </div>

        {/* Intro */}
        <p className="text-slate-600 text-sm leading-relaxed">
          Welcome to our E-Commerce platform. We are committed to protecting your privacy and ensuring your personal information is handled safely and responsibly. This Privacy Policy details how we collect, use, and protect your data when you visit our store or make a purchase.
        </p>

        {/* Policy Sections */}
        <div className="flex flex-col gap-8">
          
          {/* Section 1 */}
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 text-lg shrink-0">
              <BiLockAlt />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">1. Information We Collect</h2>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                We collect personal information that you provide directly to us, including your name, shipping address, email address, phone number, and payment information during checkout or account registration. We also collect transaction records and shopping preferences.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 text-lg shrink-0">
              <BiUserCheck />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">2. How We Use Your Data</h2>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                Your information is used to process orders, manage deliveries, verify account registration, handle payments, and communicate order updates. We may also use customer statistics to optimize our storefront display and prevent fraudulent transactions.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 text-lg shrink-0">
              <BiCookie />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">3. Cookies and Tracking</h2>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                We utilize browser cookies to maintain your shopping cart state, keep you signed in to your user panel, and analyze web traffic logs. You can configure your browser to reject cookies, though certain shopping cart checkout workflows may not function correctly as a result.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 text-lg shrink-0">
              <BiEnvelope />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">4. Contact and Updates</h2>
              <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                We do not sell or trade your personal information to third parties. If you have any inquiries regarding this policy, or would like to request deletion of your account profiles, please reach out to our support channels or submit an inquiry through our contact form.
              </p>
            </div>
          </div>

        </div>

        {/* Back Link */}
        <div className="border-t border-slate-100 pt-6 flex justify-center">
          <Link href="/" className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer">
            Return to Storefront
          </Link>
        </div>

      </div>
    </div>
  )
}
