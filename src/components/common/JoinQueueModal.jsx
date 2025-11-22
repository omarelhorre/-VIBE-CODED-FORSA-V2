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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-secondary">Authentication Required</h2>
            <button
              onClick={onClose}
              className="text-text hover:text-primary text-2xl"
            >
              ×
            </button>
          </div>
          <p className="text-text mb-6">
            You need to be logged in to join a waiting list. Please sign in to continue.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors"
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
    <div className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary">
            Join {department.name} Queue
          </h2>
          <button
            onClick={onClose}
            className="text-text hover:text-primary text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-text mb-2">
              Patient Name
            </label>
            <input
              id="patientName"
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Enter patient name"
            />
          </div>

          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-text mb-2">
              Reason for Visit
            </label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
              placeholder="Describe the reason for your visit"
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

