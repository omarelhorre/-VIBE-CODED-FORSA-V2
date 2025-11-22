import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-primary/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <span className="text-white text-2xl">🏥</span>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Sarii Space
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1">
            {user && (
              <>
                {user.role === 'admin' || user.user_metadata?.role === 'admin' ? (
                  <Link 
                    to="/admin/dashboard" 
                    className="px-4 py-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                  >
                    Admin Dashboard
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="px-4 py-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/map" 
                      className="px-4 py-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                    >
                      Locations
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-lg">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm text-text font-medium">
                    {user.role === 'admin' || user.user_metadata?.role === 'admin' 
                      ? `Admin - ${user.hospitalName || 'Hospital'}`
                      : user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2.5 bg-gradient-to-r from-secondary to-primary text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className="px-4 py-2 text-text hover:text-primary hover:bg-primary/10 rounded-lg transition-all font-medium"
                >
                  Home
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-primary to-accent text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
