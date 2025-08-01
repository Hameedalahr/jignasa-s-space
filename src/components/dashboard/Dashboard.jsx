import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { progressService } from '../../services/progressService'
import { resources, projects } from '../DomainPage'
import { userManager } from '../../utils/userManager'

// Topic/type mapping for each domain (mirroring DomainTabs logic)
const domainTopics = {
  fullstack: [
    'HTML', 'CSS', 'JavaScript', 'React', 'NodeJS', 'ExpressJS', 'MongoDB'
  ],
  dataeng: [
    'SQL', 'Python', 'Git', 'MiniProjectsPhase1',
    'Spark', 'Pipelines', 'Platforms', 'MiniProjectsPhase2',
    'Cloud', 'Kafka', 'CICD', 'MiniProjectsPhase3',
    'Architectures', 'Modeling', 'Partitioning', 'Monitoring', 'MiniProjectsPhase4'
  ],
  dataanalyst: [
    'DataAnalyticsIntro', 'MathFundamentals', 'MiniProjectsPhase1',
    'ExcelBasics', 'AdvancedExcel', 'MiniProjectsPhase2',
    'SQLBasics', 'AdvancedSQL', 'MiniProjectsPhase3',
    'PythonBasics', 'PandasAnalysis', 'MiniProjectsPhase4',
    'PowerBIBasics', 'AdvancedPowerBI', 'MiniProjectsPhase5',
    'PortfolioProjects', 'GitHubDeployment', 'MiniProjectsPhase6',
    'MLFundamentals', 'MLAlgorithms', 'MiniProjectsPhase7'
  ],
  datascientist: [
    'DataScientistRole', 'PythonForDS', 'MiniProjectsPhase0',
    'MathLinearAlgebra', 'MathProbability', 'MathDescriptiveStats', 'MathInferentialStats',
    'DataAnalysis', 'DataVisualization', 'MiniProjectsPhase2',
    'MLBasics', 'SupervisedLearning', 'UnsupervisedLearning', 'ModelEvaluation', 'MiniProjectsPhase3',
    'FeatureEngineering', 'TimeSeries', 'DeepLearningIntro', 'NLPIntro', 'MiniProjectsPhase4',
    'ModelDeployment',
    'SQLForDS', 'CloudTools', 'MiniProjectsPhase6'
  ],
  uiux: [
    'Figma', 'Research', 'Prototyping', 'AdobeXD', 'Sketch', 'Principles'
  ],
  product: [
    'Strategy', 'Agile', 'Stakeholders', 'UserStories', 'Analytics', 'ABTesting'
  ],
  hr: [
    'Recruitment', 'HRManagement', 'EmployeeDev', 'Performance', 'Compensation', 'HRAnalytics'
  ],
  marketing: [
    'DigitalMarketing', 'SEO', 'SocialMedia', 'ContentMarketing', 'EmailMarketing', 'GoogleAds'
  ],
  freelance: [
    'BusinessSetup', 'ClientManagement', 'Portfolio', 'Pricing', 'TimeManagement', 'Legal'
  ],
  dsa: [
    'Arrays', 'LinkedLists', 'StacksQueues', 'TreesGraphs', 'DynamicProgramming', 'Sorting'
  ]
}

// Phase/topic mapping for domains with phases
const phaseTopics = {
  dataeng: {
    Phase1: ['SQL', 'Python', 'Git', 'MiniProjectsPhase1'],
    Phase2: ['Spark', 'Pipelines', 'Platforms', 'MiniProjectsPhase2'],
    Phase3: ['Cloud', 'Kafka', 'CICD', 'MiniProjectsPhase3'],
    Phase4: ['Architectures', 'Modeling', 'Partitioning', 'Monitoring', 'MiniProjectsPhase4']
  },
  dataanalyst: {
    Phase1: ['DataAnalyticsIntro', 'MathFundamentals', 'MiniProjectsPhase1'],
    Phase2: ['ExcelBasics', 'AdvancedExcel', 'MiniProjectsPhase2'],
    Phase3: ['SQLBasics', 'AdvancedSQL', 'MiniProjectsPhase3'],
    Phase4: ['PythonBasics', 'PandasAnalysis', 'MiniProjectsPhase4'],
    Phase5: ['PowerBIBasics', 'AdvancedPowerBI', 'MiniProjectsPhase5'],
    Phase6: ['PortfolioProjects', 'GitHubDeployment', 'MiniProjectsPhase6'],
    Phase7: ['MLFundamentals', 'MLAlgorithms', 'MiniProjectsPhase7']
  },
  datascientist: {
    Phase0: ['DataScientistRole', 'PythonForDS', 'MiniProjectsPhase0'],
    Phase1: ['MathLinearAlgebra', 'MathProbability', 'MathDescriptiveStats', 'MathInferentialStats'],
    Phase2: ['DataAnalysis', 'DataVisualization', 'MiniProjectsPhase2'],
    Phase3: ['MLBasics', 'SupervisedLearning', 'UnsupervisedLearning', 'ModelEvaluation', 'MiniProjectsPhase3'],
    Phase4: ['FeatureEngineering', 'TimeSeries', 'DeepLearningIntro', 'NLPIntro', 'MiniProjectsPhase4'],
    Phase5: ['ModelDeployment'],
    Phase6: ['SQLForDS', 'CloudTools', 'MiniProjectsPhase6']
  }
}

// Import actual domain totals from utility
import { domainTotals } from '../../utils/resourceCounter'

// Domain names and logos mapping
const domainInfo = {
  'fullstack': { name: 'Full Stack Web Development', logo: '💻' },
  'dataeng': { name: 'Data Engineering', logo: '⚙️' },
  'dataanalyst': { name: 'Data Analyst', logo: '📊' },
  'datascientist': { name: 'Data Scientist', logo: '🧠' },
  'uiux': { name: 'UI/UX Design', logo: '🎨' },
  'product': { name: 'Product Manager', logo: '📋' },
  'hr': { name: 'HR Manager', logo: '👥' },
  'marketing': { name: 'Marketing', logo: '📈' },
  'freelance': { name: 'Freelance', logo: '💼' },
  'dsa': { name: 'Data Structures & Algorithms', logo: '🔢' },
  'java': { name: 'Java Programming', logo: '🔷' },
  'python': { name: 'Python Programming', logo: '🟡' },
  'cpp': { name: 'C++ Programming', logo: '🔶' },
  'c': { name: 'C Programming', logo: '🔺' }
}

const ADMIN_EMAIL_KEY = 'jignasa_admin_emails'
function getAdminEmails() {
  const stored = localStorage.getItem(ADMIN_EMAIL_KEY)
  if (stored) return JSON.parse(stored)
  return ['syemeed@gmail.com']
}
function setAdminEmails(emails) {
  localStorage.setItem(ADMIN_EMAIL_KEY, JSON.stringify(emails))
}

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [domainProgress, setDomainProgress] = useState([])
  const [overallStats, setOverallStats] = useState({
    totalCompleted: 0,
    totalItems: 0,
    overallPercentage: 0
  })
  const [userFavorites, setUserFavorites] = useState([])
  const [showClearProgressWarning, setShowClearProgressWarning] = useState(false)
  const [showClearFavoritesWarning, setShowClearFavoritesWarning] = useState(false)
  const [adminEmails, setAdminEmailsState] = React.useState(getAdminEmails())
  React.useEffect(() => { setAdminEmailsState(getAdminEmails()) }, [])
  const isAdmin = user && adminEmails.includes(user.email)

  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user) return
      setLoading(true)
      try {
        // Load dashboard progress from database
        const { data: dashboardProgress, error } = await progressService.getDashboardProgress(user.id)
        let updatedProgress = []
        if (!error && dashboardProgress) {
          updatedProgress = Object.keys(domainTotals).map(domainId => {
            const domainData = domainTotals[domainId]
            const domainInfoData = domainInfo[domainId] || { name: domainId, logo: '📚' }
            const dbProgress = dashboardProgress.find(p => p.domain_id === domainId)
            const totalItems = domainData.resources + domainData.projects
            const completed = dbProgress ? dbProgress.completed : 0
            const percentage = totalItems > 0 ? Math.round((completed / totalItems) * 100) : 0
            
            console.log(`Domain: ${domainId}, Name: ${domainInfoData.name}, Resources: ${domainData.resources}, Projects: ${domainData.projects}, Completed: ${completed}`)
            
            return {
              id: domainId,
              name: domainInfoData.name,
              logo: domainInfoData.logo,
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
        }
        // Load user favorites
        const { data: favoritesData, error: favoritesError } = await progressService.loadFavorites(user.id)
        if (!favoritesError && favoritesData) {
          // Convert favorites data to a flat list for display
          const flatFavorites = []
          Object.keys(favoritesData).forEach(domainId => {
            const domainFavorites = favoritesData[domainId]
            // Add favorited resources
            Object.keys(domainFavorites.resources || {}).forEach(resourceTitle => {
              if (domainFavorites.resources[resourceTitle]) {
                flatFavorites.push({
                  title: resourceTitle,
                  type: 'Resource',
                  domain: domainId,
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
                  domain: domainId,
                  domainId: domainId
                })
              }
            })
          })
          setUserFavorites(flatFavorites)
        }
      } catch (error) {
        setDomainProgress([])
        setUserFavorites([])
      } finally {
        setLoading(false)
      }
    }
    loadUserProgress()
  }, [user])

  const handleSignOut = async () => {
    await signOut()
  }

  // Clear all progress for the user
  const handleClearProgress = async () => {
    setShowClearProgressWarning(false)
    if (!user) return
    // Clear progress for all domains
    const domainIds = Object.keys(domainTotals)
    console.log('Clearing progress for domains:', domainIds)
    for (const domainId of domainIds) {
      console.log(`Clearing progress for domain: ${domainId}`)
      await progressService.saveProgress(user.id, domainId, { resources: {}, projects: {} })
    }
    // Force reload
    window.location.reload()
  }

  // Clear all favorites for the user
  const handleClearFavorites = async () => {
    setShowClearFavoritesWarning(false)
    if (!user) return
    // Clear favorites for all domains
    const domainIds = Object.keys(domainTotals)
    console.log('Clearing favorites for domains:', domainIds)
    for (const domainId of domainIds) {
      console.log(`Clearing favorites for domain: ${domainId}`)
      await progressService.saveFavorites(user.id, domainId, { resources: {}, projects: {} })
    }
    // Force reload
    window.location.reload()
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'progress', name: 'Progress', icon: '📈' },
    { id: 'favorites', name: 'Favorites', icon: '⭐' },
    { id: 'profile', name: 'Profile', icon: '👤' },
    ...(isAdmin ? [{ id: 'adduser', name: 'Add a User', icon: '➕' }] : [])
  ]

  return (
    <div className="min-h-screen bg-primary">
      {/* Navigation Tabs */}
      <nav className="bg-gray-800/50 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex space-x-3 sm:space-x-8 overflow-x-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-800 py-2 sm:py-0"
            style={{ WebkitOverflowScrolling: 'touch' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-3 px-4 sm:py-4 sm:px-6 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-colors duration-200 min-w-[120px] sm:min-w-[0] focus:outline-none focus:ring-2 focus:ring-yellow-400
                  ${activeTab === tab.id
                    ? 'bg-yellow-400 text-black border-2 border-yellow-400'
                    : 'bg-black text-yellow-400 border-2 border-yellow-400 hover:bg-yellow-500 hover:text-yellow-400'}
                `}
                tabIndex={0}
              >
                <span className="text-lg sm:text-xl">{tab.icon}</span>
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
    <div className="space-y-6">
      {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="text-3xl font-bold text-white">{overallStats.totalCompleted}</div>
                <div className="text-sm text-gray-400">Resources Completed</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-white">{userFavorites.length}</div>
                <div className="text-sm text-gray-400">Favorites</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-white">{overallStats.totalItems}</div>
                <div className="text-sm text-gray-400">Total Resources</div>
              </div>
              <div className="card text-center">
                <div className="text-3xl font-bold text-white">{overallStats.overallPercentage}%</div>
                <div className="text-sm text-gray-400">Overall Progress</div>
              </div>
            </div>
            {/* Domain Progress */}
            <div className="card mt-8">
              <h3 className="text-lg font-semibold text-accent mb-4">Domain Progress</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {domainProgress.map(domain => (
                  <div key={domain.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-2xl">{domain.logo}</span>
                      <span className="font-semibold text-white">{domain.name}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-400 text-sm">{domain.completed} / {domain.total} completed</span>
                      <span className="text-accent font-semibold">{domain.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-accent h-2 rounded-full transition-all duration-300"
                        style={{ width: `${domain.percentage}%` }}
                      ></div>
            </div>
          </div>
        ))}
      </div>
            </div>
          </div>
        )}
        {activeTab === 'progress' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center relative">
              <h2 className="text-2xl font-bold text-white">📈 Learning Progress</h2>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-2 border-2 border-red-500 text-red-500 px-4 py-2 rounded-full font-semibold bg-transparent hover:bg-red-500 hover:text-red-600 transition-colors duration-200 shadow-sm"
                  onClick={() => setShowClearProgressWarning(true)}
                >
                  <span>🗑️</span>
                  Clear Progress
                </button>
                {showClearProgressWarning && (
                  <div className="ml-0 sm:ml-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-2 bg-[#181c23] border border-yellow-400 rounded-xl px-4 py-3 shadow-lg animate-fade-in w-full max-w-xs sm:max-w-none">
                    <span className="text-yellow-400 text-lg font-bold mb-2 sm:mb-0 text-center w-full">⚠️ Are you sure?</span>
                    <div className="flex flex-col sm:flex-row w-full gap-2">
                      <button className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold text-base hover:bg-red-700 transition-colors w-full sm:w-auto" onClick={handleClearProgress}>Yes</button>
                      <button className="bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold text-base hover:bg-yellow-500 transition-colors w-full sm:w-auto" onClick={() => setShowClearProgressWarning(false)}>Cancel</button>
                    </div>
                  </div>
                )}
        </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domainProgress.map(domain => (
                <div key={domain.id} className="card text-center">
                  <div className="text-2xl mb-2">{domain.logo}</div>
                  <div className="font-semibold text-white mb-1">{domain.name}</div>
                  <div className="text-gray-400 text-sm mb-2">{domain.completed} / {domain.total} completed</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <div
                      className="bg-accent h-2 rounded-full transition-all duration-300"
                      style={{ width: `${domain.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-accent font-semibold">{domain.percentage}%</div>
            </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center relative">
              <h2 className="text-2xl font-bold text-white">⭐ Favorites</h2>
              <div className="flex items-center gap-2">
                <button
                  className="flex items-center gap-2 border-2 border-red-500 text-red-500 px-4 py-2 rounded-full font-semibold bg-transparent hover:bg-red-500 hover:text-red-600 transition-colors duration-200 shadow-sm"
                  onClick={() => setShowClearFavoritesWarning(true)}
                >
                  <span>🗑️</span>
                  Clear Favorites
                </button>
                {showClearFavoritesWarning && (
                  <div className="ml-0 sm:ml-4 flex flex-col sm:flex-row items-center gap-2 sm:gap-2 bg-[#181c23] border border-yellow-400 rounded-xl px-4 py-3 shadow-lg animate-fade-in w-full max-w-xs sm:max-w-none">
                    <span className="text-yellow-400 text-lg font-bold mb-2 sm:mb-0 text-center w-full">⚠️ Are you sure?</span>
                    <div className="flex flex-col sm:flex-row w-full gap-2">
                      <button className="bg-red-600 text-white px-4 py-2 rounded-full font-semibold text-base hover:bg-red-700 transition-colors w-full sm:w-auto" onClick={handleClearFavorites}>Yes</button>
                      <button className="bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold text-base hover:bg-yellow-500 transition-colors w-full sm:w-auto" onClick={() => setShowClearFavoritesWarning(false)}>Cancel</button>
        </div>
      </div>
                )}
    </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userFavorites.length === 0 && <div className="text-gray-400">No favorites yet.</div>}
              {userFavorites.map((fav, idx) => (
                <div key={idx} className="card p-4 flex flex-col">
                  <div className="font-semibold text-white mb-1">{fav.title}</div>
                  <div className="text-gray-400 text-sm mb-2">{fav.type} - {fav.domain}</div>
                </div>
        ))}
      </div>
    </div>
        )}
        {activeTab === 'profile' && (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">👤 Profile</h2>
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center text-2xl">
            {user?.user_metadata?.username?.charAt(0) || user?.email?.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              {user?.user_metadata?.username || 'User'}
            </h3>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-accent mb-3">Account Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Member Since:</span>
                      <span className="text-white">
                        {user?.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : 'N/A'}
                      </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Account Type:</span>
                      <span className="text-yellow-400 font-bold">Premium</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Last Logged In:</span>
                      <span className="text-white">
                        {user?.last_sign_in_at
                          ? new Date(user.last_sign_in_at).toLocaleString()
                          : 'N/A'}
                      </span>
              </div>
              <div className="flex justify-between">
                      <span className="text-gray-400">Account Expiry:</span>
                      <span className="text-white">
                        {user?.user_metadata?.lifetime
                          ? <span className="text-yellow-400 font-bold">Lifetime Access</span>
                          : user?.user_metadata?.expires_at
                            ? new Date(user.user_metadata.expires_at).toLocaleDateString()
                            : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'adduser' && isAdmin && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">➕ Add a User</h2>
            {user.email === 'syemeed@gmail.com' && <AdminManagement onAdminsChange={setAdminEmailsState} />}
            <div className="card p-6 max-w-lg mx-auto mb-8">
              <AddUserForm />
            </div>
            <div className="card p-6 max-w-lg mx-auto">
              <BulkUserUpload />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard

function AddUserForm() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [lifetime, setLifetime] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState('')
  const [error, setError] = React.useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSuccess('')
    setError('')
    try {
      const result = await userManager.addTestUser(email, password, username, lifetime)
      if (result.success) {
        setSuccess('User added successfully!')
        setEmail('')
        setPassword('')
        setUsername('')
        setLifetime(false)
      } else {
        setError(result.error?.message || 'Failed to add user.')
      }
    } catch (err) {
      setError(err.message || 'Failed to add user.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && <div className="p-2 bg-green-900/20 border border-green-500/20 rounded text-green-400">{success}</div>}
      {error && <div className="p-2 bg-red-900/20 border border-red-500/20 rounded text-red-400">{error}</div>}
      <div>
        <label className="block text-sm text-gray-300 mb-1">Email</label>
        <input type="email" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" value={email} onChange={e => setEmail(e.target.value)} required disabled={loading} />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Password</label>
        <input type="password" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" value={password} onChange={e => setPassword(e.target.value)} required disabled={loading} />
      </div>
      <div>
        <label className="block text-sm text-gray-300 mb-1">Username</label>
        <input type="text" className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" value={username} onChange={e => setUsername(e.target.value)} required disabled={loading} />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-300">
          <input type="checkbox" checked={lifetime} onChange={e => setLifetime(e.target.checked)} disabled={loading} />
          Lifetime Access
        </label>
        <span className="text-xs text-gray-400">{lifetime ? 'No expiry' : 'Valid for 6 months'}</span>
      </div>
      <button type="submit" className="w-full bg-yellow-400 text-black font-bold py-2 rounded hover:bg-yellow-500 transition-colors disabled:opacity-60" disabled={loading}>
        {loading ? 'Adding...' : 'Add User'}
      </button>
    </form>
  )
}

function BulkUserUpload() {
  const [csvText, setCsvText] = React.useState('')
  const [rows, setRows] = React.useState([])
  const [parsing, setParsing] = React.useState(false)
  const [results, setResults] = React.useState([])
  const [uploading, setUploading] = React.useState(false)

  function parseCSV(text) {
    const lines = text.trim().split(/\r?\n/)
    const header = lines[0].split(',').map(h => h.trim().toLowerCase())
    const dataRows = lines.slice(1).map(line => {
      const cols = line.split(',').map(c => c.trim())
      const obj = {}
      header.forEach((h, i) => { obj[h] = cols[i] })
      return obj
    })
    return dataRows
  }

  const handleParse = () => {
    setParsing(true)
    setResults([])
    try {
      const parsed = parseCSV(csvText)
      setRows(parsed)
    } catch (e) {
      setRows([])
    }
    setParsing(false)
  }

  const handleUpload = async () => {
    setUploading(true)
    setResults([])
    const newResults = []
    for (const row of rows) {
      const email = row.email?.trim()
      const password = row.password?.trim()
      const username = row.username?.trim()
      const lifetime = row.lifetime?.toLowerCase() === 'true'
      // Validation
      if (!email || !email.includes('@')) {
        newResults.push({ email: email || '(blank)', success: false, error: 'Invalid or missing email' })
        continue
      }
      if (!password) {
        newResults.push({ email, success: false, error: 'Missing password' })
        continue
      }
      if (!username) {
        newResults.push({ email, success: false, error: 'Missing username' })
        continue
      }
      try {
        const result = await userManager.addTestUser(email, password, username, lifetime)
        newResults.push({ email, success: result.success, error: result.error?.message })
      } catch (e) {
        newResults.push({ email, success: false, error: e.message })
      }
    }
    setResults(newResults)
    setUploading(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      setCsvText(event.target.result)
    }
    reader.readAsText(file)
  }

  const handleDownloadTemplate = () => {
    const template = 'email,password,username,lifetime\nuser1@example.com,pass123,User1,true\nuser2@example.com,pass456,User2,false'
    const blob = new Blob([template], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'user_template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
          <div>
      <h3 className="text-lg font-semibold text-white mb-2">Bulk User Upload (CSV)</h3>
      <div className="mb-2 text-gray-300 text-sm">Upload a CSV file or paste CSV data below. Each row should have: <span className='font-mono'>email, password, username, lifetime</span>. <span className='text-yellow-400'>Lifetime</span> is <span className='font-mono'>true</span> for lifetime access, <span className='font-mono'>false</span> or blank for 6 months.</div>
      <div className="flex flex-col sm:flex-row gap-2 mb-2">
        <label className="block text-xs text-gray-400 font-semibold">CSV File:
          <input type="file" accept=".csv" onChange={handleFileChange} disabled={uploading} className="block mt-1 text-xs text-gray-300" />
        </label>
        <button type="button" className="bg-yellow-400 text-black font-bold py-1 px-4 rounded hover:bg-yellow-500 transition-colors disabled:opacity-60 flex items-center gap-2" onClick={handleDownloadTemplate} disabled={uploading}>
          <span>⬇️</span> Download Template
              </button>
      </div>
      <div className="mb-2 text-xs text-gray-400">Or paste CSV data below:</div>
      <textarea
        className="w-full h-32 p-2 rounded bg-gray-900 border-2 border-gray-700 text-white font-mono text-xs mb-2 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 transition-all"
        placeholder="email,password,username,lifetime\nuser1@example.com,pass123,User1,true\nuser2@example.com,pass456,User2,false"
        value={csvText}
        onChange={e => setCsvText(e.target.value)}
        disabled={uploading}
      />
      <div className="mb-2 text-xs text-gray-400">
        <div className="mb-1">Example:</div>
        <pre className="bg-gray-800 border border-gray-700 rounded p-2 text-yellow-200 font-mono text-xs overflow-x-auto">
email,password,username,lifetime\nuser1@example.com,pass123,User1,true\nuser2@example.com,pass456,User2,false
        </pre>
      </div>
      <div className="flex gap-2 mb-2 flex-col sm:flex-row">
        <button type="button" className="bg-yellow-400 text-black font-bold py-1 px-4 rounded hover:bg-yellow-500 transition-colors disabled:opacity-60 flex items-center gap-2" onClick={handleParse} disabled={parsing || uploading}>
          <span>🧮</span> Parse CSV
              </button>
        <button type="button" className="bg-green-500 text-white font-bold py-1 px-4 rounded hover:bg-green-600 transition-colors disabled:opacity-60 flex items-center gap-2" onClick={handleUpload} disabled={uploading || rows.length === 0}>
          <span>⬆️</span> {uploading ? 'Uploading...' : 'Upload Users'}
              </button>
      </div>
      {rows.length > 0 && (
        <div className="mb-2 text-xs text-gray-400">
          <div>Preview ({rows.length} users):</div>
          <ul className="list-disc ml-6">
            {rows.map((row, i) => (
              <li key={i}>{row.email} | {row.username} | {row.lifetime}</li>
            ))}
          </ul>
        </div>
      )}
      {results.length > 0 && (
        <div className="mt-2">
          <div className="font-semibold text-white mb-1">Results:</div>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="text-green-400 font-bold mb-1">✅ Added to Database ({results.filter(r => r.success).length}):</div>
              <ul className="text-xs">
                {results.filter(r => r.success).map((res, i) => (
                  <li key={i}>{res.email}</li>
                ))}
              </ul>
            </div>
            <div className="flex-1">
              <div className="text-red-400 font-bold mb-1">❌ Not Added ({results.filter(r => !r.success).length}):</div>
              <ul className="text-xs">
                {results.filter(r => !r.success).map((res, i) => (
                  <li key={i}>{res.email}: <span className="font-normal">{res.error}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminManagement({ onAdminsChange }) {
  const [newAdmin, setNewAdmin] = React.useState('')
  const [admins, setAdmins] = React.useState(getAdminEmails())
  const [error, setError] = React.useState('')
  const [success, setSuccess] = React.useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    const email = newAdmin.trim().toLowerCase()
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (admins.includes(email)) {
      setError('This email is already an admin.')
      return
    }
    const updated = [...admins, email]
    setAdminEmails(updated)
    setAdmins(updated)
    setNewAdmin('')
    setSuccess('Admin added successfully!')
    if (onAdminsChange) onAdminsChange(updated)
  }

  return (
    <div className="card p-4 mb-6 bg-gray-900 border border-yellow-400">
      <h3 className="text-lg font-bold text-yellow-400 mb-2 flex items-center gap-2">👑 Admin Management</h3>
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-2 mb-2">
        <input type="email" className="px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white text-sm flex-1" placeholder="Add admin email" value={newAdmin} onChange={e => setNewAdmin(e.target.value)} required />
        <button type="submit" className="bg-yellow-400 text-black font-bold py-2 px-4 rounded hover:bg-yellow-500 transition-colors">Add Admin</button>
      </form>
      {error && <div className="text-red-400 text-xs mb-1">{error}</div>}
      {success && <div className="text-green-400 text-xs mb-1">{success}</div>}
      <div className="text-xs text-gray-300 mt-2">
        <div className="mb-1 font-semibold text-white">Current Admins:</div>
        <ul className="list-disc ml-6">
          {admins.map((email, i) => <li key={i} className="text-yellow-300">{email}</li>)}
        </ul>
      </div>
    </div>
  )
}