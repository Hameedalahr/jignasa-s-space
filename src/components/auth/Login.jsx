import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import logoImage from '../../assets/Jignasa space Navbar Logo.png'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setShowSuccess(false)
    
    if (!email || !password) {
      setError('Please fill in all fields')
      setLoading(false)
      return
    }

    const { data, error } = await signIn(email, password)
    
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      // Check expiry
      const user = data?.user
      const expiresAt = user?.user_metadata?.expires_at
      const isLifetime = user?.user_metadata?.lifetime
      if (expiresAt && !isLifetime && new Date() > new Date(expiresAt)) {
        setError('Your account has expired. Please contact support.')
        setLoading(false)
        return
      }
      setShowSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 1000)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoImage} alt="Jignasa's Space" className="h-16 w-auto" />
          </div>
          
          
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded text-red-400 text-sm">
              ❌ {error}
            </div>
          )}

          {showSuccess && (
            <div className="mb-4 p-3 bg-green-900/20 border border-green-500/20 rounded text-green-400 text-sm">
              ✅ Login successful! Redirecting to dashboard...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="text-right mb-2">
              <Link to="/forgot-password" className="text-accent hover:text-accent-light text-sm">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary ${loading ? 'relative overflow-hidden' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing In...
                </div>
              ) : (
                '🚀 Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-accent hover:text-accent-light">
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded">
            <div className="text-blue-400 text-sm">
              <div className="font-semibold mb-1">🔒 Single Device Login</div>
              <div className="text-xs text-gray-400">
                • Only one device can be logged in at a time<br/>
                • New login will automatically log out previous sessions<br/>
                • Your session is secure and protected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 