import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

export default function SignupForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await signUp(username, password)

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data?.user) {
      setSuccess(true)
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background dark:from-slate-900 via-primary/5 dark:via-primary/10 to-accent/10 dark:to-primary/5 px-4">
        <div className="max-w-md w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl dark:shadow-2xl p-8 text-center border border-primary/10 dark:border-gray-700/50 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <i className="fas fa-check-circle text-white text-4xl"></i>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary dark:from-primary dark:to-accent bg-clip-text text-transparent mb-3">
            Account Created!
          </h2>
          <p className="text-text dark:text-gray-300 text-lg">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background dark:from-slate-900 via-primary/5 dark:via-primary/10 to-accent/10 dark:to-primary/5 px-4 py-12">
      <div className="max-w-md w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl dark:shadow-2xl p-8 border border-primary/10 dark:border-gray-700/50 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <i className="fas fa-hospital text-white text-4xl"></i>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary dark:from-primary dark:to-accent bg-clip-text text-transparent mb-3">
            Create Account
          </h1>
          <p className="text-text dark:text-gray-300 text-lg">Sign up for patient portal access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="Enter your password (min 6 characters)"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text/60 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center text-lg"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-text dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary dark:text-primary hover:text-accent font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

