import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

export default function AdminHelpRequestsTab() {
  const { user } = useAuth()
  const [helpRequests, setHelpRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchHelpRequests()

    // Set up real-time subscription
    const subscription = supabase
      .channel('admin_help_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'help_requests',
        },
        () => {
          fetchHelpRequests()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchHelpRequests = async () => {
    try {
      setLoading(true)
      setError('')

      // Get hospital_id from user context
      let currentHospitalId = null
      if (user) {
        if (user.hospital) {
          currentHospitalId = user.hospital
        } else if (user.user_metadata?.hospital) {
          currentHospitalId = user.user_metadata.hospital
        }
      }

      // Build query
      let query = supabase
        .from('help_requests')
        .select('*')
        .order('created_at', { ascending: false })

      // Filter by hospital_id if available
      if (currentHospitalId) {
        try {
          query = query.eq('hospital_id', currentHospitalId)
        } catch (filterError) {
          console.log('hospital_id column may not exist, fetching all requests')
        }
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        // If error is about hospital_id, try without filter
        if (fetchError.message?.includes('hospital_id') || fetchError.code === '42703' || fetchError.code === 'PGRST116') {
          const { data: allData, error: allError } = await supabase
            .from('help_requests')
            .select('*')
            .order('created_at', { ascending: false })
          
          if (allError) throw allError
          
          // Filter client-side if hospital_id exists in data
          let filteredData = allData || []
          if (currentHospitalId && allData && allData.length > 0 && allData[0].hasOwnProperty('hospital_id')) {
            filteredData = allData.filter(item => item.hospital_id === currentHospitalId)
          }
          setHelpRequests(filteredData)
        } else {
          throw fetchError
        }
      } else {
        setHelpRequests(data || [])
      }
    } catch (error) {
      console.error('Error fetching help requests:', error)
      setError(`Failed to load help requests: ${error.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (requestId, newStatus) => {
    setUpdating(true)
    setError('')

    try {
      const updateData = {
        status: newStatus
      }

      if (newStatus === 'resolved') {
        updateData.resolved_at = new Date().toISOString()
      }

      const { error: updateError } = await supabase
        .from('help_requests')
        .update(updateData)
        .eq('id', requestId)

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }

      // Refresh the list
      fetchHelpRequests()
    } catch (error) {
      console.error('Error updating help request:', error)
      setError(`Failed to update request: ${error.message || 'Please try again.'}`)
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (requestId) => {
    if (!window.confirm('Are you sure you want to delete this help request?')) {
      return
    }

    setUpdating(true)
    setError('')

    try {
      const { error: deleteError } = await supabase
        .from('help_requests')
        .delete()
        .eq('id', requestId)

      if (deleteError) {
        console.error('Delete error:', deleteError)
        throw deleteError
      }

      // Refresh the list
      fetchHelpRequests()
    } catch (error) {
      console.error('Error deleting help request:', error)
      setError(`Failed to delete request: ${error.message || 'Please try again.'}`)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700',
      'in-progress': 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      resolved: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700',
      cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700',
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          statusColors[status] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600'
        }`}
      >
        {status?.toUpperCase() || 'UNKNOWN'}
      </span>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
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
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-2">Help Requests</h2>
        <p className="text-text dark:text-gray-300">View and manage patient help requests</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {helpRequests.length === 0 ? (
        <div className="text-center py-12 text-text dark:text-gray-400">
          <i className="fas fa-inbox text-6xl text-gray-300 dark:text-gray-600 mb-4"></i>
          <p className="text-lg">No help requests at this time.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <thead className="bg-gradient-to-r from-red-600 to-red-700 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Patient Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Requested At</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Resolved At</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {helpRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text dark:text-gray-200">{request.patient_name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text dark:text-gray-300 max-w-xs">
                      {request.description ? (
                        <span title={request.description} className="line-clamp-2">
                          {request.description}
                        </span>
                      ) : (
                        <span className="text-text/50 dark:text-gray-500 italic">No description</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text dark:text-gray-300">{formatDate(request.created_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text dark:text-gray-300">{formatDate(request.resolved_at)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {request.status === 'pending' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'in-progress')}
                          disabled={updating}
                          className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all text-sm font-medium disabled:opacity-50"
                        >
                          Start
                        </button>
                      )}
                      {request.status === 'in-progress' && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, 'resolved')}
                          disabled={updating}
                          className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium disabled:opacity-50"
                        >
                          Resolve
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(request.id)}
                        disabled={updating}
                        className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium disabled:opacity-50"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-sm text-text dark:text-gray-300">
        <p>Total requests: <span className="font-semibold">{helpRequests.length}</span></p>
        <p>
          Pending: <span className="font-semibold text-yellow-600 dark:text-yellow-500">
            {helpRequests.filter((r) => r.status === 'pending').length}
          </span>
        </p>
        <p>
          In Progress: <span className="font-semibold text-blue-600 dark:text-blue-500">
            {helpRequests.filter((r) => r.status === 'in-progress').length}
          </span>
        </p>
        <p>
          Resolved: <span className="font-semibold text-green-600 dark:text-green-500">
            {helpRequests.filter((r) => r.status === 'resolved').length}
          </span>
        </p>
      </div>
    </div>
  )
}

