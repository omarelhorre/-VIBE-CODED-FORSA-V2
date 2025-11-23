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
      <div className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start gap-4 mb-6">
            <h2 className="text-2xl font-bold text-secondary dark:text-gray-200 flex-1 min-w-0 break-words">Authentication Required</h2>
            <button
              onClick={onClose}
              className="text-text dark:text-gray-300 hover:text-primary dark:hover:text-primary text-2xl flex-shrink-0"
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
      // Validate user ID - must be a valid UUID for database
      let userId = user.id
      
      // For admin users, we can't use their ID (not a valid UUID)
      // Use the mock user ID or get current Supabase session user
      if (user.role === 'admin') {
        // Try to get the current Supabase session
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user?.id) {
          userId = session.user.id
        } else {
          // For admin users without Supabase session, use mock user ID
          userId = 'a1b2c3d4-e5f6-4789-a012-b3c4d5e6f789'
        }
      }

      // Validate required fields
      if (!patientName.trim()) {
        setError('Please enter a patient name.')
        setLoading(false)
        return
      }

      if (!reason.trim()) {
        setError('Please enter a reason for visit.')
        setLoading(false)
        return
      }

      if (!department || !department.id) {
        setError('Invalid department selected.')
        setLoading(false)
        return
      }

      const { data, error: insertError } = await supabase
        .from('waiting_list')
        .insert({
          user_id: userId,
          patient_name: patientName.trim(),
          department_id: department.id,
          reason: reason.trim(),
          status: 'waiting',
        })
        .select()

      if (insertError) {
        console.error('Insert error details:', insertError)
        // Provide more helpful error messages
        if (insertError.message.includes('row-level security') || insertError.message.includes('RLS')) {
          setError('Failed to join queue. Database permission error. Please check RLS policies.')
        } else if (insertError.message.includes('foreign key') || insertError.message.includes('violates foreign key')) {
          setError('Invalid department selected. Please try again.')
        } else if (insertError.message.includes('null value') || insertError.message.includes('NOT NULL')) {
          setError('Please fill in all required fields.')
        } else {
          setError(insertError.message || 'Failed to join queue. Please try again.')
        }
        setLoading(false)
        return
      }

      // Success - reset form and close modal
      setPatientName('')
      setReason('')
      setError('')
      onClose()
    } catch (err) {
      console.error('Unexpected error:', err)
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start gap-4 mb-6">
          <h2 className="text-2xl font-bold text-secondary dark:text-gray-200 flex-1 min-w-0 break-words">
            Join {department?.name || 'Department'} Queue
          </h2>
          <button
            onClick={onClose}
            className="text-text dark:text-gray-300 hover:text-primary dark:hover:text-primary text-2xl flex-shrink-0"
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

