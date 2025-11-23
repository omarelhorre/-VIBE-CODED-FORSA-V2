import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import AdminWaitingList from './AdminWaitingList'
import AdminBloodBankTab from './AdminBloodBankTab'
import AdminHelpRequestsTab from './AdminHelpRequestsTab'
import AdminAmbulanceTab from './AdminAmbulanceTab'
import AdminForsaPlusTab from './AdminForsaPlusTab'

export default function AdminDashboard() {
  const { user } = useAuth()
  const hospitalName = user?.hospitalName || 'Hospital'
  const [activeTab, setActiveTab] = useState('waiting')

  const tabs = [
    { id: 'waiting', label: 'Waiting List' },
    { id: 'blood', label: 'Blood Bank' },
    { id: 'help', label: 'Help Requests' },
    { id: 'ambulance', label: 'Ambulances' },
    { id: 'forsa-plus', label: 'Forsa+' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background dark:from-slate-900 via-red-500/5 dark:via-red-900/10 to-red-600/10 dark:to-red-800/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-red-700 via-red-600 to-red-500 dark:from-red-500 dark:via-red-600 dark:to-red-700 bg-clip-text text-transparent mb-3">
                Admin Dashboard
              </h1>
              <p className="text-text/80 dark:text-gray-300 text-lg">
                Managing: <span className="font-semibold text-red-600 dark:text-red-500">{hospitalName}</span>
              </p>
            </div>
            <div className="bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white px-6 py-3 rounded-xl shadow-xl border border-red-500/20 dark:border-red-600/30">
              <div className="text-sm opacity-90">Admin Portal</div>
              <div className="text-lg font-semibold">{hospitalName}</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gradient-to-br from-white/90 to-white/70 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-md rounded-2xl shadow-xl dark:shadow-2xl mb-6 border border-red-200/30 dark:border-red-900/50 overflow-hidden">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-5 text-center font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? 'text-red-600 dark:text-red-500 bg-gradient-to-b from-red-50 dark:from-red-900/30 to-transparent'
                    : 'text-text/70 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-900/20'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-red-500 to-red-600 rounded-t-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-br from-white/30 to-white/20 dark:from-gray-800/40 dark:to-gray-800/30 backdrop-blur-md rounded-2xl shadow-lg dark:shadow-xl p-8 border border-red-200/20 dark:border-red-900/30 animate-fade-in">
          {activeTab === 'waiting' && <AdminWaitingList />}
          {activeTab === 'blood' && <AdminBloodBankTab />}
          {activeTab === 'help' && <AdminHelpRequestsTab />}
          {activeTab === 'ambulance' && <AdminAmbulanceTab />}
          {activeTab === 'forsa-plus' && <AdminForsaPlusTab />}
        </div>
      </div>
    </div>
  )
}

