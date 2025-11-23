import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import JoinQueueModal from '../common/JoinQueueModal'
import LoadingSpinner from '../common/LoadingSpinner'

export default function WaitingListTab() {
  const [departments, setDepartments] = useState([])
  const [waitingCounts, setWaitingCounts] = useState({})
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDepartments()
    fetchWaitingCounts()

    // Set up real-time subscription
    const subscription = supabase
      .channel('waiting_list_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'waiting_list',
        },
        () => {
          fetchWaitingCounts()
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
        .select('*')
        .order('name')

      if (error) throw error
      setDepartments(data || [])
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchWaitingCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('waiting_list')
        .select('department_id, status')
        .eq('status', 'waiting')

      if (error) throw error

      const counts = {}
      data?.forEach((item) => {
        counts[item.department_id] = (counts[item.department_id] || 0) + 1
      })

      setWaitingCounts(counts)
    } catch (error) {
      console.error('Error fetching waiting counts:', error)
    }
  }

  const getQueueStatus = (count, capacity) => {
    const percentage = (count / capacity) * 100
    if (percentage >= 80) return 'critical'
    if (percentage >= 50) return 'warning'
    return 'good'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700'
      case 'warning':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700'
      default:
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700'
    }
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
        <h2 className="text-2xl font-bold text-secondary dark:text-gray-200 mb-2">Department Waiting Lists</h2>
        <p className="text-text dark:text-gray-300">Join a queue for the department you need</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const count = waitingCounts[dept.id] || 0
          const status = getQueueStatus(count, dept.capacity)

          return (
            <div
              key={dept.id}
              className={`border-2 rounded-xl p-6 hover:shadow-lg transition-all bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm ${getStatusColor(
                status
              )} dark:border-gray-700/50`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1 dark:text-gray-200">{dept.name}</h3>
                  <p className="text-sm opacity-80 dark:text-gray-400">{dept.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold dark:text-gray-200">{count}</div>
                  <div className="text-sm dark:text-gray-400">waiting</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1 dark:text-gray-300">
                  <span>Capacity:</span>
                  <span className="font-semibold">{dept.capacity}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      status === 'critical'
                        ? 'bg-red-500'
                        : status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min((count / dept.capacity) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDepartment(dept)}
                className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-accent transition-colors"
              >
                Join Queue
              </button>
            </div>
          )
        })}
      </div>

      {departments.length === 0 && (
        <div className="text-center py-12 text-text dark:text-gray-400">
          <p>No departments available at the moment.</p>
        </div>
      )}

      <JoinQueueModal
        isOpen={selectedDepartment !== null}
        onClose={() => setSelectedDepartment(null)}
        department={selectedDepartment}
      />
    </div>
  )
}

