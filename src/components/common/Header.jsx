import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'

export default function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { theme } = useTheme()

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = async () => {
    setShowLogoutConfirm(false)
    await signOut()
  }

  const handleLogoutClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowLogoutConfirm(true)
  }

  const getUserDisplayName = () => {
    if (user?.role === 'admin' || user?.user_metadata?.role === 'admin') {
      return user.hospitalName || 'Admin'
    }
    return user?.email?.split('@')[0] || user?.user_metadata?.full_name || 'User'
  }

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg border-b border-primary/10 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="flex items-center space-x-6">
              <span className="bg-gradient-to-r from-secondary via-primary to-accent dark:from-primary dark:via-accent dark:to-primary bg-clip-text text-transparent text-4xl font-bold">
                Forsa
              </span>
              {user && (
                <div className="hidden sm:flex items-center group ml-4">
                  <div className="flex items-center space-x-2.5 px-5 py-3 bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 dark:from-primary/20 dark:via-primary/15 dark:to-primary/10 backdrop-blur-sm rounded-xl border border-primary/20 dark:border-primary/30 shadow-md hover:shadow-lg transition-all duration-300 ease-out group-hover:scale-105 group-hover:border-primary/30">
                    <div className="relative flex-shrink-0">
                      <div className="w-3 h-3 bg-gradient-to-br from-primary to-accent rounded-full animate-pulse shadow-sm"></div>
                      <div className="absolute inset-0 w-3 h-3 bg-primary rounded-full animate-ping opacity-75"></div>
                    </div>
                    <div className="flex items-center overflow-hidden">
                      <span className="text-base font-semibold text-secondary dark:text-gray-300 whitespace-nowrap tracking-tight">
                        Logged in
                      </span>
                      <span className="text-base font-semibold text-secondary/80 dark:text-gray-400 whitespace-nowrap max-w-0 group-hover:max-w-[300px] opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out overflow-hidden ml-1.5">
                        {' '}as <span className="text-primary dark:text-primary font-bold">{getUserDisplayName()}</span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Link>

          <nav className="flex items-center space-x-2">
            {user && (
              <>
                {user.role === 'admin' || user.user_metadata?.role === 'admin' ? (
                  <Link
                    to="/admin/dashboard"
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all font-semibold backdrop-blur-sm border border-red-500/20"
                  >
                    Admin Dashboard
                  </Link>
                ) : null}
              </>
            )}
            <Link
              to="/"
              onClick={handleHomeClick}
              className="px-5 py-3 text-base text-text dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 dark:hover:from-primary/20 dark:hover:to-primary/10 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
            >
              Home
            </Link>
            <Link
              to="/map"
              className="px-5 py-3 text-base text-text dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 dark:hover:from-primary/20 dark:hover:to-primary/10 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
            >
              Locations
            </Link>
            <button
              onClick={() => scrollToSection('contributors')}
              className="px-5 py-3 text-base text-text dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 dark:hover:from-primary/20 dark:hover:to-primary/10 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
            >
              Contributors
            </button>
            <button
              onClick={() => scrollToSection('special-thanks')}
              className="px-5 py-3 text-base text-text dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 dark:hover:from-primary/20 dark:hover:to-primary/10 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
            >
              Special Thanks
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-5 py-3 text-base text-text dark:text-gray-300 hover:text-primary dark:hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 dark:hover:from-primary/20 dark:hover:to-primary/10 rounded-xl transition-all font-medium hover:scale-105 active:scale-95"
            >
              Contact
            </button>
            {user ? (
              <button
                onClick={handleLogoutClick}
                className="px-6 py-3 bg-gradient-to-r from-secondary to-primary text-white rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all font-semibold backdrop-blur-sm border border-primary/20"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-xl hover:scale-105 active:scale-95 transition-all font-semibold backdrop-blur-sm border border-primary/20"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-black/70 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
          onClick={() => setShowLogoutConfirm(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-secondary dark:text-gray-200 mb-2">Confirm Logout</h2>
              <p className="text-text dark:text-gray-300">
                Are you sure you want to log out?
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-text dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-secondary to-primary text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
