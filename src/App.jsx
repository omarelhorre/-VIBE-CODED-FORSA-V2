import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
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
import ThemeToggle from './components/common/ThemeToggle'

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
      <div className="absolute inset-0 bg-gradient-to-br from-background dark:from-slate-900 via-primary/5 dark:via-primary/10 to-accent/10 dark:to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(76,175,80,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(67,160,71,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.15),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(46,125,50,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_50%)] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-7xl md:text-9xl font-bold mb-6">
            <span className="block text-text/60 dark:text-gray-400 mb-3 text-3xl md:text-4xl font-normal tracking-normal">
              Welcome to
            </span>
            <span className="block bg-gradient-to-r from-secondary via-primary to-accent dark:from-primary dark:via-accent dark:to-primary bg-clip-text text-transparent">
              Forsa
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-text/90 dark:text-gray-300 mb-4 max-w-3xl mx-auto font-light tracking-wide">
            Choose your hospital to access patient services
          </p>
          <p className="text-lg text-text/70 dark:text-gray-400 font-medium">
            {hospitals.length} available hospitals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {hospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>

        {/* Contributors Tracker Section - Enhanced Design */}
        <div id="contributors" className="mb-16 py-24 px-6 rounded-3xl scroll-mt-20 bg-gradient-to-br from-primary/20 via-accent/15 to-primary/20 dark:from-primary/30 dark:via-accent/20 dark:to-primary/30 backdrop-blur-md border-2 border-primary/30 dark:border-primary/40 shadow-2xl relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          {/* Decorative Grid Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(rgba(76, 175, 80, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(76, 175, 80, 0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center gap-3 mb-4">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <h2 className="text-6xl font-black bg-gradient-to-r from-secondary via-primary to-accent dark:from-primary dark:via-accent dark:to-primary bg-clip-text text-transparent">
                  Our Team
                </h2>
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <p className="text-lg text-text/70 dark:text-gray-400 font-medium">
                The passionate developers behind Forsa
              </p>
            </div>
            
            {/* Team Members */}
            <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 md:gap-10">
              <a 
                href="https://www.linkedin.com/in/reda-zakaria-70aa6a300/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex-1 max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl shadow-2xl dark:shadow-2xl p-8 border-2 border-primary/20 dark:border-primary/30 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-300 cursor-pointer hover:shadow-primary/20 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      {/* Outer Glow Ring */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-2xl blur-lg opacity-50 group-hover:opacity-75 group-hover:scale-110 transition-all duration-300"></div>
                      {/* Avatar Container */}
                      <div className="relative w-20 h-20 bg-gradient-to-br from-primary via-primary to-accent rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30 dark:border-gray-700/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <i className="fas fa-user-tie text-white text-2xl drop-shadow-lg"></i>
                      </div>
                      {/* Status Indicator */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-secondary dark:text-gray-100 group-hover:text-primary dark:group-hover:text-accent transition-colors mb-1">
                        REDA ZAKARIA
                      </h3>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-graduation-cap text-primary/60 dark:text-primary/40 text-sm"></i>
                        <p className="text-sm font-semibold text-primary dark:text-primary">Computer Science</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-primary/10 dark:bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/20 dark:group-hover:bg-primary/30 transition-colors">
                      <i className="fas fa-external-link-alt text-primary dark:text-primary text-sm"></i>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-text/70 dark:text-gray-400">
                      <i className="fas fa-university text-primary/50 w-4"></i>
                      <span>Student at Ensa Tetouan</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text/70 dark:text-gray-400">
                      <i className="fas fa-calendar-alt text-primary/50 w-4"></i>
                      <span>3rd year engineering student</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text/70 dark:text-gray-400">
                      <i className="fas fa-birthday-cake text-primary/50 w-4"></i>
                      <span>20 years old</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text/70 dark:text-gray-400">
                      <i className="fas fa-map-marker-alt text-primary/50 w-4"></i>
                      <span>From Sale</span>
                    </div>
                  </div>
                  
                  {/* Hover Effect Indicator */}
                  <div className="mt-6 pt-6 border-t border-primary/10 dark:border-gray-700/30">
                    <div className="flex items-center gap-2 text-xs text-primary/60 dark:text-primary/40 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                      <span>View LinkedIn Profile</span>
                      <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </div>
              </a>

              {/* Divider */}
              <div className="hidden md:flex flex-col items-center justify-center gap-4">
                <div className="w-px h-32 bg-gradient-to-b from-transparent via-primary/50 to-transparent"></div>
                <div className="w-12 h-12 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center border-2 border-primary/30 dark:border-primary/40">
                  <i className="fas fa-users text-primary dark:text-primary text-lg"></i>
                </div>
                <div className="w-px h-32 bg-gradient-to-b from-transparent via-accent/50 to-transparent"></div>
              </div>

              <a 
                href="https://www.linkedin.com/in/omarelhorreli/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex-1 max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-3xl shadow-2xl dark:shadow-2xl p-8 border-2 border-accent/20 dark:border-accent/30 hover:border-accent/50 dark:hover:border-accent/50 transition-all duration-300 cursor-pointer hover:shadow-accent/20 hover:-translate-y-2 relative overflow-hidden"
              >
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="relative">
                      {/* Outer Glow Ring */}
                      <div className="absolute inset-0 bg-gradient-to-br from-accent to-primary rounded-2xl blur-lg opacity-50 group-hover:opacity-75 group-hover:scale-110 transition-all duration-300"></div>
                      {/* Avatar Container */}
                      <div className="relative w-20 h-20 bg-gradient-to-br from-accent via-accent to-primary rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30 dark:border-gray-700/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                        <i className="fas fa-user-tie text-white text-2xl drop-shadow-lg"></i>
                      </div>
                      {/* Status Indicator */}
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-secondary dark:text-gray-100 group-hover:text-accent dark:group-hover:text-primary transition-colors mb-1">
                        OMAR EL HORRE
                      </h3>
                      <div className="flex items-center gap-2">
                        <i className="fas fa-graduation-cap text-accent/60 dark:text-accent/40 text-sm"></i>
                        <p className="text-sm font-semibold text-accent dark:text-accent">Computer Science</p>
                      </div>
                    </div>
                    <div className="w-10 h-10 bg-accent/10 dark:bg-accent/20 rounded-xl flex items-center justify-center group-hover:bg-accent/20 dark:group-hover:bg-accent/30 transition-colors">
                      <i className="fas fa-external-link-alt text-accent dark:text-accent text-sm"></i>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-text/70 dark:text-gray-400">
                      <i className="fas fa-university text-accent/50 w-4"></i>
                      <span>Student at Ensa Tetouan</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text/70 dark:text-gray-400">
                      <i className="fas fa-calendar-alt text-accent/50 w-4"></i>
                      <span>3rd year engineering student</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text/70 dark:text-gray-400">
                      <i className="fas fa-birthday-cake text-accent/50 w-4"></i>
                      <span>20 years old</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text/70 dark:text-gray-400">
                      <i className="fas fa-map-marker-alt text-accent/50 w-4"></i>
                      <span>From Casablanca</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text/70 dark:text-gray-400">
                      <i className="fas fa-code text-accent/50 w-4"></i>
                      <span>Full-stack Developer</span>
                    </div>
                  </div>
                  
                  {/* Hover Effect Indicator */}
                  <div className="mt-6 pt-6 border-t border-accent/10 dark:border-gray-700/30">
                    <div className="flex items-center gap-2 text-xs text-accent/60 dark:text-accent/40 group-hover:text-accent dark:group-hover:text-accent transition-colors">
                      <span>View LinkedIn Profile</span>
                      <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Special Thanks Section - Compact Side-by-Side */}
        <div id="special-thanks" className="mb-16 py-12 px-6 rounded-3xl scroll-mt-20 bg-gradient-to-br from-pink-50/50 via-red-50/30 to-pink-50/50 dark:from-pink-900/20 dark:via-red-900/15 dark:to-pink-900/20 backdrop-blur-sm border-2 border-pink-200/50 dark:border-pink-800/30 shadow-lg relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-200/20 dark:bg-pink-800/20 rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-red-200/20 dark:bg-red-800/20 rounded-full blur-2xl"></div>
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-8">
              <i className="fas fa-heart text-pink-500 dark:text-pink-400 text-2xl animate-pulse"></i>
              <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-pink-600 via-red-600 to-pink-600 dark:from-pink-400 dark:via-red-400 dark:to-pink-400 bg-clip-text text-transparent">
                Special Thanks
              </h2>
              <i className="fas fa-heart text-pink-500 dark:text-pink-400 text-2xl animate-pulse"></i>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-stretch">
              <a 
                href="https://www.linkedin.com/in/hiba-el-bouhaddioui/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg dark:shadow-xl p-6 border border-pink-200/50 dark:border-pink-800/50 hover:border-pink-400 dark:hover:border-pink-600 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-red-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <i className="fas fa-heart text-white text-lg"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-pink-600 dark:text-pink-400 mb-1 group-hover:text-pink-700 dark:group-hover:text-pink-300 transition-colors">HIBA EL BOUHADDIOUI</h3>
                    <p className="text-sm text-text/70 dark:text-gray-400">2nd year • Preparatory classes</p>
                  </div>
                  <i className="fas fa-external-link-alt text-pink-400/50 group-hover:text-pink-500 transition-colors text-sm mt-1"></i>
                </div>
              </a>
              
              <a 
                href="https://www.linkedin.com/in/abdellah-raissouni/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl shadow-lg dark:shadow-xl p-6 border border-red-200/50 dark:border-red-800/50 hover:border-red-400 dark:hover:border-red-600 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-pink-400 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <i className="fas fa-heart text-white text-lg"></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-1 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">ABDELLAH RAISSOUNI</h3>
                    <p className="text-sm text-text/70 dark:text-gray-400">5th year • Computer Science</p>
                  </div>
                  <i className="fas fa-external-link-alt text-red-400/50 group-hover:text-red-500 transition-colors text-sm mt-1"></i>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Us Section - Minimalist Design */}
        <div id="contact" className="mb-16 py-12 px-6 rounded-3xl scroll-mt-20 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-blue-50/50 dark:from-blue-900/20 dark:via-indigo-900/15 dark:to-blue-900/20 backdrop-blur-sm border-t-2 border-b-2 border-blue-300/50 dark:border-blue-700/30 shadow-lg">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg">
              <i className="fas fa-envelope text-white text-3xl"></i>
            </div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 dark:from-blue-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent mb-4">
              Get in Touch
            </h2>
            <p className="text-text/70 dark:text-gray-400 mb-8 text-lg">
              Have questions or feedback? We'd love to hear from you.
            </p>
            <a 
              href="mailto:elhorre.omar@etu.uae.ac.ma"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
            >
              <i className="fas fa-paper-plane"></i>
              <span>elhorre.omar@etu.uae.ac.ma</span>
              <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center py-8 text-text/60 dark:text-gray-500">
          <p>Copyright © 2025-2026</p>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background dark:bg-gray-900 relative transition-colors duration-300">
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
            <ThemeToggle />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App

