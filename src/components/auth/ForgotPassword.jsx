import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import logoImage from '../../assets/Jignasa space Navbar Logo.png'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    if (!email) {
      setError('Please enter your email')
      setLoading(false)
      return
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      // Send the reset password email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password'
      })
      
      if (resetError) {
        setError(resetError.message)
      } else {
        // Provide a user-friendly message that doesn't reveal whether the email exists
        setSuccess('If an account with this email exists, a password reset link has been sent to your inbox. Please check your email and spam folder.')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img src={logoImage} alt="Jignasa's Space" className="h-16 w-auto" />
          </div>
          <h2 className="text-xl text-gray-300 mb-2">Forgot Password?</h2>
          <p className="text-gray-400">Enter your email to receive a password reset link.</p>
          <p className="text-gray-500 text-sm mt-2">For security reasons, we'll attempt to send a reset link to any valid email address.</p>
        </div>
        <div className="card">
          {error && <div className="mb-4 p-3 bg-red-900/20 border border-red-500/20 rounded text-red-400 text-sm">❌ {error}</div>}
          {success && <div className="mb-4 p-3 bg-green-900/20 border border-green-500/20 rounded text-green-400 text-sm">✅ {success}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
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
            <button type="submit" disabled={loading} className={`w-full btn-primary ${loading ? 'relative overflow-hidden' : ''}`}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <a href="/login" className="text-accent hover:text-accent-light text-sm">← Back to Login</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword 