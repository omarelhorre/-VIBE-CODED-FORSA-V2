import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

export default function AdminBloodBankTab() {
  const { user } = useAuth()
  const [bloodBank, setBloodBank] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingItem, setEditingItem] = useState(null)
  const [units, setUnits] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchBloodBank()

    // Set up real-time subscription
    const subscription = supabase
      .channel('admin_blood_bank_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blood_bank',
        },
        () => {
          fetchBloodBank()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchBloodBank = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Use the same simple query as the patient dashboard
      const { data, error } = await supabase
        .from('blood_bank')
        .select('*')
        .order('blood_type')

      if (error) throw error
      
      setBloodBank(data || [])
      setError('')
    } catch (error) {
      console.error('Error fetching blood bank:', error)
      setError(`Failed to load blood bank data: ${error.message || 'Please try again.'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleEditClick = (item) => {
    setEditingItem(item)
    setUnits(item.units.toString())
  }

  const handleSave = async () => {
    if (!editingItem || !units || isNaN(parseInt(units)) || parseInt(units) < 0) {
      setError('Please enter a valid number of units')
      return
    }

    setSaving(true)
    setError('')

    try {
      // Simple update query - same approach as patient dashboard
      const { error } = await supabase
        .from('blood_bank')
        .update({ 
          units: parseInt(units),
          updated_at: new Date().toISOString()
        })
        .eq('id', editingItem.id)

      if (error) throw error

      setEditingItem(null)
      setUnits('')
      // fetchBloodBank will be called automatically via real-time subscription
    } catch (error) {
      console.error('Error updating blood bank:', error)
      setError(`Failed to update blood bank: ${error.message || 'Please try again.'}`)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setEditingItem(null)
    setUnits('')
    setError('')
  }

  const getStockStatus = (units) => {
    if (units < 5) return 'critical'
    if (units < 10) return 'low'
    return 'good'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical':
        return 'bg-red-50 border-red-300 text-red-800'
      case 'low':
        return 'bg-yellow-50 border-yellow-300 text-yellow-800'
      default:
        return 'bg-green-50 border-green-300 text-green-800'
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
        <h2 className="text-2xl font-bold text-secondary mb-2">Blood Bank Management</h2>
        <p className="text-text">Update blood type inventory for your hospital</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {bloodBank.map((item) => {
          const status = getStockStatus(item.units)
          const isEditing = editingItem?.id === item.id

          return (
            <div
              key={item.id}
              className={`border-2 rounded-xl p-6 text-center ${getStatusColor(status)}`}
            >
              <div className="text-4xl font-bold mb-2">{item.blood_type}</div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="number"
                    min="0"
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-lg font-semibold focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    placeholder="Units"
                    autoFocus
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={handleCancel}
                      disabled={saving}
                      className="flex-1 px-3 py-2 border border-gray-300 text-text rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {saving ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span className="ml-1">Saving...</span>
                        </>
                      ) : (
                        'Save'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-semibold mb-2">{item.units}</div>
                  <div className="text-sm opacity-80 mb-3">units available</div>
                  <button
                    onClick={() => handleEditClick(item)}
                    className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all font-medium text-sm w-full"
                  >
                    Update Units
                  </button>
                  {status === 'critical' && (
                    <div className="mt-2 text-xs font-semibold text-red-600">
                      ⚠️ Low Stock
                    </div>
                  )}
                  {status === 'low' && (
                    <div className="mt-2 text-xs font-semibold text-yellow-600">
                      ⚠️ Running Low
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })}
      </div>

      {bloodBank.length === 0 && (
        <div className="text-center py-12 text-text">
          <p>Blood bank data is not available at the moment.</p>
        </div>
      )}
    </div>
  )
}

