import { useState } from 'react'
import { Link } from 'react-router-dom'
import { userManager } from '../utils/userManager'

const TestUserSetup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleAddUser = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const response = await userManager.addTestUser(email, password, username)
      setResult(response)
      
      if (response.success && !response.requiresConfirmation) {
        // Clear form on success (only if no confirmation required)
        setEmail('')
        setPassword('')
        setUsername('')
      }
    } catch (error) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmEmail = async () => {
    setLoading(true)
    try {
      const response = await userManager.confirmEmail(email, password)
      if (response.success) {
        setResult({ 
          success: true, 
          message: 'Email confirmed successfully! You can now login.',
          confirmed: true
        })
        // Clear form after successful confirmation
        setEmail('')
        setPassword('')
        setUsername('')
      } else {
        setResult({ 
          success: false, 
          error: response.error?.message || 'Failed to confirm email'
        })
      }
    } catch (error) {
      setResult({ success: false, error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-4">
            🌌 Test User Setup
          </h1>
          <p className="text-gray-300">
            Add test users for authentication testing
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
                placeholder="Enter username"
                required
              />
            </div>

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
                placeholder="Enter email"
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
                placeholder="Enter password"
                required
              />
            </div>

            {result && (
              <div className={`text-sm rounded-lg p-3 ${
                result.success 
                  ? 'text-green-400 bg-green-900/20 border border-green-500/20' 
                  : 'text-red-400 bg-red-900/20 border border-red-500/20'
              }`}>
                {result.success ? (
                  <div>
                    {result.requiresConfirmation ? (
                      <div>
                        ✅ User created successfully!<br/>
                        <span className="text-gray-400">Email confirmation required.</span><br/>
                        <button
                          type="button"
                          onClick={handleConfirmEmail}
                          disabled={loading}
                          className="btn-primary mt-2 w-full"
                        >
                          {loading ? 'Confirming...' : '🔓 Confirm Email & Login'}
                        </button>
                      </div>
                    ) : result.confirmed ? (
                      <div>
                        ✅ Email confirmed successfully!<br/>
                        <span className="text-gray-400">You can now login with these credentials.</span>
                      </div>
                    ) : (
                      <div>
                        ✅ User created successfully!<br/>
                        <span className="text-gray-400">You can now test login with these credentials.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    ❌ Error: {result.error?.message || 'Failed to create user'}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Creating User...' : 'Add Test User'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm mb-4">
              After creating a user, you can test login at:
            </p>
            <Link 
              to="/login" 
              className="btn-secondary w-full"
            >
              🚀 Go to Login Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestUserSetup 