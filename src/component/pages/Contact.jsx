'use client'
import React, { useState, useContext } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Context } from '../helper/Context'
import { BiLoaderAlt, BiEnvelope, BiUser, BiEdit, BiMessageDetail } from 'react-icons/bi'

const Contact = () => {
  const { website } = useContext(Context)
  const themeColor = website?.theme_color || '#10b981'

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error('All form fields are required')
      return
    }

    setSubmitting(true)
    const toastId = toast.loading('Sending your message...')

    try {
      await axios.post('/api/contact', {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim()
      })

      toast.success('Thank you! Your message has been sent successfully.', { id: toastId })
      setName('')
      setEmail('')
      setSubject('')
      setMessage('')
    } catch (err) {
      console.error(err)
      toast.error(err.response?.data?.error || 'Failed to send message. Please try again.', { id: toastId })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full py-16 px-4 md:px-8 bg-slate-50 border-b border-slate-100">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-12 bg-white rounded-3xl p-6 md:p-10 border border-slate-100 shadow-sm animate-fade-in">

        {/* Left Column Description */}
        <div className="flex-1 flex flex-col gap-5 justify-center">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600" style={{ color: themeColor }}>
            Get In Touch
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
            Have Questions? Write Us A Message
          </h2>
          <p className="text-slate-500 text-xs leading-relaxed font-medium">
            We value your inquiries, concerns, and general feedback. Drop your details into the active channels, and our support team will get back to you shortly.
          </p>
        </div>

        {/* Right Column Form */}
        <form onSubmit={handleSendMessage} className="flex-1 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
              <BiUser /> Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Tanvir Ahmed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
              <BiEnvelope /> Email
            </label>
            <input
              type="email"
              required
              placeholder="e.g. tanvir@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
              <BiEdit /> Subject
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Delivery Inquiry"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-slate-500 flex items-center gap-1 uppercase tracking-wider">
              <BiMessageDetail /> Message
            </label>
            <textarea
              required
              rows="4"
              placeholder="Write details of your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 mt-2 text-white font-bold text-xs rounded-xl shadow-md transition hover:scale-[1.01] hover:brightness-105 active:scale-100 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: themeColor }}
          >
            {submitting ? (
              <>
                <BiLoaderAlt className="animate-spin text-sm" /> Submitting...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>

      </div>
    </div>
  )
}

export default Contact