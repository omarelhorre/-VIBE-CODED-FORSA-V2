import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import LoadingSpinner from '../common/LoadingSpinner'
import Dashboard from '../dashboard/Dashboard'

const hospitals = {
  'saniat-rmel': {
    id: 'saniat-rmel',
    name: 'Saniat Rmel Hospital',
    location: 'Tetouan, Morocco',
    description: 'Your trusted healthcare partner in Tetouan, Morocco',
  },
  'mohammed-6': {
    id: 'mohammed-6',
    name: 'Tetouan Medical center',
    location: 'Tetouan, Morocco',
    description: 'Advanced medical care and excellence in healthcare',
  },
}

export default function HospitalDetail() {
  const { hospitalId } = useParams()
  const [hospital, setHospital] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading and set hospital data
    const hospitalData = hospitals[hospitalId]
    if (hospitalData) {
      setHospital(hospitalData)
    }
    setLoading(false)
  }, [hospitalId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary dark:text-gray-200 mb-4">Hospital Not Found</h1>
          <a href="/" className="text-primary dark:text-primary hover:text-accent">
            Return to Home
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-secondary via-primary to-accent dark:from-primary dark:via-accent dark:to-primary bg-clip-text text-transparent mb-4">
            Welcome to {hospital.name}
          </h1>
          <p className="text-xl text-text dark:text-gray-300 mb-2">{hospital.location}</p>
          <p className="text-text dark:text-gray-400">{hospital.description}</p>
        </div>
        <Dashboard />
      </div>
    </div>
  )
}

