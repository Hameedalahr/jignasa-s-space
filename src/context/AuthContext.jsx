import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  return useContext(AuthContext)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if we're in development mode (no .env file)
  const isDevelopmentMode = !import.meta.env.VITE_SUPABASE_URL

  useEffect(() => {
    if (isDevelopmentMode) {
      // Development mode: bypass authentication
      console.log('🔧 Development mode: Bypassing authentication')
      setUser({
        id: 'dev-user-123',
        email: 'dev@example.com',
        user_metadata: {
          username: 'Developer'
        }
      })
      setLoading(false)
      return
    }

    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
        setLoading(false)
      } catch (error) {
        console.error('Error getting session:', error)
        setUser(null)
        setLoading(false)
      }
    }

    getSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [isDevelopmentMode])

  const signIn = async (email, password) => {
    if (isDevelopmentMode) {
      // Development mode: always succeed
      console.log('🔧 Development mode: Mock login successful')
      return { data: { user: { id: 'dev-user-123', email } }, error: null }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    if (isDevelopmentMode) {
      // Development mode: mock signout
      console.log('🔧 Development mode: Mock signout')
      setUser(null)
      return { error: null }
    }

    try {
      console.log('Signing out from Supabase...')
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Supabase sign out error:', error)
        throw error
      }
      
      console.log('Successfully signed out from Supabase')
      setUser(null)
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 