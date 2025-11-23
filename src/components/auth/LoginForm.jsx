import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingSpinner from '../common/LoadingSpinner'

export default function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/'
  const audioContextRef = useRef(null)

  // Play verification sound
  const playVerificationSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      const audioContext = audioContextRef.current
      
      // Create a pleasant verification chime sound
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      // Set frequency for a pleasant chime (two-tone verification sound)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
      
      oscillator.type = 'sine'
      
      // Envelope for smooth sound
      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.3)
    } catch (error) {
      // Silently fail if audio context is not available
      console.log('Audio not available')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    setSuccess(false)

    const { data, error: signInError } = await signIn(username, password)

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    if (data?.user) {
      setLoading(false)
      setSuccess(true)
      // Play verification sound
      playVerificationSound()
      // Check if the user is an admin and redirect to admin dashboard
      const user = data.user
      setTimeout(() => {
        if (user.role === 'admin' || user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          navigate(redirectTo)
        }
      }, 1000)
    } else {
      setError('Login failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background dark:from-slate-900 via-primary/5 dark:via-primary/10 to-accent/10 dark:to-primary/5 px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(76,175,80,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.15),transparent_50%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(67,160,71,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.15),transparent_50%)] animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="max-w-md w-full bg-gradient-to-br from-white/95 to-white/80 dark:from-gray-800/90 dark:to-gray-800/70 backdrop-blur-md rounded-3xl shadow-2xl dark:shadow-2xl p-10 border border-primary/20 dark:border-gray-700/50 animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-secondary via-primary to-accent dark:from-primary dark:via-accent dark:to-primary bg-clip-text text-transparent mb-4 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-text/80 dark:text-gray-300 text-lg font-medium">Sign in to your patient portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl font-medium shadow-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-text dark:text-gray-300 mb-2.5">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-5 py-3.5 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white/50 backdrop-blur-sm hover:border-primary/50 dark:hover:border-primary/50 font-medium"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-text dark:text-gray-300 mb-2.5">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-5 py-3.5 pr-12 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white/50 backdrop-blur-sm hover:border-primary/50 dark:hover:border-primary/50 font-medium"
                placeholder="Enter your password"
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
            disabled={loading || success}
            className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center text-lg border backdrop-blur-sm relative overflow-hidden ${
              success
                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white border-green-500/20 shadow-lg scale-105 animate-zoom-out-in'
                : 'bg-gradient-to-r from-primary via-primary to-accent text-white border-primary/20 hover:shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
            }`}
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : success ? (
              <div className="flex items-center justify-center relative z-10 w-full h-full">
                <svg 
                  className="w-10 h-10 text-white animate-rotate-zoom-in" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ display: 'block', minWidth: '40px', minHeight: '40px' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            ) : (
              'Sign In'
            )}
            {success && (
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-text/80 dark:text-gray-400 font-medium">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary dark:text-primary hover:text-accent font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
