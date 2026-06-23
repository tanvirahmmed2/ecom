'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Context } from '@/component/helper/Context'
import { 
  BiStar, 
  BiCheck, 
  BiTrash, 
  BiLoaderAlt, 
  BiRefresh, 
  BiTime, 
  BiCheckCircle,
  BiUser,
  BiEnvelope,
  BiConversation
} from 'react-icons/bi'

export default function ReviewsModerationPage() {
  const { dashSidebar, user } = useContext(Context)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('pending') // 'pending', 'approved', 'all'
  const [actionId, setActionId] = useState(null) // ID of review currently updating

  const fetchReviews = async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const res = await axios.get('/api/review?all=true')
      setReviews(res.data)
    } catch (err) {
      toast.error('Failed to fetch reviews')
      console.error(err)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    if (user && ['admin', 'manager', 'sales'].includes(user.role)) {
      fetchReviews()
    }
  }, [user])

  const handleApprove = async (id, approveStatus) => {
    setActionId(id)
    try {
      await axios.patch(`/api/review/${id}`, {
        is_approved: approveStatus
      })
      toast.success(approveStatus ? 'Review approved successfully!' : 'Review status reverted to pending.')
      fetchReviews(true)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update review status')
      console.error(err)
    } finally {
      setActionId(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('WARNING: Are you sure you want to delete this customer review permanently?')) {
      return
    }
    setActionId(id)
    try {
      await axios.delete(`/api/review/${id}`)
      toast.success('Review deleted successfully')
      setReviews(reviews.filter(r => r.review_id !== id))
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete review')
      console.error(err)
    } finally {
      setActionId(null)
    }
  }

  const filteredReviews = reviews.filter((r) => {
    if (activeTab === 'pending') return r.is_approved === false
    if (activeTab === 'approved') return r.is_approved === true
    return true
  })

  const renderStars = (count) => {
    return (
      <div className="flex gap-0.5 text-amber-500 text-sm">
        {[1, 2, 3, 4, 5].map((star) => (
          <BiStar key={star} className={star <= count ? 'fill-amber-500' : 'text-slate-200'} />
        ))}
      </div>
    )
  }

  return (
    <div className={`w-full min-h-screen bg-slate-50 pt-20 pb-12 px-4 md:px-8 transition-all duration-300 ${dashSidebar ? 'lg:pl-68' : 'lg:pl-8'}`}>
      <div className="max-w-6xl mx-auto flex flex-col gap-6">
        
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <BiConversation className="text-emerald-600" />
              Review Moderation Center
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">Approve customer feedback, revert status logs, or reject inappropriate posts.</p>
          </div>
          <button
            onClick={() => fetchReviews()}
            disabled={loading}
            className="p-2 border border-slate-200 hover:bg-slate-100 bg-white rounded-xl text-slate-650 transition disabled:opacity-50"
          >
            <BiRefresh className={`text-lg ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-white border border-slate-100 p-1.5 rounded-2xl shadow-xs shrink-0 max-w-md w-full">
          {['pending', 'approved', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold uppercase transition rounded-xl cursor-pointer ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-505 text-slate-500 hover:text-slate-850 hover:bg-slate-50'
              }`}
            >
              {tab === 'pending' ? 'Pending' : tab === 'approved' ? 'Approved' : 'All'}
            </button>
          ))}
        </div>

        {/* Reviews List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col gap-4">
          {loading && reviews.length === 0 ? (
            <div className="w-full h-64 flex items-center justify-center text-slate-450 gap-2">
              <BiLoaderAlt className="animate-spin text-xl text-emerald-600" />
              <span>Loading review data...</span>
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredReviews.map((rev) => {
                const isBusy = actionId === rev.review_id
                return (
                  <div 
                    key={rev.review_id}
                    className="border border-slate-100 rounded-2xl p-5 bg-slate-50/20 flex flex-col justify-between gap-4 hover:border-slate-205 transition"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-2 border-b border-slate-100 pb-2">
                        <div className="min-w-0">
                          <span className="font-bold text-slate-800 text-xs truncate flex items-center gap-1.5">
                            <BiUser className="text-slate-400" /> {rev.user_name}
                          </span>
                          <span className="text-xxs text-slate-450 font-mono mt-0.5 block truncate">
                            <BiEnvelope className="inline -mt-0.5 text-slate-400 mr-0.5" /> {rev.user_email}
                          </span>
                        </div>
                        <span className="text-xxs text-slate-400 font-mono shrink-0">
                          {new Date(rev.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        {renderStars(rev.rating)}
                        <h3 className="font-bold text-slate-800 text-xs mt-2 leading-snug">{rev.title}</h3>
                        {rev.comment && (
                          <p className="text-slate-655 text-xs italic whitespace-pre-wrap leading-relaxed mt-1.5 p-3 bg-white border border-slate-100/50 rounded-xl">
                            "{rev.comment}"
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions Panel */}
                    <div className="flex justify-between items-center border-t border-slate-100/50 pt-3">
                      <span className="text-xxxs font-mono text-slate-400">ID: #{rev.review_id}</span>
                      
                      <div className="flex gap-2">
                        {rev.is_approved ? (
                          <button
                            onClick={() => handleApprove(rev.review_id, false)}
                            disabled={isBusy}
                            className="px-3 py-1.5 border border-slate-205 text-slate-655 hover:bg-slate-50 hover:text-slate-800 text-xxs font-bold rounded-xl transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                          >
                            Revert to Pending
                          </button>
                        ) : (
                          <button
                            onClick={() => handleApprove(rev.review_id, true)}
                            disabled={isBusy}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xxs font-bold rounded-xl transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                          >
                            <BiCheck className="text-sm" /> Approve Feedback
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(rev.review_id)}
                          disabled={isBusy}
                          className="p-1.5 text-rose-650 hover:bg-rose-50 rounded-xl transition cursor-pointer flex items-center justify-center border border-transparent hover:border-rose-100 disabled:opacity-50"
                          title="Delete Review"
                        >
                          <BiTrash className="text-sm" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="w-full py-16 flex flex-col items-center justify-center text-slate-400 gap-1.5">
              <BiConversation className="text-4xl text-slate-300" />
              <p className="font-semibold text-slate-600">No reviews to moderate</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {activeTab === 'pending'
                  ? 'All customer feedback has been successfully moderated!'
                  : activeTab === 'approved'
                    ? 'No approved reviews are registered yet.'
                    : 'Customer reviews will appear in this log.'}
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
