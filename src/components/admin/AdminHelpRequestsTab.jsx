import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

export default function AdminHelpRequestsTab() {
  const { user } = useAuth()
  const [helpRequests, setHelpRequests] = useState([])
  const [ambulanceAvailability, setAmbulanceAvailability] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchHelpRequests()
    fetchAmbulanceAvailability()

    // Set up real-time subscriptions
    const helpSubscription = supabase
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

    const availabilitySubscription = supabase
      .channel('admin_help_ambulance_availability_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ambulance_availability',
        },
        () => {
          fetchAmbulanceAvailability()
        }
      )
      .subscribe()

    return () => {
      helpSubscription.unsubscribe()
      availabilitySubscription.unsubscribe()
    }
  }, [])

  const getCurrentHospitalId = () => {
    if (user) {
      if (user.hospital) return user.hospital
      if (user.user_metadata?.hospital) return user.user_metadata.hospital
    }
    return null
  }

  const fetchAmbulanceAvailability = async () => {
    try {
      const currentHospitalId = getCurrentHospitalId()
      if (!currentHospitalId) return

      let { data, error } = await supabase
        .from('ambulance_availability')
        .select('*')
        .eq('hospital_id', currentHospitalId)
        .single()

      if (error && error.code === 'PGRST116') {
        // No row found, initialize with default 10
        const { data: insertData, error: insertError } = await supabase
          .from('ambulance_availability')
          .insert({
            hospital_id: currentHospitalId,
            available_count: 10,
            total_count: 10
          })
          .select()
          .single()

        if (!insertError) {
          setAmbulanceAvailability(insertData)
        }
      } else if (!error && data) {
        setAmbulanceAvailability(data)
      }
    } catch (error) {
      console.error('Error fetching ambulance availability:', error)
    }
  }

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
      const currentHospitalId = getCurrentHospitalId()
      const updateData = {
        status: newStatus
      }

      // If starting a help request, dispatch an ambulance
      if (newStatus === 'in-progress') {
        // Check availability
        const availability = ambulanceAvailability
        if (!availability || availability.available_count <= 0) {
          setError('No ambulances available. Cannot start help request.')
          setUpdating(false)
          return
        }

        // Decrease available count
        const { error: availabilityError } = await supabase
          .from('ambulance_availability')
          .update({
            available_count: availability.available_count - 1,
            updated_at: new Date().toISOString()
          })
          .eq('hospital_id', currentHospitalId)

        if (availabilityError) {
          console.error('Error updating ambulance availability:', availabilityError)
          throw new Error('Failed to dispatch ambulance')
        }
      }

      // If resolving, return ambulance
      if (newStatus === 'resolved') {
        updateData.resolved_at = new Date().toISOString()
        
        // Increase available count (ambulance returns)
        const availability = ambulanceAvailability
        if (availability && currentHospitalId) {
          const { error: availabilityError } = await supabase
            .from('ambulance_availability')
            .update({
              available_count: Math.min(availability.total_count, availability.available_count + 1),
              updated_at: new Date().toISOString()
            })
            .eq('hospital_id', currentHospitalId)

          if (availabilityError) {
            console.error('Error returning ambulance:', availabilityError)
            // Don't throw, just log - the help request should still be resolved
          }
        }
      }

      const { error: updateError } = await supabase
        .from('help_requests')
        .update(updateData)
        .eq('id', requestId)

      if (updateError) {
        console.error('Update error:', updateError)
        throw updateError
      }

      // Refresh the list and availability
      await Promise.all([fetchHelpRequests(), fetchAmbulanceAvailability()])
    } catch (error) {
      console.error('Error updating help request:', error)
      setError(`Failed to update request: ${error.message || 'Please try again.'}`)
    } finally {
      setUpdating(false)
    }
  }

  const handleReject = async (requestId) => {
    if (!window.confirm('Are you sure you want to reject this help request?')) {
      return
    }

    setUpdating(true)
    setError('')

    try {
      const { error: updateError } = await supabase
        .from('help_requests')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (updateError) {
        console.error('Reject error:', updateError)
        throw updateError
      }

      // Refresh the list
      fetchHelpRequests()
    } catch (error) {
      console.error('Error rejecting help request:', error)
      setError(`Failed to reject request: ${error.message || 'Please try again.'}`)
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

  const availableCount = ambulanceAvailability?.available_count ?? 10
  const totalCount = ambulanceAvailability?.total_count ?? 10

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-2">Help Requests</h2>
        <p className="text-text dark:text-gray-300">View and manage patient help requests</p>
      </div>

      {/* Ambulance Availability Info */}
      <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl dark:shadow-2xl p-4 mb-6 border border-red-200/30 dark:border-red-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className={`fas fa-ambulance text-2xl ${
              availableCount === 0 
                ? 'text-red-600 dark:text-red-500' 
                : availableCount <= 3 
                ? 'text-yellow-600 dark:text-yellow-500' 
                : 'text-green-600 dark:text-green-500'
            }`}></i>
            <div>
              <div className="text-sm text-text/70 dark:text-gray-400">Ambulance Availability</div>
              <div className="text-lg font-semibold text-text dark:text-gray-200">
                {availableCount} / {totalCount} available
              </div>
            </div>
          </div>
          <div className="text-xs text-text/60 dark:text-gray-500">
            Starting a help request dispatches an ambulance
          </div>
        </div>
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
                        <>
                          <button
                            onClick={() => handleStatusUpdate(request.id, 'in-progress')}
                            disabled={updating || availableCount === 0}
                            className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            title={availableCount === 0 ? 'No ambulances available' : 'Accept help request and dispatch ambulance'}
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(request.id)}
                            disabled={updating}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
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

