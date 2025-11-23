import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

export default function AdminAmbulanceTab() {
  const { user } = useAuth()
  const [ambulanceRequests, setAmbulanceRequests] = useState([])
  const [helpRequests, setHelpRequests] = useState([])
  const [ambulanceAvailability, setAmbulanceAvailability] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchAmbulanceData()
    fetchHelpRequests()

    // Set up real-time subscriptions
    const ambulanceRequestsSubscription = supabase
      .channel('admin_ambulance_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ambulance_requests',
        },
        () => {
          fetchAmbulanceData()
        }
      )
      .subscribe()

    const helpRequestsSubscription = supabase
      .channel('admin_help_requests_changes_ambulance')
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
      .channel('admin_ambulance_availability_changes')
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
      ambulanceRequestsSubscription.unsubscribe()
      helpRequestsSubscription.unsubscribe()
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

  const fetchAmbulanceData = async () => {
    await Promise.all([fetchAmbulanceRequests(), fetchAmbulanceAvailability()])
  }

  const fetchHelpRequests = async () => {
    try {
      const currentHospitalId = getCurrentHospitalId()
      let query = supabase
        .from('help_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (currentHospitalId) {
        try {
          query = query.eq('hospital_id', currentHospitalId)
        } catch (filterError) {
          console.log('hospital_id column may not exist')
        }
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        // Try without filter if error
        const { data: allData, error: allError } = await supabase
          .from('help_requests')
          .select('*')
          .order('created_at', { ascending: false })
        
        if (allError) {
          console.error('Error fetching help requests:', allError)
          setHelpRequests([])
          return
        }
        
        // Filter client-side if hospital_id exists
        let filteredData = allData || []
        if (currentHospitalId && allData && allData.length > 0 && allData[0].hasOwnProperty('hospital_id')) {
          filteredData = allData.filter(item => item.hospital_id === currentHospitalId)
        }
        setHelpRequests(filteredData)
      } else {
        setHelpRequests(data || [])
      }
    } catch (error) {
      console.error('Error fetching help requests:', error)
      setHelpRequests([])
    }
  }

  const fetchAmbulanceRequests = async () => {
    try {
      setLoading(true)
      setError('')

      const currentHospitalId = getCurrentHospitalId()
      let query = supabase
        .from('ambulance_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (currentHospitalId) {
        query = query.eq('hospital_id', currentHospitalId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError
      setAmbulanceRequests(data || [])
    } catch (error) {
      console.error('Error fetching ambulance requests:', error)
      setError(`Failed to load ambulance requests: ${error.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchAmbulanceAvailability = async () => {
    try {
      const currentHospitalId = getCurrentHospitalId()
      if (!currentHospitalId) return

      // Try to fetch existing availability
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

        if (insertError) throw insertError
        setAmbulanceAvailability(insertData)
      } else if (error) {
        throw error
      } else {
        setAmbulanceAvailability(data)
      }
    } catch (error) {
      console.error('Error fetching ambulance availability:', error)
      // Initialize if doesn't exist
      const currentHospitalId = getCurrentHospitalId()
      if (currentHospitalId) {
        try {
          const { data, error: insertError } = await supabase
            .from('ambulance_availability')
            .insert({
              hospital_id: currentHospitalId,
              available_count: 10,
              total_count: 10
            })
            .select()
            .single()

          if (insertError) throw insertError
          setAmbulanceAvailability(data)
        } catch (initError) {
          console.error('Error initializing ambulance availability:', initError)
        }
      }
    }
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
        <h2 className="text-2xl font-bold text-red-600 dark:text-red-500 mb-2">Ambulance Management</h2>
        <p className="text-text dark:text-gray-300">View ambulance availability and recent activity</p>
      </div>

      {/* Ambulance Availability Card */}
      <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl dark:shadow-2xl p-6 mb-6 border border-red-200/30 dark:border-red-900/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text dark:text-gray-200 mb-2">Ambulance Availability</h3>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-3xl font-bold text-red-600 dark:text-red-500">{availableCount}</span>
                <span className="text-text dark:text-gray-400 ml-2">available</span>
              </div>
              <div className="text-text/60 dark:text-gray-500">/</div>
              <div>
                <span className="text-xl font-semibold text-text dark:text-gray-300">{totalCount}</span>
                <span className="text-text dark:text-gray-400 ml-2">total</span>
              </div>
            </div>
          </div>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            availableCount === 0 
              ? 'bg-red-100 dark:bg-red-900/30' 
              : availableCount <= 3 
              ? 'bg-yellow-100 dark:bg-yellow-900/30' 
              : 'bg-green-100 dark:bg-green-900/30'
          }`}>
            <i className={`fas fa-ambulance text-4xl ${
              availableCount === 0 
                ? 'text-red-600 dark:text-red-500' 
                : availableCount <= 3 
                ? 'text-yellow-600 dark:text-yellow-500' 
                : 'text-green-600 dark:text-green-500'
            }`}></i>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Activity Log Section */}
      <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl dark:shadow-2xl p-6 mb-6 border border-red-200/30 dark:border-red-900/50">
        <h3 className="text-lg font-semibold text-text dark:text-gray-200 mb-4 flex items-center gap-2">
          <i className="fas fa-history text-red-600 dark:text-red-500"></i>
          Recent Activity
        </h3>
        <div className="space-y-3">
          {(() => {
            // Combine ambulance requests and help requests, sort by time
            const allActivities = [
              ...ambulanceRequests.map(req => ({ 
                ...req, 
                type: 'ambulance', 
                timestamp: req.created_at || req.requested_at 
              })),
              ...helpRequests
                .filter(req => req.status === 'in-progress' || req.status === 'resolved')
                .map(req => ({ 
                  ...req, 
                  type: 'help', 
                  timestamp: req.created_at 
                }))
            ]
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .slice(0, 20)

            if (allActivities.length === 0) {
              return <p className="text-text/60 dark:text-gray-400 text-sm">No activity yet</p>
            }

            return allActivities.map((activity) => {
              const isAmbulance = activity.type === 'ambulance'
              const isHelp = activity.type === 'help'
              
              // Determine status color
              let statusColor = 'bg-gray-500'
              let statusBg = 'bg-gray-100 dark:bg-gray-800'
              let statusText = 'text-gray-800 dark:text-gray-300'
              
              if (isAmbulance) {
                if (activity.status === 'pending') {
                  statusColor = 'bg-yellow-500'
                  statusBg = 'bg-yellow-100 dark:bg-yellow-900/30'
                  statusText = 'text-yellow-800 dark:text-yellow-300'
                } else if (activity.status === 'dispatched') {
                  statusColor = 'bg-purple-500'
                  statusBg = 'bg-purple-100 dark:bg-purple-900/30'
                  statusText = 'text-purple-800 dark:text-purple-300'
                } else if (activity.status === 'completed') {
                  statusColor = 'bg-green-500'
                  statusBg = 'bg-green-100 dark:bg-green-900/30'
                  statusText = 'text-green-800 dark:text-green-300'
                } else if (activity.status === 'rejected') {
                  statusColor = 'bg-red-500'
                  statusBg = 'bg-red-100 dark:bg-red-900/30'
                  statusText = 'text-red-800 dark:text-red-300'
                }
              } else if (isHelp) {
                if (activity.status === 'in-progress') {
                  statusColor = 'bg-blue-500'
                  statusBg = 'bg-blue-100 dark:bg-blue-900/30'
                  statusText = 'text-blue-800 dark:text-blue-300'
                } else if (activity.status === 'resolved') {
                  statusColor = 'bg-green-500'
                  statusBg = 'bg-green-100 dark:bg-green-900/30'
                  statusText = 'text-green-800 dark:text-green-300'
                }
              }

              return (
                <div key={`${activity.type}-${activity.id}`} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${statusColor}`}></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-semibold text-sm text-text dark:text-gray-200">{activity.patient_name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusBg} ${statusText}`}>
                        {isAmbulance ? '🚑 Ambulance' : '🆘 Help'} • {activity.status}
                      </span>
                    </div>
                    {activity.description && (
                      <p className="text-xs text-text/70 dark:text-gray-400 mb-1 line-clamp-1">{activity.description}</p>
                    )}
                    {activity.location && (
                      <p className="text-xs text-text/60 dark:text-gray-500 mb-1">
                        <i className="fas fa-map-marker-alt mr-1"></i>
                        {activity.location}
                      </p>
                    )}
                    <p className="text-xs text-text/50 dark:text-gray-500">
                      <i className="far fa-clock mr-1"></i>
                      {formatDate(activity.timestamp)}
                      {isAmbulance && activity.dispatched_at && (
                        <span className="ml-2">
                          • Dispatched: {formatDate(activity.dispatched_at)}
                        </span>
                      )}
                      {isAmbulance && activity.completed_at && (
                        <span className="ml-2">
                          • Completed: {formatDate(activity.completed_at)}
                        </span>
                      )}
                      {isHelp && activity.resolved_at && (
                        <span className="ml-2">
                          • Resolved: {formatDate(activity.resolved_at)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )
            })
          })()}
        </div>
      </div>

    </div>
  )
}

