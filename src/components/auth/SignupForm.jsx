import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../common/LoadingSpinner'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
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

    const { data, error: signUpError } = await signUp(email, password)

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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 px-4">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-primary/10 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-4xl">✓</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-3">
            Account Created!
          </h2>
          <p className="text-text text-lg">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-accent/10 px-4 py-12">
      <div className="max-w-md w-full bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-primary/10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-4xl">🏥</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-3">
            Create Account
          </h1>
          <p className="text-text text-lg">Sign up for patient portal access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Enter your password (min 6 characters)"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center text-lg"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-text">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-accent font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

