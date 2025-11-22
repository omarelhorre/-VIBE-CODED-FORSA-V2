import { useState } from 'react'
import WaitingListTab from './WaitingListTab'
import BloodBankTab from './BloodBankTab'
import DoctorsTab from './DoctorsTab'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('waiting')

  const tabs = [
    { id: 'waiting', label: 'Waiting Lists', icon: '⏱️' },
    { id: 'blood', label: 'Blood Bank', icon: '🩸' },
    { id: 'doctors', label: 'Doctors', icon: '👨‍⚕️' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2">Patient Dashboard</h1>
          <p className="text-text">Manage your appointments and view hospital information</p>
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
                <span className="mr-2 text-xl">{tab.icon}</span>
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
          {activeTab === 'waiting' && <WaitingListTab />}
          {activeTab === 'blood' && <BloodBankTab />}
          {activeTab === 'doctors' && <DoctorsTab />}
        </div>
      </div>
    </div>
  )
}

