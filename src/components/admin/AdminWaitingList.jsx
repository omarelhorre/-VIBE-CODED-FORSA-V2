import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import LoadingSpinner from '../common/LoadingSpinner'

export default function AdminWaitingList() {
  const [waitingList, setWaitingList] = useState([])
  const [departments, setDepartments] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWaitingList()
    fetchDepartments()

    // Set up real-time subscription
    const subscription = supabase
      .channel('admin_waiting_list_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waiting_list',
        },
        () => {
          fetchWaitingList()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')

      if (error) throw error

      const deptMap = {}
      data?.forEach((dept) => {
        deptMap[dept.id] = dept.name
      })
      setDepartments(deptMap)
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const fetchWaitingList = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('waiting_list')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setWaitingList(data || [])
      setError('')
    } catch (error) {
      console.error('Error fetching waiting list:', error)
      setError('Failed to load waiting list. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status) => {
    const statusColors = {
      waiting: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
    }

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
          statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300'
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
        <h2 className="text-2xl font-bold text-secondary mb-2">Waiting List Entries</h2>
        <p className="text-text">View and manage all patients in the waiting list</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {waitingList.length === 0 ? (
        <div className="text-center py-12 text-text">
          <p className="text-lg">No patients in the waiting list.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-sm border border-gray-200">
            <thead className="bg-gradient-to-r from-primary to-accent text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Patient Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Department</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Reason</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {waitingList.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-text">{entry.patient_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">
                      {departments[entry.department_id] || 'Unknown Department'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-text max-w-xs truncate" title={entry.reason}>
                      {entry.reason || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(entry.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-text">{formatDate(entry.created_at)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-sm text-text">
        <p>Total entries: <span className="font-semibold">{waitingList.length}</span></p>
        <p>
          Waiting: <span className="font-semibold text-yellow-600">
            {waitingList.filter((e) => e.status === 'waiting').length}
          </span>
        </p>
      </div>
    </div>
  )
}

