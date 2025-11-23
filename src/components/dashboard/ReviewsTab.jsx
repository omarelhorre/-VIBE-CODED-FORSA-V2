import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import ReviewForm from './ReviewForm'
import LoadingSpinner from '../common/LoadingSpinner'
import Button from '../common/Button'

export default function ReviewsTab() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { hospitalId } = useParams()
  const [reviews, setReviews] = useState([])
  const [doctorsMap, setDoctorsMap] = useState({})
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctors()
    fetchReviews()

    // Set up real-time subscription
    const subscription = supabase
      .channel('reviews_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
        },
        () => {
          fetchReviews()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [hospitalId])

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialization')

      if (error) {
        console.error('Error fetching doctors:', error)
        return
      }

      // Create a map of doctor_id -> doctor info
      const map = {}
      data?.forEach(doctor => {
        map[doctor.id] = doctor
      })
      setDoctorsMap(map)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    }
  }

  const fetchReviews = async () => {
    try {
      setLoading(true)
      // Get hospital_id from URL or user context
      let currentHospitalId = hospitalId
      
      // If no hospitalId in URL, try to get from user context (for admin users)
      if (!currentHospitalId && user) {
        if (user.hospital) {
          currentHospitalId = user.hospital
        } else if (user.user_metadata?.hospital) {
          currentHospitalId = user.user_metadata.hospital
        }
      }
      
      // Build query
      let query = supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false })

      // Filter by hospital_id if available
      if (currentHospitalId) {
        try {
          query = query.eq('hospital_id', currentHospitalId)
        } catch (filterError) {
          // If hospital_id column doesn't exist, fetch all reviews
          console.log('hospital_id column may not exist, fetching all reviews')
        }
      }

      const { data, error } = await query

      if (error) {
        // If error is about hospital_id, try without filter
        if (error.message?.includes('hospital_id') || error.code === '42703' || error.code === 'PGRST116') {
          const { data: allData, error: allError } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (allError) throw allError
          
          // Filter client-side if hospital_id exists in data and we have a currentHospitalId
          let filteredData = allData || []
          if (currentHospitalId && allData && allData.length > 0 && allData[0].hasOwnProperty('hospital_id')) {
            filteredData = allData.filter(item => item.hospital_id === currentHospitalId)
          }
          setReviews(filteredData)
        } else {
          throw error
        }
      } else {
        // If no hospitalId, show all reviews (or empty if filtering is needed)
        if (!currentHospitalId && data && data.length > 0 && data[0].hasOwnProperty('hospital_id')) {
          // If we have hospital_id column but no currentHospitalId, show empty
          setReviews([])
        } else {
          setReviews(data || [])
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = () => {
    if (!user) {
      navigate('/login')
      return
    }
    setShowReviewForm(true)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-secondary dark:text-gray-200 mb-2">Reviews</h2>
          <p className="text-text dark:text-gray-300">Read and submit reviews for this hospital</p>
        </div>
        <button
          onClick={handleSubmitReview}
          className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          Submit Review
        </button>
      </div>

      {showReviewForm && (
        <ReviewForm
          onClose={() => setShowReviewForm(false)}
          onSuccess={() => {
            setShowReviewForm(false)
            fetchReviews()
          }}
        />
      )}

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12 text-text dark:text-gray-400">
            <p>No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl p-6 border border-primary/10 dark:border-gray-700/50 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-secondary dark:text-gray-200">{review.reviewer_name}</h3>
                  <p className="text-sm text-text/70 dark:text-gray-400">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  {review.doctor_id && doctorsMap[review.doctor_id] && (
                    <p className="text-sm text-primary dark:text-primary font-medium mt-1">
                      Review for: {doctorsMap[review.doctor_id].name} - {doctorsMap[review.doctor_id].specialization}
                    </p>
                  )}
                </div>
                {review.rating && (
                  <div className="text-primary dark:text-primary font-semibold">
                    {review.rating}/5
                  </div>
                )}
              </div>
              <p className="text-text dark:text-gray-300">{review.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

