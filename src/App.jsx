import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Header from './components/common/Header'
import LoginForm from './components/auth/LoginForm'
import SignupForm from './components/auth/SignupForm'
import Dashboard from './components/dashboard/Dashboard'
import MapView from './components/map/MapView'
import LoadingSpinner from './components/common/LoadingSpinner'
import HospitalCard from './components/hospital/HospitalCard'
import HospitalDetail from './components/hospital/HospitalDetail'
import AdminDashboard from './components/admin/AdminDashboard'
import ParticleBackground from './components/map/ParticleBackground'

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
      name: 'Tetouan Medical center',
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
      
      <div className="relative z-10 max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-32 h-32 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl transform hover:scale-110 transition-transform">
            <i className="fas fa-hospital text-white text-6xl"></i>
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent mb-4">
            Welcome to saari3
          </h1>
          <p className="text-2xl text-text mb-4 max-w-2xl mx-auto">
            Choose your hospital to access patient services
          </p>
          <p className="text-lg text-text/70">
            {hospitals.length} available hospitals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {hospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>

        {/* Contributors Tracker Section */}
        <div id="contributors" className="mb-16 py-12 px-4 rounded-3xl scroll-mt-20" style={{ backgroundColor: 'rgba(76, 175, 80, 0.1)' }}>
          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-12">
            Contributors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <a 
              href="https://www.linkedin.com/in/reda-zakaria-70aa6a300/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border border-primary/10 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="fas fa-user-tie text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">REDA ZAKARIA</h3>
              <p className="text-text">3rd year engineering student at Computer Science</p>
            </a>
            <a 
              href="https://www.linkedin.com/in/omarelhorreli/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border border-primary/10 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="fas fa-user-tie text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">OMAR EL HORRE</h3>
              <p className="text-text">3rd year engineering student at Computer Science</p>
            </a>
          </div>
        </div>

        {/* Special Thanks Section */}
        <div id="special-thanks" className="mb-16 py-12 px-4 rounded-3xl scroll-mt-20" style={{ backgroundColor: 'rgba(67, 160, 71, 0.1)' }}>
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-8">
            Special thanks to
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <a 
              href="https://www.linkedin.com/in/hiba-el-bouhaddioui/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border border-primary/10 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="fas fa-heart text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">HIBA EL BOUHADDIOUI</h3>
              <p className="text-text">2nd year engineering student at preparatory classes</p>
            </a>
            <a 
              href="https://www.linkedin.com/in/abdellah-raissouni/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 text-center border border-primary/10 hover:shadow-2xl hover:scale-105 transition-all cursor-pointer"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <i className="fas fa-heart text-white text-3xl"></i>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">ABDELLAH RAISSOUNI</h3>
              <p className="text-text">5th year engineering student at computer science</p>
            </a>
          </div>
        </div>

        {/* Contact Us Section */}
        <div id="contact" className="mb-16 py-12 px-4 rounded-3xl scroll-mt-20" style={{ backgroundColor: 'rgba(67, 160, 71, 0.1)' }}>
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-8">
            Contact Us
          </h2>
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 text-center border border-primary/10 max-w-3xl mx-auto">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                <i className="fas fa-envelope text-white text-2xl"></i>
              </div>
              <a 
                href="mailto:elhorre.omar@etu.uae.ac.ma"
                className="text-xl font-semibold text-secondary hover:text-primary transition-colors"
              >
                elhorre.omar@etu.uae.ac.ma
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center py-8 text-text/60">
          <p>Copyright © 2025-2026</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-background relative">
          {/* Global Particle Background */}
          <ParticleBackground active={true} color="#4CAF50" />
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
              element={<MapView />}
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
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

