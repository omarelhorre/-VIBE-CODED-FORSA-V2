import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await signOut()
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

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-primary/10 sticky top-0 z-50">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <i className="fas fa-hospital text-white text-2xl"></i>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Sarii Space
              </span>
            </div>
          </Link>

          <nav className="flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
            >
              Home
            </Link>
            <Link 
              to="/map" 
              className="px-4 py-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
            >
              Locations
            </Link>
            {user && (
              <>
                {user.role === 'admin' || user.user_metadata?.role === 'admin' ? (
                  <Link 
                    to="/admin/dashboard" 
                    className="px-4 py-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                  >
                    Admin Dashboard
                  </Link>
                ) : null}
              </>
            )}
            <button
              onClick={() => scrollToSection('contributors')}
              className="px-4 py-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
            >
              Contributors
            </button>
            <button
              onClick={() => scrollToSection('special-thanks')}
              className="px-4 py-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
            >
              Special Thanks
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="px-4 py-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
            >
              Contact
            </button>
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm text-text font-medium">
                    Logged in as {getUserDisplayName()}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-secondary to-primary text-white rounded-lg hover:shadow-lg transition-all font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
