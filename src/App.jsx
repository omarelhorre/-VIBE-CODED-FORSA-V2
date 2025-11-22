import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Header from './components/common/Header'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import Dashboard from './components/dashboard/Dashboard'
import MapView from './components/map/MapView'
import LoadingSpinner from './components/common/LoadingSpinner'
import HospitalCard from './components/hospital/HospitalCard'
import HospitalDetail from './components/hospital/HospitalDetail'
import AdminDashboard from './components/admin/AdminDashboard'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

function AdminProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Check if user is admin
  if (user && (user.role === 'admin' || user.user_metadata?.role === 'admin')) {
    return children
  }

  // Redirect non-admin users to login
  return <Navigate to="/login" replace />
}

function Home() {
  const hospitals = [
    {
      id: 'saniat-rmel',
      name: 'Saniat Rmel Hospital',
      location: 'Tetouan, Morocco',
    },
    {
      id: 'mohammed-6',
      name: 'Mohammed 6 Hospital',
      location: 'Tetouan, Morocco',
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(76,175,80,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(67,160,71,0.1),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(46,125,50,0.05),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 animate-fade-in">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-110 transition-transform">
            <span className="text-white text-6xl">🏥</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent mb-6">
            Welcome to saari3
          </h1>
          <p className="text-2xl text-text mb-4 max-w-2xl mx-auto">
            Choose your hospital to access patient services
          </p>
          <p className="text-lg text-text/70">
            {hospitals.length} available hospitals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {hospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>

        {/* Team Section */}
        <div className="mb-20 py-12 px-4 rounded-3xl" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-12">
            Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border border-primary/10 hover:shadow-2xl hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-3xl">👨‍💻</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">REDA ZAKARIA</h3>
              <p className="text-text">3rd year engineering student at Computer Science</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border border-primary/10 hover:shadow-2xl hover:scale-105 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-white text-3xl">👨‍💻</span>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">OMAR EL HORRE</h3>
              <p className="text-text">3rd year engineering student at Computer Science</p>
            </div>
          </div>
        </div>

        {/* Thanks Section */}
        <div className="mb-12 py-12 px-4 rounded-3xl" style={{ backgroundColor: 'rgba(67, 160, 71, 0.1)' }}>
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-8">
            Special thanks to
          </h2>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-primary/10 max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row justify-center items-center gap-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🙏</span>
                </div>
                <span className="text-lg font-semibold text-secondary">HIBA EL BOUHADDIOUI</span>
              </div>
              <div className="hidden md:block text-text/30">•</div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🙏</span>
                </div>
                <span className="text-lg font-semibold text-secondary">ABDELLAH RAISSOUNI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hospital/:hospitalId"
            element={<HospitalDetail />}
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

