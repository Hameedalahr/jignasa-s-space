import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { progressService } from '../services/progressService'
import { useNavigate } from 'react-router-dom'
import { ShimmerStats, ShimmerDomainCard, ShimmerFavoriteItem, ShimmerSessionDetails } from './Shimmer'

// Domain data structure with actual total items per domain
const domainTotals = {
  'fullstack': { resources: 4, projects: 3, name: 'Full Stack Web Development', logo: '💻' },
  'dataeng': { resources: 3, projects: 2, name: 'Data Engineering', logo: '⚙️' },
  'dataanalyst': { resources: 3, projects: 2, name: 'Data Analyst', logo: '📊' },
  'datascientist': { resources: 3, projects: 2, name: 'Data Scientist', logo: '🧠' },
  'uiux': { resources: 3, projects: 2, name: 'UI/UX Design', logo: '🎨' },
  'product': { resources: 3, projects: 2, name: 'Product Manager', logo: '📋' },
  'hr': { resources: 3, projects: 2, name: 'HR Manager', logo: '👥' },
  'marketing': { resources: 3, projects: 2, name: 'Marketing', logo: '📈' },
  'freelance': { resources: 3, projects: 0, name: 'Freelance', logo: '💼' },
  'dsa': { resources: 6, projects: 0, name: 'Data Structures & Algorithms', logo: '🔢' }
}

const MyDashboard = () => {
  const { user, signOut } = useAuth()
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [domainProgress, setDomainProgress] = useState([])
  const [overallStats, setOverallStats] = useState({
    totalCompleted: 0,
    totalItems: 0,
    overallPercentage: 0
  })
  const [userFavorites, setUserFavorites] = useState([])
  const navigate = useNavigate()

  // Load progress from database
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user) return

      setLoading(true)
      try {
        // Load dashboard progress from database
        const { data: dashboardProgress, error } = await progressService.getDashboardProgress(user.id)
        
        if (error) {
          console.error('Error loading dashboard progress:', error)
          // Fallback to localStorage if database fails
          const savedProgress = localStorage.getItem('dashboardProgress')
          if (savedProgress) {
            const progress = JSON.parse(savedProgress)
            setDomainProgress(progress)
          }
        } else if (dashboardProgress && dashboardProgress.length > 0) {
          const updatedProgress = Object.keys(domainTotals).map(domainId => {
            const domainData = domainTotals[domainId]
            const dbProgress = dashboardProgress.find(p => p.domain_id === domainId)
            const totalItems = domainData.resources + domainData.projects
            const completed = dbProgress ? dbProgress.completed : 0
            const percentage = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0
            
            console.log(`Domain: ${domainData.name}, Completed: ${completed}, Total: ${totalItems}, Percentage: ${percentage}%`)
            
            return {
              id: domainId,
              name: domainData.name,
              completed: completed,
              total: totalItems,
              percentage: percentage
            }
          })

          setDomainProgress(updatedProgress)

          // Calculate overall stats from the updated progress
          const totalCompleted = updatedProgress.reduce((sum, domain) => sum + domain.completed, 0)
          const totalItems = updatedProgress.reduce((sum, domain) => sum + domain.total, 0)
          const overallPercentage = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0
          
          setOverallStats({
            totalCompleted,
            totalItems,
            overallPercentage
          })
        } else {
          // Initialize with zero progress
          const initialProgress = Object.keys(domainTotals).map(domainId => {
            const domainData = domainTotals[domainId]
            const totalItems = domainData.resources + domainData.projects
            
            return {
              id: domainId,
              name: domainData.name,
              completed: 0,
              total: totalItems,
              percentage: 0
            }
          })
          setDomainProgress(initialProgress)
          setOverallStats({
            totalCompleted: 0,
            totalItems: initialProgress.reduce((sum, domain) => sum + domain.total, 0),
            overallPercentage: 0
          })
        }

        // Load user favorites
        const { data: favoritesData, error: favoritesError } = await progressService.loadFavorites(user.id)
        if (favoritesError) {
          console.error('Error loading favorites:', favoritesError)
        } else if (favoritesData) {
          // Convert favorites data to a flat list for display
          const flatFavorites = []
          Object.keys(favoritesData).forEach(domainId => {
            const domainFavorites = favoritesData[domainId]
            const domainName = domainTotals[domainId]?.name || domainId
            
            // Add favorited resources
            Object.keys(domainFavorites.resources || {}).forEach(resourceTitle => {
              if (domainFavorites.resources[resourceTitle]) {
                flatFavorites.push({
                  title: resourceTitle,
                  type: 'Resource',
                  domain: domainName,
                  domainId: domainId
                })
              }
            })
            
            // Add favorited projects
            Object.keys(domainFavorites.projects || {}).forEach(projectTitle => {
              if (domainFavorites.projects[projectTitle]) {
                flatFavorites.push({
                  title: projectTitle,
                  type: 'Project',
                  domain: domainName,
                  domainId: domainId
                })
              }
            })
          })
          
          setUserFavorites(flatFavorites)
        }
      } catch (error) {
        console.error('Error loading user progress:', error)
        // Fallback to localStorage
        const savedProgress = localStorage.getItem('dashboardProgress')
        if (savedProgress) {
          const progress = JSON.parse(savedProgress)
          setDomainProgress(progress)
        }
      } finally {
        setLoading(false)
      }
    }

    loadUserProgress()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header Shimmer */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="w-64 h-10 bg-gray-700 rounded animate-pulse mb-2"></div>
              <div className="w-48 h-4 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="w-32 h-10 bg-gray-700 rounded animate-pulse"></div>
          </div>

          {/* Stats Shimmer */}
          <ShimmerStats />

          {/* Domain Completion Shimmer */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 bg-gray-700 rounded animate-pulse mr-2"></div>
              <div className="w-48 h-6 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ShimmerDomainCard key={i} />
              ))}
            </div>
          </div>

          {/* Favorites Shimmer */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 bg-gray-700 rounded animate-pulse mr-2"></div>
              <div className="w-32 h-6 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <ShimmerFavoriteItem key={i} />
              ))}
            </div>
          </div>

          {/* Session Details Shimmer */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center mb-6">
              <div className="w-6 h-6 bg-gray-700 rounded animate-pulse mr-2"></div>
              <div className="w-32 h-6 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <ShimmerSessionDetails />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400">My Dashboard</h1>
            <p className="text-gray-400">Track your learning progress and achievements</p>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 bg-gray-800 text-yellow-400 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-yellow-400 mb-4">Settings</h3>
              <div className="space-y-4">
                <button className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700">
                  🔐 Change Password
                </button>
                <button className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700">
                  📧 Update Email
                </button>
                <button className="w-full px-4 py-2 bg-gray-800 text-gray-300 rounded hover:bg-gray-700">
                  🔒 Two-Factor Authentication
                </button>
                <button 
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  🚪 Logout
                </button>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full px-4 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{overallStats.totalCompleted}</div>
            <div className="text-gray-400 text-sm font-medium">Topics Completed</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{overallStats.totalItems}</div>
            <div className="text-gray-400 text-sm font-medium">Total Topics</div>
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className={`text-4xl font-bold mb-2 ${
              overallStats.overallPercentage === 100 ? 'text-green-400' : 'text-yellow-400'
            }`}>
              {overallStats.overallPercentage}%
            </div>
            <div className="text-gray-400 text-sm font-medium">Overall Progress</div>
          </div>
        </div>

        {/* Domain-wise Completion */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-semibold text-yellow-400 mb-6 flex items-center">
            <span className="mr-2">📊</span>
            Domain-wise Completion
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {domainProgress.map((domain, index) => {
              console.log(`Rendering domain: ${domain.name}, percentage: ${domain.percentage}%, completed: ${domain.completed}, total: ${domain.total}`)
              return (
                <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                  {/* Domain name and logo/percentage in same row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-300 truncate">{domain.name}</div>
                      <div className="text-xs text-gray-500">
                        {domain.completed}/{domain.total} completed
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-3">
                      <div className="text-lg">{domainTotals[domain.id].logo}</div>
                      <div className={`text-lg font-bold ${
                        domain.percentage === 100 ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {domain.percentage}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ease-out ${
                        domain.percentage === 100 ? 'bg-green-400' : 'bg-yellow-400'
                      }`}
                      style={{ width: `${domain.percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Favorites List */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
          <h3 className="text-xl font-semibold text-yellow-400 mb-6 flex items-center">
            <span className="mr-2">⭐</span>
            My Favorites
          </h3>
          {userFavorites.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No favorites added yet. Start by adding some!</p>
          ) : (
            <div className="space-y-3">
              {userFavorites.map((favorite, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="text-yellow-400 text-lg">⭐</div>
                    <div>
                      <div className="font-medium text-white">{favorite.title}</div>
                      <div className="text-sm text-gray-400">{favorite.type} • {favorite.domain}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/domain/${favorite.domainId}`)}
                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                  >
                    👁️
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Session Details */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-semibold text-yellow-400 mb-6 flex items-center">
            <span className="mr-2">👤</span>
            Session Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400">User ID:</span>
              <span className="text-gray-300 font-mono">{user?.id}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400">Email:</span>
              <span className="text-gray-300">{user?.email}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400">Last Login:</span>
              <span className="text-gray-300">Today at {new Date().toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
              <span className="text-gray-400">Account Type:</span>
              <span className="text-yellow-400 font-semibold">Premium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyDashboard