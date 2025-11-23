import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import LoadingSpinner from '../common/LoadingSpinner'

// Simple Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, width: '100vw', height: '100vh' }}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl max-w-2xl w-full p-6 border border-gray-200 dark:border-gray-700 my-8 relative z-[101] max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary dark:text-gray-200">{title}</h2>
          <button onClick={onClose} className="text-text dark:text-gray-300 hover:text-primary dark:hover:text-primary text-2xl">×</button>
        </div>
        {children}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

export default function ReviewForm({ onClose, onSuccess }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { hospitalId } = useParams()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [doctors, setDoctors] = useState([])
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [formData, setFormData] = useState({
    reviewer_name: user?.email?.split('@')[0] || '',
    rating: '',
    content: '',
    doctor_id: ''
  })

  useEffect(() => {
    fetchDoctors()
  }, [])

  // If not authenticated, redirect to login
  if (!user) {
    navigate(`/login?redirect=/hospital/${hospitalId}`)
    return null
  }

  const fetchDoctors = async () => {
    try {
      setLoadingDoctors(true)
      const { data, error } = await supabase
        .from('doctors')
        .select('id, name, specialization')
        .order('name')

      if (error) throw error
      setDoctors(data || [])
    } catch (error) {
      console.error('Error fetching doctors:', error)
      setDoctors([])
    } finally {
      setLoadingDoctors(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    setSubmitting(true)

    try {
      if (!formData.content.trim()) {
        setError('Please enter review content')
        setSubmitting(false)
        return
      }

      if (!formData.rating) {
        setError('Please select a rating')
        setSubmitting(false)
        return
      }

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
      
      // Require hospital_id to submit a review
      if (!currentHospitalId) {
        setError('Hospital information is required to submit a review')
        setSubmitting(false)
        return
      }
      
      // Insert review into database
      const reviewData = {
        reviewer_name: formData.reviewer_name || user?.email?.split('@')[0] || 'Anonymous',
        rating: formData.rating ? parseInt(formData.rating) : null,
        content: formData.content,
        hospital_id: currentHospitalId,
        user_id: user?.id || null
      }

      // Add doctor_id only if a doctor was selected
      if (formData.doctor_id) {
        reviewData.doctor_id = formData.doctor_id
      }

      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select()

      if (error) {
        console.error('Review insert error:', error)
        throw error
      }

      console.log('Review submitted successfully:', data)
      onSuccess()
    } catch (err) {
      setError(`Failed to submit review: ${err.message || 'Please try again.'}`)
      console.error('Error submitting review:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Submit Review">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      {submitting ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reviewer_name" className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
              Your Name
            </label>
            <input
              id="reviewer_name"
              name="reviewer_name"
              type="text"
              value={formData.reviewer_name}
              onChange={handleChange}
              placeholder={user.email?.split('@')[0] || 'Optional'}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="doctor_id" className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
              Review a Doctor (Optional)
            </label>
            {loadingDoctors ? (
              <div className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 rounded-lg flex items-center justify-center">
                <LoadingSpinner />
              </div>
            ) : (
              <select
                id="doctor_id"
                name="doctor_id"
                value={formData.doctor_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option value="">General Hospital Review</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
              Rating (1-5) *
            </label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">Select a rating</option>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
              Review Content *
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={6}
              placeholder="Write your review here..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-text dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  )
}
