import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AdminWaitingList from './AdminWaitingList'
import AdminBloodBankTab from './AdminBloodBankTab'

export default function AdminDashboard() {
  const { user } = useAuth()
  const hospitalName = user?.hospitalName || 'Hospital'
  const [activeTab, setActiveTab] = useState('waiting')

  const tabs = [
    { id: 'waiting', label: 'Waiting List' },
    { id: 'blood', label: 'Blood Bank' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-secondary mb-2">
                Admin Dashboard
              </h1>
              <p className="text-text">
                Managing: <span className="font-semibold text-primary">{hospitalName}</span>
              </p>
            </div>
            <div className="bg-gradient-to-r from-primary to-accent text-white px-6 py-3 rounded-xl shadow-lg">
              <div className="text-sm opacity-90">Admin Portal</div>
              <div className="text-lg font-semibold">{hospitalName}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg mb-6 border border-primary/10">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-5 text-center font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-text hover:text-primary'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-primary/10 animate-fade-in">
          {activeTab === 'waiting' && <AdminWaitingList />}
          {activeTab === 'blood' && <AdminBloodBankTab />}
        </div>
      </div>
    </div>
  )
}

