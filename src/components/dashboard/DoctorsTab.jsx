import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import LoadingSpinner from '../common/LoadingSpinner'

export default function DoctorsTab() {
  const [doctors, setDoctors] = useState([])
  const [departments, setDepartments] = useState([])
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDoctors()
    fetchDepartments()
  }, [])

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .order('name')

      if (error) throw error
      
      // Fetch departments to join with doctors
      const { data: deptsData } = await supabase
        .from('departments')
        .select('id, name')
      
      const deptMap = {}
      deptsData?.forEach(dept => {
        deptMap[dept.id] = dept.name
      })
      
      // Add department name to each doctor
      const doctorsWithDepts = (data || []).map(doctor => ({
        ...doctor,
        department_name: deptMap[doctor.department_id] || 'Unknown'
      }))
      
      setDoctors(doctorsWithDepts)
    } catch (error) {
      console.error('Error fetching doctors:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name')
        .order('name')

      if (error) throw error
      setDepartments(data || [])
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesDepartment =
      selectedDepartment === 'all' || doctor.department_id === selectedDepartment
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesDepartment && matchesSearch
  })

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
        <h2 className="text-2xl font-bold text-secondary dark:text-gray-200 mb-2">Available Doctors</h2>
        <p className="text-text dark:text-gray-300">Find and contact our medical professionals</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="all">All Departments</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Doctors List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm hover:bg-white/30 dark:hover:bg-gray-800/30"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-secondary dark:text-gray-200 mb-1">{doctor.name}</h3>
                <p className="text-primary dark:text-primary font-semibold mb-2">{doctor.specialization}</p>
                {doctor.department_name && (
                  <p className="text-sm text-text dark:text-gray-400">{doctor.department_name} Department</p>
                )}
              </div>
              <div className="ml-4">
                <div
                  className={`w-4 h-4 rounded-full ${
                    doctor.available ? 'bg-green-500' : 'bg-red-500'
                  }`}
                ></div>
              </div>
            </div>
            <div className="flex items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  doctor.available
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                }`}
              >
                {doctor.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-12 text-text dark:text-gray-400">
          <p>No doctors found matching your criteria.</p>
        </div>
      )}
    </div>
  )
}

