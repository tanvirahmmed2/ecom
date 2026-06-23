'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { 
  BiStar, 
  BiLoaderAlt, 
  BiCommentDetail, 
  BiArrowBack,
  BiTrendingUp,
  BiSolidQuoteLeft
} from 'react-icons/bi'

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get('/api/review')
        setReviews(res.data)
      } catch (err) {
        console.error("Failed to load approved reviews:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  // Calculate average rating
  const reviewCount = reviews.length
  const averageRating = reviewCount > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1)
    : '0.0'

  // Rating breakdowns
  const ratingDistribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter(r => r.rating === stars).length
    const percentage = reviewCount > 0 ? ((count / reviewCount) * 100).toFixed(0) : 0
    return { stars, count, percentage }
  })

  const renderStars = (count, size = "text-sm") => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {[1, 2, 3, 4, 5].map((star) => (
          <BiStar key={star} className={`${size} ${star <= count ? 'fill-amber-500' : 'text-slate-200'}`} />
        ))}
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">
        
        {/* Banner Block */}
        <div className="text-center flex flex-col items-center gap-2 max-w-2xl mx-auto">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight sm:text-4xl">
            Customer Testimonials
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed mt-1.5">
            Read comments and feedback left by our verified purchasers about our store products and catalog service.
          </p>
          <Link href="/" className="mt-4 px-4 py-2 border border-slate-200 text-slate-600 bg-white rounded-xl text-xs font-semibold hover:bg-slate-50 transition cursor-pointer flex items-center gap-1.5 shadow-xs">
            <BiArrowBack /> Back to Shop
          </Link>
        </div>

        {loading ? (
          <div className="w-full py-24 flex flex-col items-center justify-center text-slate-400 gap-1.5">
            <BiLoaderAlt className="animate-spin text-4xl text-slate-900" />
            <span className="text-xs font-medium">Loading testimonials...</span>
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Rating Stats Summary Panel (Left) */}
            <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col gap-6 sticky top-24">
              <div className="text-center pb-6 border-b border-slate-100">
                <span className="text-5xl font-extrabold text-slate-800">{averageRating}</span>
                <div className="flex justify-center mt-2">
                  {renderStars(Math.round(parseFloat(averageRating)), "text-lg")}
                </div>
                <p className="text-slate-400 text-xs mt-2 font-medium">Based on {reviewCount} verified reviews</p>
              </div>

              {/* Score breakdown bars */}
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Rating Distribution</h3>
                {ratingDistribution.map(({ stars, count, percentage }) => (
                  <div key={stars} className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="w-3 text-right">{stars}★</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right font-mono">{percentage}%</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3 mt-2">
                <BiTrendingUp className="text-xl text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xxs text-slate-500 leading-relaxed">
                  <span className="font-bold text-slate-700 block mb-0.5">Trust & Quality</span>
                  100% of these testimonials are submitted by verified accounts and moderated by store staff.
                </div>
              </div>
            </div>

            {/* Testimonials Stream (Right) */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => {
                const initials = rev.user_name
                  ? rev.user_name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
                  : 'US'
                return (
                  <div 
                    key={rev.review_id}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between gap-5 hover:shadow-md transition hover:-translate-y-0.5 duration-300"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        {renderStars(rev.rating)}
                        <BiSolidQuoteLeft className="text-slate-200 text-2xl" />
                      </div>
                      
                      <h3 className="font-bold text-slate-800 text-sm leading-snug">{rev.title}</h3>
                      {rev.comment && (
                        <div 
                          className="text-slate-600 text-xs leading-relaxed italic ProseMirror"
                          dangerouslySetInnerHTML={{ __html: rev.comment }}
                        />
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-805 text-xs block truncate leading-none">{rev.user_name}</span>
                        <span className="text-xxs text-slate-400 block mt-1 leading-none">
                          {rev.user_role === 'user' ? 'Customer' : rev.user_role || 'Verified User'} • {new Date(rev.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-24 flex flex-col items-center justify-center text-slate-400 gap-2 text-center p-6">
            <BiCommentDetail className="text-5xl text-slate-300" />
            <h3 className="font-bold text-slate-600 text-sm">No testimonials published yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mt-0.5">
              Verified customer reviews will appear on this wall once approved by our moderation team.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
