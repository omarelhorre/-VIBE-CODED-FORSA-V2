import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabaseClient'
import LoadingSpinner from '../common/LoadingSpinner'

// Simple Modal Component
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-700" 
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default function RequestHelpModal({ isOpen, onClose }) {
  const { hospitalId } = useParams()
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [description, setDescription] = useState('')

  // Check authentication when modal opens
  useEffect(() => {
    if (isOpen && !authLoading && !user) {
      // Redirect to login with current path as redirect parameter
      navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`)
      onClose()
    }
  }, [isOpen, user, authLoading, navigate, location.pathname, onClose])

  // Get hospital name
  const hospitals = {
    'saniat-rmel': 'Saniat Rmel Hospital',
    'mohammed-6': 'Tetouan Medical center',
  }

  // Try to get hospital name and ID from URL, user context, or default
  let hospitalName = hospitals[hospitalId]
  let currentHospitalId = hospitalId
  
  if (!hospitalName && user) {
    if (user.hospitalName) {
      hospitalName = user.hospitalName
    } else if (user.hospital) {
      currentHospitalId = user.hospital
      hospitalName = hospitals[user.hospital] || user.hospital
    }
  }

  // Fallback if still no name
  if (!hospitalName) {
    hospitalName = 'Hospital'
  }
  if (!currentHospitalId) {
    currentHospitalId = 'saniat-rmel' // Default fallback
  }

  const handleRequestClick = () => {
    setShowConfirmation(true)
    setError('')
  }

  const handleConfirm = async () => {
    setSubmitting(true)
    setError('')

    try {
      const patientName = user?.email?.split('@')[0] || user?.user_metadata?.full_name || 'Patient'

      const { data, error: insertError } = await supabase
        .from('help_requests')
        .insert({
          hospital_id: currentHospitalId,
          patient_name: patientName,
          description: description.trim() || null,
          user_id: user?.id || null,
          status: 'pending'
        })
        .select()

      if (insertError) {
        console.error('Error submitting help request:', insertError)
        throw insertError
      }

      console.log('Help request submitted successfully:', data)
      setShowConfirmation(false)
      setShowSuccess(true)
      // Auto-close after 3 seconds
      setTimeout(() => {
        handleClose()
      }, 3000)
    } catch (err) {
      console.error('Error submitting help request:', err)
      setError(`Failed to submit help request: ${err.message || 'Please try again.'}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowConfirmation(false)
    setError('')
    setDescription('')
  }

  const handleClose = () => {
    setShowConfirmation(false)
    setShowSuccess(false)
    setError('')
    setDescription('')
    onClose()
  }

  // Success message
  if (showSuccess) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="text-center">
          <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center mb-3">
              <i className="fas fa-check-circle text-green-600 dark:text-green-400 text-3xl"></i>
            </div>
            <p className="text-lg font-semibold text-green-800 dark:text-green-300">
              Help is on their way!
            </p>
            <p className="text-sm text-green-700 dark:text-green-400 mt-2">
              Medical staff will be with you shortly.
            </p>
          </div>
          
          <button
            onClick={handleClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Close
          </button>
        </div>
      </Modal>
    )
  }

  // Confirmation step
  if (showConfirmation) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div>
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-exclamation-triangle text-red-600 dark:text-red-400 text-4xl"></i>
            </div>
            
            <h2 className="text-2xl font-bold text-secondary dark:text-gray-200 mb-4">
              Confirm Help Request
            </h2>
            
            <div className="mb-4">
              <p className="text-text dark:text-gray-300 mb-2">Request help from</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-500">
                {hospitalName}
              </p>
            </div>
          </div>

          {description && (
            <div className="mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <p className="text-sm font-medium text-text dark:text-gray-300 mb-2">Description:</p>
              <p className="text-sm text-text dark:text-gray-300 whitespace-pre-wrap">{description}</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              onClick={handleCancel}
              disabled={submitting}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-text dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Submitting...</span>
                </>
              ) : (
                'Confirm Request'
              )}
            </button>
          </div>
        </div>
      </Modal>
    )
  }

  // Show loading if checking auth
  if (authLoading) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose}>
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      </Modal>
    )
  }

  // Don't show modal if user is not authenticated (will redirect)
  if (!user) {
    return null
  }

  // Initial request step
  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div>
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-red-600 dark:text-red-400 text-4xl"></i>
          </div>
          
          <h2 className="text-2xl font-bold text-secondary dark:text-gray-200 mb-4">
            Request Help
          </h2>
          
          <div className="mb-6">
            <p className="text-text dark:text-gray-300 mb-2">Request help from</p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-500">
              {hospitalName}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Please describe what kind of help you need..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
          />
          <p className="text-xs text-text/70 dark:text-gray-400 mt-1">
            Provide details about your situation to help staff assist you better.
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-text dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleRequestClick}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  )
}

