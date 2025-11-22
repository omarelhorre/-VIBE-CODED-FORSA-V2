import { useAuth } from '../../hooks/useAuth'
import AdminWaitingList from './AdminWaitingList'

export default function AdminDashboard() {
  const { user } = useAuth()
  const hospitalName = user?.hospitalName || 'Hospital'

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

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-primary/10 animate-fade-in">
          <AdminWaitingList />
        </div>
      </div>
    </div>
  )
}

