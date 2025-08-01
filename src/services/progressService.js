import { supabase } from '../lib/supabase'

// Check if we're in development mode
const isDevelopmentMode = !import.meta.env.VITE_SUPABASE_URL

// Import actual domain totals from utility
import { domainTotals } from '../utils/resourceCounter'

export const progressService = {
  // Save user progress to database
  async saveProgress(userId, domainId, progressData) {
    console.log(`Saving progress for domain: ${domainId}`, progressData)
    if (isDevelopmentMode) {
      // In development mode, save to localStorage with user prefix
      const key = `userProgress_${userId}`
      const existingData = JSON.parse(localStorage.getItem(key) || '{}')
      existingData[domainId] = progressData
      localStorage.setItem(key, JSON.stringify(existingData))
      console.log(`Progress saved for domain: ${domainId}`)
      return { data: progressData, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          domain_id: domainId,
          progress_data: progressData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,domain_id'
        })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error saving progress:', error)
      return { data: null, error }
    }
  },

  // Load user progress from database
  async loadProgress(userId, domainId = null) {
    if (isDevelopmentMode) {
      // In development mode, load from localStorage with user prefix
      const key = `userProgress_${userId}`
      const data = JSON.parse(localStorage.getItem(key) || '{}')
      
      if (domainId) {
        return { data: data[domainId] || null, error: null }
      }
      return { data, error: null }
    }

    try {
      let query = supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)

      if (domainId) {
        query = query.eq('domain_id', domainId)
      }

      const { data, error } = await query

      if (error) throw error

      if (domainId) {
        return { data: data?.[0]?.progress_data || null, error: null }
      }

      // Convert array to object with domain_id as key
      const progressObject = {}
      data?.forEach(item => {
        progressObject[item.domain_id] = item.progress_data
      })

      return { data: progressObject, error: null }
    } catch (error) {
      console.error('Error loading progress:', error)
      return { data: null, error }
    }
  },

  // Save user favorites to database
  async saveFavorites(userId, domainId, favoritesData) {
    console.log(`Saving favorites for domain: ${domainId}`, favoritesData)
    if (isDevelopmentMode) {
      // In development mode, save to localStorage with user prefix
      const key = `userFavorites_${userId}`
      const existingData = JSON.parse(localStorage.getItem(key) || '{}')
      existingData[domainId] = favoritesData
      localStorage.setItem(key, JSON.stringify(existingData))
      console.log(`Favorites saved for domain: ${domainId}`)
      return { data: favoritesData, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .upsert({
          user_id: userId,
          domain_id: domainId,
          favorites_data: favoritesData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,domain_id'
        })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error saving favorites:', error)
      return { data: null, error }
    }
  },

  // Load user favorites from database
  async loadFavorites(userId, domainId = null) {
    if (isDevelopmentMode) {
      // In development mode, load from localStorage with user prefix
      const key = `userFavorites_${userId}`
      const data = JSON.parse(localStorage.getItem(key) || '{}')
      
      if (domainId) {
        return { data: data[domainId] || null, error: null }
      }
      return { data, error: null }
    }

    try {
      let query = supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', userId)

      if (domainId) {
        query = query.eq('domain_id', domainId)
      }

      const { data, error } = await query

      if (error) throw error

      if (domainId) {
        return { data: data?.[0]?.favorites_data || null, error: null }
      }

      // Convert array to object with domain_id as key
      const favoritesObject = {}
      data?.forEach(item => {
        favoritesObject[item.domain_id] = item.favorites_data
      })

      return { data: favoritesObject, error: null }
    } catch (error) {
      console.error('Error loading favorites:', error)
      return { data: null, error }
    }
  },

  // Get overall progress for dashboard
  async getDashboardProgress(userId) {
    if (isDevelopmentMode) {
      // In development mode, calculate from localStorage
      const progressKey = `userProgress_${userId}`
      const progressData = JSON.parse(localStorage.getItem(progressKey) || '{}')
      
      const dashboardProgress = []
      
      // Calculate progress for each domain
      Object.keys(progressData).forEach(domainId => {
        const domainProgress = progressData[domainId]
        if (domainProgress) {
          const completedResources = Object.values(domainProgress.resources || {}).filter(Boolean).length
          const completedProjects = Object.values(domainProgress.projects || {}).filter(Boolean).length
          const total = completedResources + completedProjects
          
          // Get total items for this domain
          const domainData = domainTotals[domainId]
          const totalItems = domainData ? domainData.resources + domainData.projects : 0
          
          dashboardProgress.push({
            domain_id: domainId,
            completed: total,
            percentage: totalItems > 0 ? Math.round((total / totalItems) * 100) : 0
          })
        }
      })
      
      console.log('Available domains in domainTotals:', Object.keys(domainTotals))
      console.log('Progress data keys:', Object.keys(progressData))
      console.log('Dashboard progress:', dashboardProgress)
      
      return { data: dashboardProgress, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('domain_id, progress_data')
        .eq('user_id', userId)

      if (error) throw error

      const dashboardProgress = data?.map(item => {
        const domainProgress = item.progress_data
        const completedResources = Object.values(domainProgress.resources || {}).filter(Boolean).length
        const completedProjects = Object.values(domainProgress.projects || {}).filter(Boolean).length
        const total = completedResources + completedProjects
        
        // Get total items for this domain
        const domainData = domainTotals[item.domain_id]
        const totalItems = domainData ? domainData.resources + domainData.projects : 0
        
        return {
          domain_id: item.domain_id,
          completed: total,
          percentage: totalItems > 0 ? Math.round((total / totalItems) * 100) : 0
        }
      }) || []

      return { data: dashboardProgress, error: null }
    } catch (error) {
      console.error('Error getting dashboard progress:', error)
      return { data: null, error }
    }
  }
} 