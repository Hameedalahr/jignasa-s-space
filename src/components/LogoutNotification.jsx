import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const LogoutNotification = () => {
  const [showNotification, setShowNotification] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Listen for logout events
    const handleStorageChange = (e) => {
      if (e.key === 'logout_event' && e.newValue === 'true') {
        setShowNotification(true)
        localStorage.removeItem('logout_event')
      }
    }

    window.addEventListener('storage', handleStorageChange)
    
    // Check if we were logged out
    if (localStorage.getItem('logout_event') === 'true') {
      setShowNotification(true)
      localStorage.removeItem('logout_event')
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const handleClose = () => {
    setShowNotification(false)
    navigate('/login')
  }

  if (!showNotification) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full border border-red-500/20">
        <div className="text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-red-400 mb-2">
            Session Ended
          </h3>
          <p className="text-gray-300 mb-4">
            You have been logged out because a new login was detected on another device.
          </p>
          <div className="text-sm text-gray-400 mb-6">
            This is part of our single device login security feature.
          </div>
          <button
            onClick={handleClose}
            className="btn-primary w-full"
          >
            🔄 Return to Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default LogoutNotification 