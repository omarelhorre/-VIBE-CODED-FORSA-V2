import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, useParams } from 'react-router-dom'
import LoadingSpinner from '../common/LoadingSpinner'

// Simple Modal Component
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary">{title}</h2>
          <button onClick={onClose} className="text-text hover:text-primary text-2xl">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ReviewForm({ onClose, onSuccess }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { hospitalId } = useParams()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    reviewer_name: user?.email?.split('@')[0] || '',
    rating: '',
    content: ''
  })

  // If not authenticated, redirect to login
  if (!user) {
    navigate(`/login?redirect=/hospital/${hospitalId}`)
    return null
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
      // This would insert into reviews table when implemented
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 500))
      
      onSuccess()
    } catch (err) {
      setError('Failed to submit review. Please try again.')
      console.error('Error submitting review:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} title="Submit Review">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
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
            <label htmlFor="reviewer_name" className="block text-sm font-medium text-text mb-2">
              Your Name
            </label>
            <input
              id="reviewer_name"
              name="reviewer_name"
              type="text"
              value={formData.reviewer_name}
              onChange={handleChange}
              placeholder={user.email?.split('@')[0] || 'Optional'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-text mb-2">
              Rating (1-5)
            </label>
            <select
              id="rating"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            >
              <option value="">No rating</option>
              <option value="5">5 - Excellent</option>
              <option value="4">4 - Very Good</option>
              <option value="3">3 - Good</option>
              <option value="2">2 - Fair</option>
              <option value="1">1 - Poor</option>
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-text mb-2">
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors"
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
