import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import LoadingSpinner from '../common/LoadingSpinner'

export default function AmbulanceRequestModal({ isOpen, onClose }) {
  const { user } = useAuth()
  const { hospitalId } = useParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    patient_name: user?.email?.split('@')[0] || '',
    location: '',
    description: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [availability, setAvailability] = useState(null)
  const [checkingAvailability, setCheckingAvailability] = useState(true)

  useEffect(() => {
    if (isOpen) {
      checkAvailability()
    } else {
      // Reset form when modal closes
      setFormData({
        patient_name: user?.email?.split('@')[0] || '',
        location: '',
        description: ''
      })
      setError('')
      setSuccess(false)
    }
  }, [isOpen, user])

  const checkAvailability = async () => {
    setCheckingAvailability(true)
    try {
      const currentHospitalId = hospitalId || user?.hospital || user?.user_metadata?.hospital
      if (!currentHospitalId) {
        setAvailability({ available_count: 0, total_count: 10 })
        setCheckingAvailability(false)
        return
      }

      let { data, error } = await supabase
        .from('ambulance_availability')
        .select('*')
        .eq('hospital_id', currentHospitalId)
        .single()

      if (error && error.code === 'PGRST116') {
        // Not initialized yet, default to 10
        setAvailability({ available_count: 10, total_count: 10 })
      } else if (error) {
        throw error
      } else {
        setAvailability(data || { available_count: 10, total_count: 10 })
      }
    } catch (error) {
      console.error('Error checking availability:', error)
      setAvailability({ available_count: 10, total_count: 10 }) // Default fallback
    } finally {
      setCheckingAvailability(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (!user) {
        navigate(`/login?redirect=/hospital/${hospitalId}`)
        return
      }

      if (!formData.patient_name.trim()) {
        setError('Please enter patient name')
        setSubmitting(false)
        return
      }

      const currentHospitalId = hospitalId || user?.hospital || user?.user_metadata?.hospital
      if (!currentHospitalId) {
        setError('Hospital information is required')
        setSubmitting(false)
        return
      }

      // Check availability again before submitting
      const { data: availData } = await supabase
        .from('ambulance_availability')
        .select('available_count')
        .eq('hospital_id', currentHospitalId)
        .single()

      const availableCount = availData?.available_count ?? 10
      if (availableCount <= 0) {
        setError('No ambulances available at this time. Please try again later.')
        setSubmitting(false)
        await checkAvailability() // Refresh availability
        return
      }

      // Submit request
      const { data, error: submitError } = await supabase
        .from('ambulance_requests')
        .insert({
          hospital_id: currentHospitalId,
          user_id: user.id,
          patient_name: formData.patient_name.trim(),
          location: formData.location.trim() || null,
          description: formData.description.trim() || null,
          status: 'pending'
        })
        .select()
        .single()

      if (submitError) throw submitError

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setSuccess(false)
      }, 2000)
    } catch (err) {
      console.error('Error submitting ambulance request:', err)
      setError(`Failed to submit request: ${err.message || 'Please try again.'}`)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700 my-8 relative z-[101] max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary dark:text-gray-200">Request Ambulance</h2>
          <button onClick={onClose} className="text-text dark:text-gray-300 hover:text-primary dark:hover:text-primary text-2xl">×</button>
        </div>

        {checkingAvailability ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            {/* Availability Status */}
            {availability && (
              <div className={`mb-6 p-4 rounded-lg border ${
                availability.available_count === 0
                  ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'
                  : availability.available_count <= 3
                  ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800'
                  : 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800'
              }`}>
                <div className="flex items-center gap-3">
                  <i className={`fas fa-ambulance text-2xl ${
                    availability.available_count === 0
                      ? 'text-red-600 dark:text-red-500'
                      : availability.available_count <= 3
                      ? 'text-yellow-600 dark:text-yellow-500'
                      : 'text-green-600 dark:text-green-500'
                  }`}></i>
                  <div>
                    <div className="font-semibold text-text dark:text-gray-200">
                      {availability.available_count === 0
                        ? 'No ambulances available'
                        : `${availability.available_count} ambulance${availability.available_count !== 1 ? 's' : ''} available`
                      }
                    </div>
                    <div className="text-sm text-text/70 dark:text-gray-400">
                      Out of {availability.total_count} total
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-check text-green-600 dark:text-green-500 text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-text dark:text-gray-200 mb-2">Request Submitted!</h3>
                <p className="text-text dark:text-gray-300">Your ambulance request has been submitted successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="patient_name" className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
                    Patient Name *
                  </label>
                  <input
                    id="patient_name"
                    name="patient_name"
                    type="text"
                    value={formData.patient_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Enter patient name"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Enter location (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                    placeholder="Describe the emergency situation (optional)"
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
                    disabled={submitting || (availability && availability.available_count === 0)}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    {submitting ? 'Submitting...' : 'Request Ambulance'}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}

