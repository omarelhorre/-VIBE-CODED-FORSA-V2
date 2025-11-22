import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Header from './components/common/Header'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import Dashboard from './components/dashboard/Dashboard'
import MapView from './components/map/MapView'
import LoadingSpinner from './components/common/LoadingSpinner'

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

function Home() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(76,175,80,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(67,160,71,0.1),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(46,125,50,0.05),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20 animate-fade-in">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl transform hover:scale-110 transition-transform">
            <span className="text-white text-6xl">🏥</span>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent mb-6">
            Welcome to Saniat Rmel Hospital
          </h1>
          <p className="text-2xl text-text mb-12 max-w-2xl mx-auto">
            Your trusted healthcare partner in Tetouan, Morocco
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-primary/10 hover:shadow-2xl hover:scale-105 transition-all group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">⏱️</div>
            <h3 className="text-2xl font-bold text-secondary mb-3">Waiting Lists</h3>
            <p className="text-text">Join department queues in real-time</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-primary/10 hover:shadow-2xl hover:scale-105 transition-all group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">🩸</div>
            <h3 className="text-2xl font-bold text-secondary mb-3">Blood Bank</h3>
            <p className="text-text">Check blood type availability</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-primary/10 hover:shadow-2xl hover:scale-105 transition-all group">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform">👨‍⚕️</div>
            <h3 className="text-2xl font-bold text-secondary mb-3">Doctors</h3>
            <p className="text-text">View doctor availability and specializations</p>
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
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

