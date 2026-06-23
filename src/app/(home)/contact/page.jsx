'use client'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '@/component/helper/Context'
import { 
  BiEnvelope, 
  BiPhoneCall, 
  BiMap, 
  BiSend, 
  BiTimeFive, 
  BiLoaderAlt 
} from 'react-icons/bi'

export default function ContactPage() {
  const { website } = useContext(Context)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      await axios.post('/api/contact', {
        name,
        email,
        subject,
        message
      })
      toast.success('Inquiry submitted successfully! We will get back to you via email shortly.')
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to submit contact form.')
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-slate-50/75 py-24 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        
        {/* Header Section */}
        <div className="text-center flex flex-col gap-3 max-w-2xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Get in Touch
          </h1>
          <p className="text-slate-500 text-base sm:text-lg">
            {website?.tagline || 'Have questions about products, shipping, or need support? Drop us a line and our management team will reply directly to your inbox.'}
          </p>
        </div>

        {/* Content Split: Form vs Details */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          
          {/* Info Details Panel (2 columns) */}
          <div className="lg:col-span-2 flex flex-col gap-6 justify-between bg-slate-900 text-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-950/20 relative overflow-hidden">
            
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />
            
            <div className="flex flex-col gap-8 relative z-10">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Contact Information</h2>
                <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
                  Reach out to us directly or visit our showrooms. We are always ready to help.
                </p>
              </div>

              {/* Coordinates List */}
              <div className="flex flex-col gap-6">
                
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800 rounded-2xl text-emerald-450 border border-slate-700/50 shrink-0 text-xl text-emerald-400">
                    <BiPhoneCall />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Customer Helpline</h4>
                    <p className="text-slate-100 text-sm font-semibold mt-1">{website?.phone || '+880 1234-567890'}</p>
                    <p className="text-slate-450 text-xxs mt-0.5">Support Hours: 9 AM - 6 PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800 rounded-2xl text-emerald-450 border border-slate-700/50 shrink-0 text-xl text-emerald-400">
                    <BiEnvelope />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Email Address</h4>
                    <p className="text-slate-100 text-sm font-semibold mt-1">{website?.email || 'support@ecommerce.com'}</p>
                    <p className="text-slate-450 text-xxs mt-0.5">Response within 24 hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-slate-800 rounded-2xl text-emerald-450 border border-slate-700/50 shrink-0 text-xl text-emerald-400">
                    <BiMap />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Office Showroom</h4>
                    <p className="text-slate-100 text-sm font-semibold mt-1 leading-relaxed">
                      {website?.address || <>123 Commercial Plaza, 4th Floor,<br />Dhaka, Bangladesh</>}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Support Hours Alert Card */}
            <div className="bg-slate-800/80 border border-slate-700/30 p-5 rounded-2xl mt-6 relative z-10 flex gap-3.5 items-start">
              <BiTimeFive className="text-2xl text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h5 className="text-sm font-bold text-slate-200">Support Availability</h5>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Our online manager dashboard monitors incoming contact forms 24/7. Official response dispatch runs Saturday to Thursday.
                </p>
              </div>
            </div>

          </div>

          {/* Inquiry Form Panel (3 columns) */}
          <div className="lg:col-span-3 bg-white border border-slate-100 shadow-md rounded-3xl p-6 md:p-10 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-850 border-b border-slate-50 pb-3">Submit an Inquiry</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              
              {/* Grid: Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Your Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                  />
                </div>

              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Subject <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Questions regarding wholesale pricing"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase">Detailed Message <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={5}
                  placeholder="Explain your inquiry in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <BiLoaderAlt className="animate-spin text-lg" />
                    Submitting Inquiry...
                  </>
                ) : (
                  <>
                    <BiSend className="text-lg" /> Send Message
                  </>
                )}
              </button>

            </form>
          </div>

        </div>

      </div>
    </div>
  )
}
