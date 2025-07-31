import { supabase } from '../lib/supabase'

// Utility functions for user management
export const userManager = {
  // Add a single test user
  async addTestUser(email, password, username, lifetime = false) {
    // First, create the user in Supabase Auth
    const expiresAt = lifetime ? null : new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000) // 6 months from now
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          expires_at: expiresAt ? expiresAt.toISOString() : null,
          lifetime: !!lifetime
        }
      }
    })

    if (authError) {
      console.error('Error creating user:', authError)
      return { success: false, error: authError }
    }

    // Check if email confirmation is required
    if (authData.user && !authData.user.email_confirmed_at) {
      console.log('User created but email confirmation required:', {
        email,
        username,
        userId: authData.user?.id
      })

      return { 
        success: true, 
        user: authData.user,
        message: 'User created successfully! Email confirmation required. Check your email or use the login page to confirm.',
        requiresConfirmation: true
      }
    }

    console.log('Test user created successfully:', {
      email,
      username,
      userId: authData.user?.id
    })

    return { success: true, user: authData.user }
  },

  // Add multiple users (for when you have the 100 credentials)
  async addMultipleUsers(users) {
    const results = []
    
    for (const user of users) {
      const result = await this.addTestUser(user.email, user.password, user.username)
      results.push({ user: user.email, ...result })
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    return results
  },

  // Get current user info
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Confirm email manually (for testing)
  async confirmEmail(email, password) {
    try {
      // Try to sign in to trigger email confirmation
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        return { success: false, error }
      }
      
      return { success: true, user: data.user }
    } catch (error) {
      return { success: false, error }
    }
  },

  // List all users (admin function)
  async listUsers() {
    // Note: This requires admin privileges in Supabase
    // You might need to implement this through your backend
    console.log('List users functionality requires admin access')
  }
}

// Example usage:
// const testUser = {
//   email: 'test@jignasa.com',
//   password: 'testpassword123',
//   username: 'TestUser'
// }
// 
// userManager.addTestUser(testUser.email, testUser.password, testUser.username)
//   .then(result => console.log('User creation result:', result)) 