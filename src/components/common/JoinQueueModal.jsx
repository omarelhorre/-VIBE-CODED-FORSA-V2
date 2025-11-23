import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function JoinQueueModal({ isOpen, onClose, department }) {
  const [patientName, setPatientName] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!isOpen) return null

  // Check authentication before allowing queue join
  if (!user) {
    return (
      <div className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-secondary dark:text-gray-200">Authentication Required</h2>
            <button
              onClick={onClose}
              className="text-text dark:text-gray-300 hover:text-primary dark:hover:text-primary text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-text dark:text-gray-300 mb-6">
            You need to be logged in to join a waiting list. Please sign in to continue.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-text dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                navigate('/login')
                onClose()
              }}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: insertError } = await supabase
        .from('waiting_list')
        .insert({
          user_id: user.id,
          patient_name: patientName,
          department_id: department.id,
          reason: reason,
          status: 'waiting',
        })

      if (insertError) {
        // Provide more helpful error messages
        if (insertError.message.includes('row-level security') || insertError.message.includes('RLS')) {
          setError('Failed to join queue. Database permission error. Please check RLS policies.')
        } else {
          setError(insertError.message || 'Failed to join queue. Please try again.')
        }
        setLoading(false)
        return
      }

      // Reset form and close modal
      setPatientName('')
      setReason('')
      onClose()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary dark:text-gray-200">
            Join {department.name} Queue
          </h2>
          <button
            onClick={onClose}
            className="text-text dark:text-gray-300 hover:text-primary dark:hover:text-primary text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
              Patient Name
            </label>
            <input
              id="patientName"
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Enter patient name"
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
              Reason for Visit
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe the reason for your visit"
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
              disabled={loading}
              className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Join Queue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

