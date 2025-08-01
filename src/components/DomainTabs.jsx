import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { progressService } from '../services/progressService'
import { ShimmerTabContent } from './Shimmer'
import fullstackRoadmap from '../assets/roadmaps/FULL STACK ROADMAP.png'
import dataengineeringRoadmap from '../assets/roadmaps/dataengineering.png'
import dataanalyticsRoadmap from '../assets/roadmaps/Data Analytics.png'
import datascientistRoadmap from '../assets/roadmaps/Data Scientist.png'
import cProgrammingRoadmap from '../assets/roadmaps/C programming.png'
import cppProgrammingRoadmap from '../assets/roadmaps/Cpp.png'
import javaProgrammingRoadmap from '../assets/roadmaps/java.png'
import pythonProgrammingRoadmap from '../assets/roadmaps/python.png'
import uiuxDesignRoadmap from '../assets/roadmaps/Ui Ux.png'
import freelancingRoadmap from '../assets/roadmaps/Freelancing.png'
const DomainTabs = ({ selectedDomain, roadmaps, resources, projects }) => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('roadmaps')
  const [completedItems, setCompletedItems] = useState({})
  const [expandedSections, setExpandedSections] = useState({})
  const [favorites, setFavorites] = useState({})
  const [loading, setLoading] = useState(true)
  const [showImageModal, setShowImageModal] = useState(false)
  const [modalImage, setModalImage] = useState(null)
  const [modalImageAlt, setModalImageAlt] = useState('')

  const roadmapImages = {
    fullstack: fullstackRoadmap,
    dataeng: dataengineeringRoadmap,
    dataanalyst: dataanalyticsRoadmap,
    datascientist: datascientistRoadmap,
    c: cProgrammingRoadmap,
    cpp: cppProgrammingRoadmap,
    java: javaProgrammingRoadmap,
    python: pythonProgrammingRoadmap,
    uiux: uiuxDesignRoadmap,
    freelance: freelancingRoadmap,
    // ... other domains ...
  }

  // Initialize completed items for this domain
  useEffect(() => {
    if (selectedDomain && user) {
      const domainKey = selectedDomain.id
      if (!completedItems[domainKey]) {
        setCompletedItems(prev => ({
          ...prev,
          [domainKey]: {
            resources: {},
            projects: {}
          }
        }))
      }
      if (!favorites[domainKey]) {
        setFavorites(prev => ({
          ...prev,
          [domainKey]: {
            resources: {},
            projects: {}
          }
        }))
      }
    }
  }, [selectedDomain, user, completedItems, favorites])

  // Load progress from database when component mounts or user changes
  useEffect(() => {
    const loadUserProgress = async () => {
      if (!user) return

      setLoading(true)
      try {
        // Load all progress for the user
        const { data: progressData, error: progressError } = await progressService.loadProgress(user.id)
        if (progressError) {
          console.error('Error loading progress:', progressError)
        } else if (progressData) {
          setCompletedItems(progressData)
        }

        // Load all favorites for the user
        const { data: favoritesData, error: favoritesError } = await progressService.loadFavorites(user.id)
        if (favoritesError) {
          console.error('Error loading favorites:', favoritesError)
        } else if (favoritesData) {
          setFavorites(favoritesData)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUserProgress()
  }, [user])

  // Save progress to database whenever it changes
  useEffect(() => {
    const saveProgress = async () => {
      if (!user || !selectedDomain || loading) return

      try {
        const domainKey = selectedDomain.id
        const domainProgress = completedItems[domainKey]
        
        if (domainProgress) {
          await progressService.saveProgress(user.id, domainKey, domainProgress)
        }
      } catch (error) {
        console.error('Error saving progress:', error)
      }
    }

    saveProgress()
  }, [completedItems, user, selectedDomain, loading])

  // Save favorites to database whenever they change
  useEffect(() => {
    const saveFavorites = async () => {
      if (!user || !selectedDomain || loading) return

      try {
        const domainKey = selectedDomain.id
        const domainFavorites = favorites[domainKey]
        
        if (domainFavorites) {
          await progressService.saveFavorites(user.id, domainKey, domainFavorites)
        }
      } catch (error) {
        console.error('Error saving favorites:', error)
      }
    }

    saveFavorites()
  }, [favorites, user, selectedDomain, loading])

  // Update dashboard progress
  useEffect(() => {
    const updateDashboardProgress = async () => {
      if (!user || !selectedDomain || loading) return

      try {
        const domainKey = selectedDomain.id
        const domainCompleted = completedItems[domainKey]
        
        if (domainCompleted) {
          const completedResources = Object.values(domainCompleted.resources || {}).filter(Boolean).length
          const completedProjects = Object.values(domainCompleted.projects || {}).filter(Boolean).length
          const totalResources = (resources[domainKey] || []).length
          const totalProjects = (projects[domainKey] || []).length
          
          const completed = completedResources + completedProjects
          const total = totalResources + totalProjects
          
          // Update dashboard progress in localStorage for now (can be moved to database later)
          const dashboardProgress = JSON.parse(localStorage.getItem('dashboardProgress') || '[]')
          const domainIndex = dashboardProgress.findIndex(d => d.name === selectedDomain.name)
          
          if (domainIndex >= 0) {
            dashboardProgress[domainIndex] = {
              name: selectedDomain.name,
              completed,
              total,
              percentage: total > 0 ? Math.round((completed / total) * 100) : 0
            }
          } else {
            dashboardProgress.push({
              name: selectedDomain.name,
              completed,
              total,
              percentage: total > 0 ? Math.round((completed / total) * 100) : 0
            })
          }
          
          localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress))
        }
      } catch (error) {
        console.error('Error updating dashboard progress:', error)
      }
    }

    updateDashboardProgress()
  }, [completedItems, selectedDomain, resources, projects, user, loading])

  const handleTabClick = (tabId) => {
    console.log('Tab clicked:', tabId)
    setActiveTab(tabId)
  }

  const toggleComplete = async (item, type, itemId) => {
    if (!user) {
      console.log('User not logged in, cannot save progress')
      return
    }

    const domainKey = selectedDomain.id
    const newCompletedItems = { ...completedItems }
    
    if (type === 'resource') {
      newCompletedItems[domainKey].resources[itemId] = !newCompletedItems[domainKey].resources[itemId]
    } else if (type === 'project') {
      newCompletedItems[domainKey].projects[itemId] = !newCompletedItems[domainKey].projects[itemId]
    }
    
    setCompletedItems(newCompletedItems)
    console.log(`Marked ${item.title} as ${newCompletedItems[domainKey][type === 'resource' ? 'resources' : 'projects'][itemId] ? 'completed' : 'incomplete'}`)
  }

  const toggleFavorite = async (item, type, itemId) => {
    if (!user) {
      console.log('User not logged in, cannot save favorites')
      return
    }

    const domainKey = selectedDomain.id
    const newFavorites = { ...favorites }
    
    if (type === 'resource') {
      newFavorites[domainKey].resources[itemId] = !newFavorites[domainKey].resources[itemId]
    } else if (type === 'project') {
      newFavorites[domainKey].projects[itemId] = !newFavorites[domainKey].projects[itemId]
    }
    
    setFavorites(newFavorites)
    console.log(`Toggled favorite for ${item.title}`)
  }

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }))
  }

  // Calculate progress
  const getProgress = () => {
    if (!selectedDomain || !completedItems[selectedDomain.id]) return { completed: 0, total: 0, percentage: 0 }
    
    const domainKey = selectedDomain.id
    const domainCompleted = completedItems[domainKey]
    
    const completedResources = Object.values(domainCompleted.resources || {}).filter(Boolean).length
    const completedProjects = Object.values(domainCompleted.projects || {}).filter(Boolean).length
    
    const totalResources = (resources[domainKey] || []).length
    const totalProjects = (projects[domainKey] || []).length
    
    const completed = completedResources + completedProjects
    const total = totalResources + totalProjects
    
    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0
    }
  }

  const isItemCompleted = (item, type, itemId) => {
    const domainKey = selectedDomain.id
    if (!completedItems[domainKey]) return false
    
    if (type === 'resource') {
      return completedItems[domainKey].resources[itemId] || false
    } else if (type === 'project') {
      return completedItems[domainKey].projects[itemId] || false
    }
    return false
  }

  const isItemFavorited = (item, type, itemId) => {
    const domainKey = selectedDomain.id
    if (!favorites[domainKey]) return false
    
    if (type === 'resource') {
      return favorites[domainKey].resources[itemId] || false
    } else if (type === 'project') {
      return favorites[domainKey].projects[itemId] || false
    }
    return false
  }

  const openImageModal = (imageSrc, imageAlt) => {
    setModalImage(imageSrc)
    setModalImageAlt(imageAlt)
    setShowImageModal(true)
  }

  const closeImageModal = () => {
    setShowImageModal(false)
    setModalImage(null)
    setModalImageAlt('')
  }

  const downloadImage = (imageSrc, imageAlt) => {
    const link = document.createElement('a')
    link.href = imageSrc
    link.download = `${imageAlt.replace(/\s+/g, '_')}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleImageDoubleClick = (imageSrc, imageAlt) => {
    openImageModal(imageSrc, imageAlt)
  }

  if (!selectedDomain) {
    return null
  }

  const progress = getProgress()

  // Show loading state
  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 mt-6">
        {/* Header Shimmer */}
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gray-700 rounded animate-pulse mr-4"></div>
          <div>
            <div className="w-48 h-8 bg-gray-700 rounded animate-pulse mb-2"></div>
            <div className="w-64 h-4 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Progress Tracker Shimmer */}
        <div className="mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="w-16 h-4 bg-gray-700 rounded animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-700 rounded animate-pulse"></div>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Tabs Shimmer */}
        <div className="flex space-x-1 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-24 h-10 bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>

        {/* Tab Content Shimmer */}
        <ShimmerTabContent />
      </div>
    )
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 mt-6">
      <div className="flex items-center mb-6">
        <div className="text-3xl mr-4">{selectedDomain.icon}</div>
        <div>
          <h2 className="text-2xl font-bold text-yellow-400">{selectedDomain.name}</h2>
          <p className="text-gray-400">{selectedDomain.description}</p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="mb-6 p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-400">Progress</span>
          <span className="text-yellow-400 font-semibold">{progress.completed}/{progress.total} Topics Completed</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress.percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {[
          { id: 'roadmaps', name: 'Roadmaps', icon: '🛤️' },
          { id: 'resources', name: 'Resources', icon: '📚' },
          // Only show projects tab if the domain has projects
          ...(projects[selectedDomain.id] && projects[selectedDomain.id].length > 0 ? [{ id: 'projects', name: 'Projects', icon: '💼' }] : [])
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-yellow-400 text-black'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-96">
        {activeTab === 'roadmaps' && (
          <div className="space-y-6">
            <div className="text-center">
              {selectedDomain.id === 'fullstack' ? (
                <div className="mb-6 relative group">
                  <img 
                    src={fullstackRoadmap} 
                    alt="Full Stack Web Development Roadmap" 
                    className="w-full sm:w-auto max-w-full h-auto object-contain rounded-lg shadow-lg border border-gray-700 cursor-pointer transition-transform max-h-60 sm:max-h-[600px]"
                    onDoubleClick={() => handleImageDoubleClick(fullstackRoadmap, 'Full Stack Web Development Roadmap')}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => downloadImage(fullstackRoadmap, 'Full Stack Web Development Roadmap')}
                      className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ) : selectedDomain.id === 'dataeng' ? (
                <div className="mb-6 relative group">
                  <img 
                    src={dataengineeringRoadmap} 
                    alt="Data Engineering Roadmap" 
                    className="w-full sm:w-auto max-w-full h-auto object-contain rounded-lg shadow-lg border border-gray-700 cursor-pointer transition-transform max-h-60 sm:max-h-[600px]"
                    onDoubleClick={() => handleImageDoubleClick(dataengineeringRoadmap, 'Data Engineering Roadmap')}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => downloadImage(dataengineeringRoadmap, 'Data Engineering Roadmap')}
                      className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ) : selectedDomain.id === 'dataanalyst' ? (
                <div className="mb-6 relative group">
                  <img 
                    src={dataanalyticsRoadmap} 
                    alt="Data Analytics Roadmap" 
                    className="w-full sm:w-auto max-w-full h-auto object-contain rounded-lg shadow-lg border border-gray-700 cursor-pointer transition-transform max-h-60 sm:max-h-[600px]"
                    onDoubleClick={() => handleImageDoubleClick(dataanalyticsRoadmap, 'Data Analytics Roadmap')}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => downloadImage(dataanalyticsRoadmap, 'Data Analytics Roadmap')}
                      className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ) : selectedDomain.id === 'datascientist' ? (
                <div className="mb-6 relative group">
                  <img 
                    src={datascientistRoadmap} 
                    alt="Data Scientist Roadmap" 
                    className="w-full sm:w-auto max-w-full h-auto object-contain rounded-lg shadow-lg border border-gray-700 cursor-pointer transition-transform max-h-60 sm:max-h-[600px]"
                    onDoubleClick={() => handleImageDoubleClick(datascientistRoadmap, 'Data Scientist Roadmap')}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => downloadImage(datascientistRoadmap, 'Data Scientist Roadmap')}
                      className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ) : selectedDomain.id === 'c' ? (
                <div className="mb-6 relative group">
                  <img 
                    src={cProgrammingRoadmap} 
                    alt="C Programming Roadmap" 
                    className="w-full sm:w-auto max-w-full h-auto object-contain rounded-lg shadow-lg border border-gray-700 cursor-pointer transition-transform max-h-60 sm:max-h-[600px]"
                    onDoubleClick={() => handleImageDoubleClick(cProgrammingRoadmap, 'C Programming Roadmap')}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => downloadImage(cProgrammingRoadmap, 'C Programming Roadmap')}
                      className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ) : selectedDomain.id === 'cpp' ? (
                <div className="mb-6 relative group">
                  <img 
                    src={cppProgrammingRoadmap} 
                    alt="C++ Programming Roadmap" 
                    className="w-full sm:w-auto max-w-full h-auto object-contain rounded-lg shadow-lg border border-gray-700 cursor-pointer transition-transform max-h-60 sm:max-h-[600px]"
                    onDoubleClick={() => handleImageDoubleClick(cppProgrammingRoadmap, 'C++ Programming Roadmap')}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => downloadImage(cppProgrammingRoadmap, 'C++ Programming Roadmap')}
                      className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ) : selectedDomain.id === 'java' ? (
                <div className="mb-6 relative group">
                  <img 
                    src={javaProgrammingRoadmap} 
                    alt="Java Programming Roadmap" 
                    className="w-full sm:w-auto max-w-full h-auto object-contain rounded-lg shadow-lg border border-gray-700 cursor-pointer transition-transform max-h-60 sm:max-h-[600px]"
                    onDoubleClick={() => handleImageDoubleClick(javaProgrammingRoadmap, 'Java Programming Roadmap')}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => downloadImage(javaProgrammingRoadmap, 'Java Programming Roadmap')}
                      className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ) : selectedDomain.id === 'python' ? (
                <div className="mb-6 relative group">
                  <img 
                    src={pythonProgrammingRoadmap} 
                    alt="Python Programming Roadmap" 
                    className="w-full sm:w-auto max-w-full h-auto object-contain rounded-lg shadow-lg border border-gray-700 cursor-pointer transition-transform max-h-60 sm:max-h-[600px]"
                    onDoubleClick={() => handleImageDoubleClick(pythonProgrammingRoadmap, 'Python Programming Roadmap')}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => downloadImage(pythonProgrammingRoadmap, 'Python Programming Roadmap')}
                      className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ) : selectedDomain.id === 'uiux' ? (
                <div className="mb-6 relative group">
                  <img 
                    src={uiuxDesignRoadmap} 
                    alt="UI/UX Design Roadmap" 
                    className="w-full sm:w-auto max-w-full h-auto object-contain rounded-lg shadow-lg border border-gray-700 cursor-pointer transition-transform max-h-60 sm:max-h-[600px]"
                    onDoubleClick={() => handleImageDoubleClick(uiuxDesignRoadmap, 'UI/UX Design Roadmap')}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => downloadImage(uiuxDesignRoadmap, 'UI/UX Design Roadmap')}
                      className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ) : selectedDomain.id === 'freelance' ? (
                <div className="mb-6 relative group">
                  <img 
                    src={freelancingRoadmap} 
                    alt="Freelancing Roadmap" 
                    className="w-full sm:w-auto max-w-full h-auto object-contain rounded-lg shadow-lg border border-gray-700 cursor-pointer transition-transform max-h-60 sm:max-h-[600px]"
                    onDoubleClick={() => handleImageDoubleClick(freelancingRoadmap, 'Freelancing Roadmap')}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => downloadImage(freelancingRoadmap, 'Freelancing Roadmap')}
                      className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors border border-gray-600"
                    >
                      📥 Download
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-6xl mb-4">{roadmaps[selectedDomain.id]?.image || '🛤️'}</div>
              )}
              <h3 className="text-xl font-semibold mb-4">Learning Roadmap</h3>
              <p className="text-gray-400 mb-6">{roadmaps[selectedDomain.id]?.description || 'Roadmap description coming soon...'}</p>
              
              {/* Hiring Companies section removed as per user request */}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-yellow-400">Learning Resources</h3>
              <span className="text-sm text-gray-400">({(resources[selectedDomain.id] || []).length} resources)</span>
            </div>
            
            {/* Resource Categories */}
            <div className="space-y-4">
              {selectedDomain.id === 'fullstack' ? (
                <>
                  {/* HTML Section */}
                  <div className="bg-gray-800 rounded-lg">
                    <button
                      onClick={() => toggleSection('html')}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors bg-gray-800 text-white"
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">🌐</span>
                        <span className="font-semibold text-white">HTML</span>
                        <span className="ml-2 text-sm text-gray-300">
                          ({(resources[selectedDomain.id] || []).filter(r => r.type === 'HTML').length})
                        </span>
                      </div>
                      <span className="text-gray-300">
                        {expandedSections['html'] ? '▼' : '▶'}
                      </span>
                    </button>
                    
                    {expandedSections['html'] && (
                      <div className="px-4 pb-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 w-16">Status</th>
                                <th className="text-center py-3 px-4 w-16">Star</th>
                                <th className="text-left py-3 px-4">Resource</th>
                                <th className="text-center py-3 px-4 w-20">Watch</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(resources[selectedDomain.id] || [])
                                .filter(resource => resource.type === 'HTML')
                                .map((resource, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                                  <td className="py-3 px-4">
                                    <button
                                      onClick={() => toggleComplete(resource, 'resource', resource.title)}
                                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                        isItemCompleted(resource, 'resource', resource.title)
                                          ? 'bg-yellow-400 border-yellow-400 text-black'
                                          : 'border-gray-600 text-transparent hover:border-gray-400'
                                      }`}
                                    >
                                      {isItemCompleted(resource, 'resource', resource.title) && '✓'}
                                    </button>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <button
                                      onClick={() => toggleFavorite(resource, 'resource', resource.title)}
                                      className={`text-xl p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                                        isItemFavorited(resource, 'resource', resource.title) 
                                          ? 'text-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg' 
                                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
                                      }`}
                                      title={isItemFavorited(resource, 'resource', resource.title) ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                      {isItemFavorited(resource, 'resource', resource.title) ? '⭐' : '☆'}
                                    </button>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <span className="font-medium text-white">{resource.title}</span>
                                      <span className="ml-2 text-gray-400">🔗</span>
                                    </div>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <a
                                      href={resource.watch}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-red-400 hover:text-red-300"
                                      aria-label="Watch on YouTube"
                                    >
                                      <i className="fab fa-youtube fa-lg"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* CSS Section */}
                  <div className="bg-gray-800 rounded-lg">
                    <button
                      onClick={() => toggleSection('css')}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors bg-gray-800 text-white"
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">🎨</span>
                        <span className="font-semibold text-white">CSS</span>
                        <span className="ml-2 text-sm text-gray-300">
                          ({(resources[selectedDomain.id] || []).filter(r => r.type === 'CSS').length})
                        </span>
                      </div>
                      <span className="text-gray-300">
                        {expandedSections['css'] ? '▼' : '▶'}
                      </span>
                    </button>
                    
                    {expandedSections['css'] && (
                      <div className="px-4 pb-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 w-16">Status</th>
                                <th className="text-center py-3 px-4 w-16">Star</th>
                                <th className="text-left py-3 px-4">Resource</th>
                                <th className="text-center py-3 px-4 w-20">Watch</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(resources[selectedDomain.id] || [])
                                .filter(resource => resource.type === 'CSS')
                                .map((resource, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                                  <td className="py-3 px-4">
                                    <button
                                      onClick={() => toggleComplete(resource, 'resource', resource.title)}
                                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                        isItemCompleted(resource, 'resource', resource.title)
                                          ? 'bg-yellow-400 border-yellow-400 text-black'
                                          : 'border-gray-600 text-transparent hover:border-gray-400'
                                      }`}
                                    >
                                      {isItemCompleted(resource, 'resource', resource.title) && '✓'}
                                    </button>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <button
                                      onClick={() => toggleFavorite(resource, 'resource', resource.title)}
                                      className={`text-xl p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                                        isItemFavorited(resource, 'resource', resource.title) 
                                          ? 'text-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg' 
                                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
                                      }`}
                                      title={isItemFavorited(resource, 'resource', resource.title) ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                      {isItemFavorited(resource, 'resource', resource.title) ? '⭐' : '☆'}
                                    </button>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <span className="font-medium text-white">{resource.title}</span>
                                      <span className="ml-2 text-gray-400">🔗</span>
                                    </div>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <a
                                      href={resource.watch}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-red-400 hover:text-red-300"
                                      aria-label="Watch on YouTube"
                                    >
                                      <i className="fab fa-youtube fa-lg"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* JavaScript Section */}
                  <div className="bg-gray-800 rounded-lg">
                    <button
                      onClick={() => toggleSection('javascript')}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors bg-gray-800 text-white"
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">⚡</span>
                        <span className="font-semibold text-white">JavaScript</span>
                        <span className="ml-2 text-sm text-gray-300">
                          ({(resources[selectedDomain.id] || []).filter(r => r.type === 'JavaScript').length})
                        </span>
                      </div>
                      <span className="text-gray-300">
                        {expandedSections['javascript'] ? '▼' : '▶'}
                      </span>
                    </button>
                    
                    {expandedSections['javascript'] && (
                      <div className="px-4 pb-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 w-16">Status</th>
                                <th className="text-center py-3 px-4 w-16">Star</th>
                                <th className="text-left py-3 px-4">Resource</th>
                                <th className="text-center py-3 px-4 w-20">Watch</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(resources[selectedDomain.id] || [])
                                .filter(resource => resource.type === 'JavaScript')
                                .map((resource, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                                  <td className="py-3 px-4">
                                    <button
                                      onClick={() => toggleComplete(resource, 'resource', resource.title)}
                                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                        isItemCompleted(resource, 'resource', resource.title)
                                          ? 'bg-yellow-400 border-yellow-400 text-black'
                                          : 'border-gray-600 text-transparent hover:border-gray-400'
                                      }`}
                                    >
                                      {isItemCompleted(resource, 'resource', resource.title) && '✓'}
                                    </button>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <button
                                      onClick={() => toggleFavorite(resource, 'resource', resource.title)}
                                      className={`text-xl p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                                        isItemFavorited(resource, 'resource', resource.title) 
                                          ? 'text-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg' 
                                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
                                      }`}
                                      title={isItemFavorited(resource, 'resource', resource.title) ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                      {isItemFavorited(resource, 'resource', resource.title) ? '⭐' : '☆'}
                                    </button>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <span className="font-medium text-white">{resource.title}</span>
                                      <span className="ml-2 text-gray-400">🔗</span>
                                    </div>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <a
                                      href={resource.watch}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-red-400 hover:text-red-300"
                                      aria-label="Watch on YouTube"
                                    >
                                      <i className="fab fa-youtube fa-lg"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* React Section */}
                  <div className="bg-gray-800 rounded-lg">
                    <button
                      onClick={() => toggleSection('react')}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors bg-gray-800 text-white"
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">⚛️</span>
                        <span className="font-semibold text-white">React</span>
                        <span className="ml-2 text-sm text-gray-300">
                          ({(resources[selectedDomain.id] || []).filter(r => r.type === 'React').length})
                        </span>
                      </div>
                      <span className="text-gray-300">
                        {expandedSections['react'] ? '▼' : '▶'}
                      </span>
                    </button>
                    
                    {expandedSections['react'] && (
                      <div className="px-4 pb-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 w-16">Status</th>
                                <th className="text-center py-3 px-4 w-16">Star</th>
                                <th className="text-left py-3 px-4">Resource</th>
                                <th className="text-center py-3 px-4 w-20">Watch</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(resources[selectedDomain.id] || [])
                                .filter(resource => resource.type === 'React')
                                .map((resource, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                                  <td className="py-3 px-4">
                                    <button
                                      onClick={() => toggleComplete(resource, 'resource', resource.title)}
                                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                        isItemCompleted(resource, 'resource', resource.title)
                                          ? 'bg-yellow-400 border-yellow-400 text-black'
                                          : 'border-gray-600 text-transparent hover:border-gray-400'
                                      }`}
                                    >
                                      {isItemCompleted(resource, 'resource', resource.title) && '✓'}
                                    </button>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <button
                                      onClick={() => toggleFavorite(resource, 'resource', resource.title)}
                                      className={`text-xl p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                                        isItemFavorited(resource, 'resource', resource.title) 
                                          ? 'text-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg' 
                                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
                                      }`}
                                      title={isItemFavorited(resource, 'resource', resource.title) ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                      {isItemFavorited(resource, 'resource', resource.title) ? '⭐' : '☆'}
                                    </button>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <span className="font-medium text-white">{resource.title}</span>
                                      <span className="ml-2 text-gray-400">🔗</span>
                                    </div>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <a
                                      href={resource.watch}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-red-400 hover:text-red-300"
                                      aria-label="Watch on YouTube"
                                    >
                                      <i className="fab fa-youtube fa-lg"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* NodeJS Section */}
                  <div className="bg-gray-800 rounded-lg">
                    <button
                      onClick={() => toggleSection('nodejs')}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors bg-gray-800 text-white"
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">🟢</span>
                        <span className="font-semibold text-white">NodeJS</span>
                        <span className="ml-2 text-sm text-gray-300">
                          ({(resources[selectedDomain.id] || []).filter(r => r.type === 'NodeJS').length})
                        </span>
                      </div>
                      <span className="text-gray-300">
                        {expandedSections['nodejs'] ? '▼' : '▶'}
                      </span>
                    </button>
                    
                    {expandedSections['nodejs'] && (
                      <div className="px-4 pb-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 w-16">Status</th>
                                <th className="text-center py-3 px-4 w-16">Star</th>
                                <th className="text-left py-3 px-4">Resource</th>
                                <th className="text-center py-3 px-4 w-20">Watch</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(resources[selectedDomain.id] || [])
                                .filter(resource => resource.type === 'NodeJS')
                                .map((resource, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                                  <td className="py-3 px-4">
                                    <button
                                      onClick={() => toggleComplete(resource, 'resource', resource.title)}
                                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                        isItemCompleted(resource, 'resource', resource.title)
                                          ? 'bg-yellow-400 border-yellow-400 text-black'
                                          : 'border-gray-600 text-transparent hover:border-gray-400'
                                      }`}
                                    >
                                      {isItemCompleted(resource, 'resource', resource.title) && '✓'}
                                    </button>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <button
                                      onClick={() => toggleFavorite(resource, 'resource', resource.title)}
                                      className={`text-xl p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                                        isItemFavorited(resource, 'resource', resource.title) 
                                          ? 'text-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg' 
                                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
                                      }`}
                                      title={isItemFavorited(resource, 'resource', resource.title) ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                      {isItemFavorited(resource, 'resource', resource.title) ? '⭐' : '☆'}
                                    </button>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <span className="font-medium text-white">{resource.title}</span>
                                      <span className="ml-2 text-gray-400">🔗</span>
                                    </div>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <a
                                      href={resource.watch}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-red-400 hover:text-red-300"
                                      aria-label="Watch on YouTube"
                                    >
                                      <i className="fab fa-youtube fa-lg"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                  
                  {/* ExpressJS Section */}
                  <div className="bg-gray-800 rounded-lg">
                    <button
                      onClick={() => toggleSection('expressjs')}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors bg-gray-800 text-white"
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">🚂</span>
                        <span className="font-semibold text-white">ExpressJS</span>
                        <span className="ml-2 text-sm text-gray-300">
                          ({(resources[selectedDomain.id] || []).filter(r => r.type === 'ExpressJS').length})
                        </span>
                      </div>
                      <span className="text-gray-300">
                        {expandedSections['expressjs'] ? '▼' : '▶'}
                      </span>
                    </button>
                    
                    {expandedSections['expressjs'] && (
                      <div className="px-4 pb-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 w-16">Status</th>
                                <th className="text-center py-3 px-4 w-16">Star</th>
                                <th className="text-left py-3 px-4">Resource</th>
                                <th className="text-center py-3 px-4 w-20">Watch</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(resources[selectedDomain.id] || [])
                                .filter(resource => resource.type === 'ExpressJS')
                                .map((resource, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                                  <td className="py-3 px-4">
                                    <button
                                      onClick={() => toggleComplete(resource, 'resource', resource.title)}
                                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                        isItemCompleted(resource, 'resource', resource.title)
                                          ? 'bg-yellow-400 border-yellow-400 text-black'
                                          : 'border-gray-600 text-transparent hover:border-gray-400'
                                      }`}
                                    >
                                      {isItemCompleted(resource, 'resource', resource.title) && '✓'}
                                    </button>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <button
                                      onClick={() => toggleFavorite(resource, 'resource', resource.title)}
                                      className={`text-xl p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                                        isItemFavorited(resource, 'resource', resource.title) 
                                          ? 'text-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg' 
                                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
                                      }`}
                                      title={isItemFavorited(resource, 'resource', resource.title) ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                      {isItemFavorited(resource, 'resource', resource.title) ? '⭐' : '☆'}
                                    </button>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <span className="font-medium text-white">{resource.title}</span>
                                      <span className="ml-2 text-gray-400">🔗</span>
                                    </div>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <a
                                      href={resource.watch}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-red-400 hover:text-red-300"
                                      aria-label="Watch on YouTube"
                                    >
                                      <i className="fab fa-youtube fa-lg"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* MongoDB Section */}
                  <div className="bg-gray-800 rounded-lg">
                    <button
                      onClick={() => toggleSection('mongodb')}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors bg-gray-800 text-white"
                    >
                      <div className="flex items-center">
                        <span className="text-xl mr-3">🍃</span>
                        <span className="font-semibold text-white">MongoDB</span>
                        <span className="ml-2 text-sm text-gray-300">
                          ({(resources[selectedDomain.id] || []).filter(r => r.type === 'MongoDB').length})
                        </span>
                      </div>
                      <span className="text-gray-300">
                        {expandedSections['mongodb'] ? '▼' : '▶'}
                      </span>
                    </button>
                    
                    {expandedSections['mongodb'] && (
                      <div className="px-4 pb-4">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-700">
                                <th className="text-left py-3 px-4 w-16">Status</th>
                                <th className="text-center py-3 px-4 w-16">Star</th>
                                <th className="text-left py-3 px-4">Resource</th>
                                <th className="text-center py-3 px-4 w-20">Watch</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(resources[selectedDomain.id] || [])
                                .filter(resource => resource.type === 'MongoDB')
                                .map((resource, index) => (
                                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                                  <td className="py-3 px-4">
                                    <button
                                      onClick={() => toggleComplete(resource, 'resource', resource.title)}
                                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                        isItemCompleted(resource, 'resource', resource.title)
                                          ? 'bg-yellow-400 border-yellow-400 text-black'
                                          : 'border-gray-600 text-transparent hover:border-gray-400'
                                      }`}
                                    >
                                      {isItemCompleted(resource, 'resource', resource.title) && '✓'}
                                    </button>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <button
                                      onClick={() => toggleFavorite(resource, 'resource', resource.title)}
                                      className={`text-xl p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                                        isItemFavorited(resource, 'resource', resource.title) 
                                          ? 'text-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg' 
                                          : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
                                      }`}
                                      title={isItemFavorited(resource, 'resource', resource.title) ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                      {isItemFavorited(resource, 'resource', resource.title) ? '⭐' : '☆'}
                                    </button>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <span className="font-medium text-white">{resource.title}</span>
                                      <span className="ml-2 text-gray-400">🔗</span>
                                    </div>
                                  </td>
                                  <td className="text-center py-3 px-4">
                                    <a
                                      href={resource.watch}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-red-400 hover:text-red-300"
                                      aria-label="Watch on YouTube"
                                    >
                                      <i className="fab fa-youtube fa-lg"></i>
                                    </a>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>

                </>
              ) : (
                // For other domains, show domain-specific topics
                (() => {
                  const domainTopics = {
                    dataeng: [
                      { name: 'Phase 1: Foundations', icon: '🧱', type: 'Phase1', isPhase: true },
                      { name: 'Phase 2: Big Data & Pipelines', icon: '🔥', type: 'Phase2', isPhase: true },
                      { name: 'Phase 3: Cloud & Streaming', icon: '☁️', type: 'Phase3', isPhase: true },
                      { name: 'Phase 4: Architecture & Optimization', icon: '🏗️', type: 'Phase4', isPhase: true }
                    ],
                    dataanalyst: [
                      { name: 'Phase 1: Fundamentals for Data Analytics', icon: '🟢', type: 'Phase1', isPhase: true },
                      { name: 'Phase 2: Excel & Spreadsheets for Analysis', icon: '📊', type: 'Phase2', isPhase: true },
                      { name: 'Phase 3: SQL for Data Analytics', icon: '🧮', type: 'Phase3', isPhase: true },
                      { name: 'Phase 4: Python for Data Analysis', icon: '🐍', type: 'Phase4', isPhase: true },
                      { name: 'Phase 5: Power BI for Visual Analytics', icon: '📈', type: 'Phase5', isPhase: true },
                      { name: 'Phase 6: Mini Projects & Portfolio Building', icon: '🛠', type: 'Phase6', isPhase: true },
                      { name: 'Phase 7: Fundamentals of Machine Learning', icon: '🤖', type: 'Phase7', isPhase: true }
                    ],
                    datascientist: [
                      { name: 'Phase 0: Foundations', icon: '🟢', type: 'Phase0', isPhase: true },
                      { name: 'Phase 1: Mathematics for Data Science', icon: '🧮', type: 'Phase1', isPhase: true },
                      { name: 'Phase 2: Data Handling & Analysis', icon: '🟡', type: 'Phase2', isPhase: true },
                      { name: 'Phase 3: Core Machine Learning', icon: '🔵', type: 'Phase3', isPhase: true },
                      { name: 'Phase 4: Advanced Machine Learning', icon: '🟣', type: 'Phase4', isPhase: true },
                      { name: 'Phase 5: Deployment', icon: '🟠', type: 'Phase5', isPhase: true },
                      { name: 'Phase 6: Tools, Cloud & Domain Add-ons', icon: '⚫', type: 'Phase6', isPhase: true }
                    ],
                    uiux: [
                      { name: 'Foundations of UI/UX', icon: '🎨', type: 'FoundationsofUIUX' },
                      { name: 'UX Research', icon: '🔍', type: 'Research' },
                      { name: 'Figma', icon: '✏️', type: 'Figma' },
                      { name: 'Wireframing & Prototyping', icon: '📱', type: 'Prototyping' },
                      { name: 'Adobe XD', icon: '✏️', type: 'AdobeXD' },
                      { name: 'Advanced Topics', icon: '📖', type: 'Advancedtopics' }
                    ],
                    product: [
                      { name: 'Strategy', icon: '🎯', type: 'Strategy' },
                      { name: 'Agile', icon: '🔄', type: 'Agile' },
                      { name: 'Stakeholders', icon: '👥', type: 'Stakeholders' },
                      { name: 'User Stories', icon: '📝', type: 'UserStories' },
                      { name: 'Analytics', icon: '📊', type: 'Analytics' },
                      { name: 'A/B Testing', icon: '🧪', type: 'ABTesting' }
                    ],
                    hr: [
                      { name: 'Recruitment', icon: '👔', type: 'Recruitment' },
                      { name: 'HR Management', icon: '👥', type: 'HRManagement' },
                      { name: 'Employee Dev', icon: '📈', type: 'EmployeeDev' },
                      { name: 'Performance', icon: '⭐', type: 'Performance' },
                      { name: 'Compensation', icon: '💰', type: 'Compensation' },
                      { name: 'HR Analytics', icon: '📊', type: 'HRAnalytics' }
                    ],
                    marketing: [
                      { name: 'Digital Marketing', icon: '📱', type: 'DigitalMarketing' },
                      { name: 'SEO', icon: '🔍', type: 'SEO' },
                      { name: 'Social Media', icon: '📢', type: 'SocialMedia' },
                      { name: 'Content Marketing', icon: '📝', type: 'ContentMarketing' },
                      { name: 'Email Marketing', icon: '📧', type: 'EmailMarketing' },
                      { name: 'Google Ads', icon: '💰', type: 'GoogleAds' }
                    ],
                    freelance: [
                      { name: 'Business Setup', icon: '🏢', type: 'BusinessSetup' },
                      { name: 'Client Management', icon: '🤝', type: 'ClientManagement' },
                      { name: 'Portfolio', icon: '📁', type: 'Portfolio' },
                      { name: 'Pricing', icon: '💰', type: 'Pricing' },
                      { name: 'Time Management', icon: '⏰', type: 'TimeManagement' },
                      { name: 'Legal', icon: '⚖️', type: 'Legal' }
                    ],
                    dsa: [
                      { name: 'Java Fundamentals', icon: '📦', type: 'JavaFund' },
                      { name: 'Collections for Java', icon: '📚', type: 'JavaCollections' },
                      { name: 'C++ Fundamentals', icon: '🔗', type: 'CppFund' },
                      { name: 'C++ STL', icon: '🔗', type: 'CppSTL'},
                      { name: 'Maths for DSA', icon: '⚠️', type: 'MathsForDSA' },
                      { name: 'Theory of Data Structures and Algorithms', icon: '🔗', type: 'DSATheory'},              
                      { name: 'Top A-Z DSA Sheets (Select ONE)', icon: '🌳', type: 'AZSheets' },
                      { name: 'Most asked by Companies - DSA Sheets', icon: '⚡', type: 'MAQSheets' },
                    ],
                    java: [
                        { name: 'Basics', icon: '📘', type: 'JavaBasics' },
                        { name: 'Control Flow', icon: '🔄', type: 'JavaControlFlow' },
                        { name: 'Object-Oriented Programming', icon: '🏛️', type: 'JavaOOP' },
                        { name: 'Exception Handling', icon: '⚠️', type: 'JavaExceptionHandling' },
                        { name: 'Java Collections Framework', icon: '📚', type: 'JavaCollections' },
                        { name: 'Multithreading', icon: '🧵', type: 'JavaMultithreading' },
                        { name: 'Functional Programming', icon: '🖥️', type: 'JavaFunctionalProgramming' },
                        { name: 'File Handling', icon: '📂', type: 'JavaFileHandling' },
                      
                      
                      { name: 'Mini Projects', icon: '��️', type: 'JavaMiniProjects' }
                    ],
                    python: [
                      { name: 'Syntax & Basics', icon: '📘', type: 'PythonBasics' },
                      { name: 'Control Structures', icon: '🔄', type: 'PythonControlStructures' },
                      { name: 'Functions', icon: '🔧', type: 'PythonFunctions' },
                      { name: 'OOPs in Python', icon: '🏛️', type: 'PythonOOP' },
                      { name: 'Modules & Packages', icon: '📦', type: 'PythonModules' },
                      { name: 'Data Structures', icon: '📚', type: 'PythonDataStructures' },
                      { name: 'File Handling', icon: '📂', type: 'PythonFileHandling' },
                      { name: 'Error Handling', icon: '⚠️', type: 'PythonErrorHandling' },
                      { name: 'Standard Libraries', icon: '📚', type: 'PythonStdLib' },
                      { name: 'Advanced Concepts', icon: '🚀', type: 'PythonAdvanced' },
                      
                    ],
                    cpp: [
                      { name: 'Syntax & Basics', icon: '📘', type: 'CppBasics' },
                      { name: 'Control Flow', icon: '🔄', type: 'CppControlFlow' },
                      { name: 'Functions', icon: '🔧', type: 'CppFunctions' },
                      { name: 'Object-Oriented Programming', icon: '🏛️', type: 'CppOOP' },
                      { name: 'Pointers', icon: '📍', type: 'CppPointers' },
                      { name: 'Memory Management', icon: '💾', type: 'CppMemory' },
                      { name: 'Standard Template Library (STL)', icon: '📚', type: 'CppSTL' },
                      { name: 'Basic Data Structures', icon: '📘', type: 'CppDSA' },
                      { name: 'File Handling', icon: '📂', type: 'CppFileHandling' },
                      { name: 'Templates', icon: '🧩', type: 'CppTemplates' },
                      { name: 'Mini Projects', icon: '🛠️', type: 'CppMiniProjects' }
                    ],
                    c: [
                      { name: 'C Basics', icon: '📘', type: 'CBasics' },
                      { name: 'Operators & Expressions', icon: '➗', type: 'COperators' },
                      { name: 'Control Flow', icon: '🔄', type: 'CControlFlow' },
                      { name: 'Functions', icon: '🔧', type: 'CFunctions' },
                      { name: 'Arrays & Strings', icon: '🧵', type: 'CArraysStrings' },
                      { name: 'Pointers', icon: '📍', type: 'CPointers' },
                      { name: 'Structures & Unions', icon: '🏗️', type: 'CStructsUnions' },
                      { name: 'Dynamic Memory', icon: '💾', type: 'CDynamicMemory' },
                      { name: 'File Handling', icon: '📂', type: 'CFileHandling' },
                      { name: 'Basic Data Structures', icon: '⚙️', type: 'CDS' },
                      { name: 'Mini Projects', icon: '🛠️', type: 'CMiniProjects' }
                    ]
                  };

                  const topics = domainTopics[selectedDomain.id] || [];

                  // Special handling for data engineering, data analyst, and data scientist with nested dropdowns
                  if (selectedDomain.id === 'dataeng' || selectedDomain.id === 'dataanalyst' || selectedDomain.id === 'datascientist') {
                    const phaseTopics = {
                      Phase1: [
                        { name: 'SQL', icon: '🗄️', type: 'SQL' },
                        { name: 'Python', icon: '🐍', type: 'Python' },
                        { name: 'Git & GitHub', icon: '📚', type: 'Git' },
                        { name: 'Phase 1 Mini Projects', icon: '💼', type: 'MiniProjectsPhase1' }
                      ],
                      Phase2: [
                        { name: 'Apache Spark & PySpark', icon: '⚡', type: 'Spark' },
                        { name: 'Data Pipelines', icon: '🔄', type: 'Pipelines' },
                        { name: 'Data Platforms', icon: '🏢', type: 'Platforms' },
                        { name: 'Phase 2 Mini Projects', icon: '💼', type: 'MiniProjectsPhase2' }
                      ],
                      Phase3: [
                        { name: 'Cloud Platforms', icon: '☁️', type: 'Cloud' },
                        { name: 'Apache Kafka', icon: '📨', type: 'Kafka' },
                        { name: 'CI/CD for Data Pipelines', icon: '🚀', type: 'CICD' },
                        { name: 'Phase 3 Mini Projects', icon: '💼', type: 'MiniProjectsPhase3' }
                      ],
                                              Phase4: [
                          { name: 'Data Architectures', icon: '🏗️', type: 'Architectures' },
                          { name: 'Data Modeling', icon: '📊', type: 'Modeling' },
                          { name: 'Data Partitioning & File Formats', icon: '📁', type: 'Partitioning' },
                          { name: 'Logging & Monitoring', icon: '📈', type: 'Monitoring' },
                          { name: 'Phase 4 Mini Projects', icon: '💼', type: 'MiniProjectsPhase4' }
                        ],
                        // Data Analyst Phase Topics
                        dataanalyst_Phase1: [
                          { name: 'What is Data Analytics?', icon: '🎯', type: 'DataAnalyticsIntro' },
                          { name: 'Math Fundamentals', icon: '📐', type: 'MathFundamentals' },
                          
                        ],
                        dataanalyst_Phase2: [
                          { name: 'Excel Basics', icon: '📊', type: 'ExcelBasics' },
                          { name: 'Advanced Excel', icon: '📈', type: 'AdvancedExcel' },
                          { name: 'Phase 2 Mini Projects', icon: '💼', type: 'MiniProjectsPhase2' }
                        ],
                        dataanalyst_Phase3: [
                          { name: 'SQL Basics', icon: '🗄️', type: 'SQLBasics' },
                          { name: 'Advanced SQL', icon: '🧮', type: 'AdvancedSQL' },
                          { name: 'Phase 3 Mini Projects', icon: '💼', type: 'MiniProjectsPhase3' }
                        ],
                        dataanalyst_Phase4: [
                          { name: 'Python Basics', icon: '🐍', type: 'PythonBasics' },
                          { name: 'Pandas & Data Analysis', icon: '📊', type: 'PandasAnalysis' },
                          { name: 'Phase 4 Mini Projects', icon: '💼', type: 'MiniProjectsPhase4' }
                        ],
                        dataanalyst_Phase5: [
                          { name: 'Power BI Basics', icon: '📈', type: 'PowerBIBasics' },
                          { name: 'Advanced Power BI', icon: '🛠', type: 'AdvancedPowerBI' },
                          { name: 'Phase 5 Mini Projects', icon: '💼', type: 'MiniProjectsPhase5' }
                        ],
                        dataanalyst_Phase6: [
                          { name: 'Portfolio Projects', icon: '📁', type: 'PortfolioProjects' },
                          { name: 'GitHub & Deployment', icon: '🚀', type: 'GitHubDeployment' },
                          { name: 'Phase 6 Mini Projects', icon: '💼', type: 'MiniProjectsPhase6' }
                        ],
                        dataanalyst_Phase7: [
                          { name: 'ML Fundamentals', icon: '🤖', type: 'MLFundamentals' },
                          { name: 'ML Algorithms', icon: '🧠', type: 'MLAlgorithms' },
                          { name: 'Phase 7 Mini Projects', icon: '💼', type: 'MiniProjectsPhase7' }
                        ],
                        // Data Scientist Phase Topics
                        datascientist_Phase0: [
                          { name: 'What does Data Scientist do', icon: '🤔', type: 'DataScientistRole' },
                          { name: 'Programming with Python', icon: '🐍', type: 'PythonForDS' },
                          { name: 'Phase 0 Mini Projects', icon: '💼', type: 'MiniProjectsPhase0' }
                        ],
                        datascientist_Phase1: [
                          { name: 'Linear Algebra (Vectors, Matrices, Dot Product)', icon: '📐', type: 'MathLinearAlgebra' },
                          { name: 'Probability Theory (Basic Rules, Conditional, Bayes)', icon: '🎲', type: 'MathProbability' },
                          { name: 'Descriptive Statistics: Mean, Median, Mode, Std Dev', icon: '📊', type: 'MathDescriptiveStats' },
                          { name: 'Inferential Statistics: Hypothesis Testing, Confidence Intervals', icon: '📈', type: 'MathInferentialStats' }
                        ],
                        datascientist_Phase2: [
                          { name: 'Data Analysis & Manipulation', icon: '📊', type: 'DataAnalysis' },
                          { name: 'Data Visualization', icon: '📈', type: 'DataVisualization' },
                          { name: 'Phase 2 Mini Projects', icon: '💼', type: 'MiniProjectsPhase2' }
                        ],
                        datascientist_Phase3: [
                          { name: 'Basics of Machine Learning', icon: '🤖', type: 'MLBasics' },
                          { name: 'Supervised Learning', icon: '🎯', type: 'SupervisedLearning' },
                          { name: 'Unsupervised Learning', icon: '🧩', type: 'UnsupervisedLearning' },
                          { name: 'Model Evaluation & Tuning', icon: '✅', type: 'ModelEvaluation' },
                          { name: 'Phase 3 Mini Projects', icon: '💼', type: 'MiniProjectsPhase3' }
                        ],
                        datascientist_Phase4: [
                          { name: 'Feature Engineering & Selection', icon: '🧱', type: 'FeatureEngineering' },
                          { name: 'Time Series Analysis', icon: '📉', type: 'TimeSeries' },
                          { name: 'Introduction to Deep Learning', icon: '🧠', type: 'DeepLearningIntro' },
                          { name: 'Intro to NLP', icon: '💬', type: 'NLPIntro' },
                          { name: 'Phase 4 Mini Projects', icon: '💼', type: 'MiniProjectsPhase4' }
                        ],
                        datascientist_Phase5: [
                          { name: 'Deployment', icon: '🌐', type: 'ModelDeployment' }
                        ],
                        datascientist_Phase6: [
                          { name: 'SQL for Data Science', icon: '🛢', type: 'SQLForDS' },
                          { name: 'Cloud Tools for DS', icon: '☁️', type: 'CloudTools' },
                          
                        ]
                    };

                    return topics.map((phase) => (
                      <div key={phase.type} className="bg-gray-800 rounded-lg mb-4">
                        <button
                          onClick={() => toggleSection(phase.type.toLowerCase())}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors bg-gray-800 text-white"
                        >
                          <div className="flex items-center">
                            <span className="text-xl mr-3">{phase.icon}</span>
                            <span className="font-semibold text-white">{phase.name}</span>
                                                      <span className="ml-2 text-sm text-gray-300">
                            ({(() => {
                              const phaseTopics = {
                                Phase1: ['SQL', 'Python', 'Git', 'MiniProjectsPhase1'],
                                Phase2: ['Spark', 'Pipelines', 'Platforms', 'MiniProjectsPhase2'],
                                Phase3: ['Cloud', 'Kafka', 'CICD', 'MiniProjectsPhase3'],
                                Phase4: ['Architectures', 'Modeling', 'Partitioning', 'Monitoring', 'MiniProjectsPhase4'],
                                // Data Analyst Phase Topics
                                dataanalyst_Phase1: ['DataAnalyticsIntro', 'MathFundamentals', 'MiniProjectsPhase1'],
                                dataanalyst_Phase2: ['ExcelBasics', 'AdvancedExcel', 'MiniProjectsPhase2'],
                                dataanalyst_Phase3: ['SQLBasics', 'AdvancedSQL', 'MiniProjectsPhase3'],
                                dataanalyst_Phase4: ['PythonBasics', 'PandasAnalysis', 'MiniProjectsPhase4'],
                                dataanalyst_Phase5: ['PowerBIBasics', 'AdvancedPowerBI', 'MiniProjectsPhase5'],
                                dataanalyst_Phase6: ['PortfolioProjects', 'GitHubDeployment', 'MiniProjectsPhase6'],
                                                                dataanalyst_Phase7: ['MLFundamentals', 'MLAlgorithms', 'MiniProjectsPhase7'],
                                // Data Scientist Phase Topics
                                datascientist_Phase0: ['DataScientistRole', 'PythonForDS', 'MiniProjectsPhase0'],
                                datascientist_Phase1: ['MathLinearAlgebra', 'MathProbability', 'MathDescriptiveStats', 'MathInferentialStats'],
                                datascientist_Phase2: ['DataAnalysis', 'DataVisualization', 'MiniProjectsPhase2'],
                                datascientist_Phase3: ['MLBasics', 'SupervisedLearning', 'UnsupervisedLearning', 'ModelEvaluation', 'MiniProjectsPhase3'],
                                datascientist_Phase4: ['FeatureEngineering', 'TimeSeries', 'DeepLearningIntro', 'NLPIntro', 'MiniProjectsPhase4'],
                                datascientist_Phase5: ['ModelDeployment'],
                                datascientist_Phase6: ['SQLForDS', 'CloudTools', 'MiniProjectsPhase6']
                              };
                              const topics = selectedDomain.id === 'dataanalyst' ? phaseTopics[`dataanalyst_${phase.type}`] || [] : 
                                            selectedDomain.id === 'datascientist' ? phaseTopics[`datascientist_${phase.type}`] || [] : 
                                            phaseTopics[phase.type] || [];
                                return topics.reduce((sum, topic) => {
                                  return sum + (resources[selectedDomain.id] || []).filter(r => r.type === topic).length;
                                }, 0);
                            })()})
                          </span>
                          </div>
                          <span className="text-gray-300">
                            {expandedSections[phase.type.toLowerCase()] ? '▼' : '▶'}
                          </span>
                        </button>
                        
                        {expandedSections[phase.type.toLowerCase()] && (
                          <div className="px-4 pb-4">
                            <div className="space-y-3">
                              {(selectedDomain.id === 'dataanalyst' ? phaseTopics[`dataanalyst_${phase.type}`] : 
                                selectedDomain.id === 'datascientist' ? phaseTopics[`datascientist_${phase.type}`] : 
                                phaseTopics[phase.type])?.map((topic) => (
                                <div key={topic.type} className="bg-gray-700 rounded-lg">
                                                                     <button
                                     onClick={() => toggleSection(topic.type.toLowerCase())}
                                     className="w-full p-3 text-left flex items-center justify-between hover:bg-gray-600 transition-colors bg-gray-700 text-white"
                                   >
                                     <div className="flex items-center">
                                       <span className="text-lg mr-3">{topic.icon}</span>
                                       <span className="font-medium text-white">{topic.name}</span>
                                       <span className="ml-2 text-sm text-gray-300">
                                         ({(resources[selectedDomain.id] || []).filter(r => r.type === topic.type).length})
                                       </span>
                                     </div>
                                     <span className="text-gray-300">
                                       {expandedSections[topic.type.toLowerCase()] ? '▼' : '▶'}
                                     </span>
                                   </button>
                                   
                                   {expandedSections[topic.type.toLowerCase()] && (
                                    <div className="px-4 pb-3">
                                      <div className="overflow-x-auto">
                                        <table className="w-full">
                                          <thead>
                                            <tr className="border-b border-gray-600">
                                              <th className="text-left py-2 px-3 w-16">Status</th>
                                              <th className="text-center py-2 px-3 w-16">Star</th>
                                              <th className="text-left py-2 px-3">Resource</th>
                                              <th className="text-center py-2 px-3 w-20">Watch</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {(resources[selectedDomain.id] || [])
                                              .filter(resource => resource.type === topic.type)
                                              .map((resource, index) => (
                                              <tr key={index} className="border-b border-gray-600 hover:bg-gray-600">
                                                <td className="py-2 px-3">
                                                  <button
                                                    onClick={() => toggleComplete(resource, 'resource', resource.title)}
                                                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                                      isItemCompleted(resource, 'resource', resource.title)
                                                        ? 'bg-yellow-400 border-yellow-400 text-black'
                                                        : 'border-gray-400 text-transparent hover:border-gray-300'
                                                    }`}
                                                  >
                                                    {isItemCompleted(resource, 'resource', resource.title) && '✓'}
                                                  </button>
                                                </td>
                                                <td className="text-center py-2 px-3">
                                                  <button
                                                    onClick={() => toggleFavorite(resource, 'resource', resource.title)}
                                                    className={`text-lg p-1 rounded-full transition-all duration-300 hover:scale-110 ${
                                                      isItemFavorited(resource, 'resource', resource.title) 
                                                        ? 'text-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg' 
                                                        : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
                                                    }`}
                                                    title={isItemFavorited(resource, 'resource', resource.title) ? 'Remove from favorites' : 'Add to favorites'}
                                                  >
                                                    {isItemFavorited(resource, 'resource', resource.title) ? '⭐' : '☆'}
                                                  </button>
                                                </td>
                                                <td className="py-2 px-3">
                                                  <div className="flex items-center">
                                                    <span className="font-medium text-white text-sm">{resource.title}</span>
                                                    <span className="ml-2 text-gray-400">🔗</span>
                                                  </div>
                                                </td>
                                                <td className="text-center py-2 px-3">
                                                  <a
                                                    href={resource.watch}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-red-400 hover:text-red-300"
                                                    aria-label="Watch on YouTube"
                                                  >
                                                    <i className="fab fa-youtube fa-lg"></i>
                                                  </a>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ));
                  }

                  // Regular rendering for other domains
                  return topics.map((topic) => (
                    <div key={topic.type} className="bg-gray-800 rounded-lg">
                      <button
                        onClick={() => toggleSection(topic.type.toLowerCase())}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-700 transition-colors bg-gray-800 text-white"
                      >
                        <div className="flex items-center">
                          <span className="text-xl mr-3">{topic.icon}</span>
                          <span className="font-semibold text-white">{topic.name}</span>
                          <span className="ml-2 text-sm text-gray-300">
                            ({(resources[selectedDomain.id] || []).filter(r => r.type === topic.type).length})
                          </span>
                        </div>
                        <span className="text-gray-300">
                          {expandedSections[topic.type.toLowerCase()] ? '▼' : '▶'}
                        </span>
                      </button>
                      
                      {expandedSections[topic.type.toLowerCase()] && (
                        <div className="px-4 pb-4">
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b border-gray-700">
                                  <th className="text-left py-3 px-4 w-16">Status</th>
                                  <th className="text-center py-3 px-4 w-16">Star</th>
                                  <th className="text-left py-3 px-4">Resource</th>
                                  <th className="text-center py-3 px-4 w-20">Watch</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(resources[selectedDomain.id] || [])
                                  .filter(resource => resource.type === topic.type)
                                  .map((resource, index) => (
                                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                                    <td className="py-3 px-4">
                                      <button
                                        onClick={() => toggleComplete(resource, 'resource', resource.title)}
                                        className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                                          isItemCompleted(resource, 'resource', resource.title)
                                            ? 'bg-yellow-400 border-yellow-400 text-black'
                                            : 'border-gray-600 text-transparent hover:border-gray-400'
                                        }`}
                                      >
                                        {isItemCompleted(resource, 'resource', resource.title) && '✓'}
                                      </button>
                                    </td>
                                    <td className="text-center py-3 px-4">
                                      <button
                                        onClick={() => toggleFavorite(resource, 'resource', resource.title)}
                                        className={`text-xl p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                                          isItemFavorited(resource, 'resource', resource.title) 
                                            ? 'text-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg' 
                                            : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
                                        }`}
                                        title={isItemFavorited(resource, 'resource', resource.title) ? 'Remove from favorites' : 'Add to favorites'}
                                      >
                                        {isItemFavorited(resource, 'resource', resource.title) ? '⭐' : '☆'}
                                      </button>
                                    </td>
                                    <td className="py-3 px-4">
                                      <div className="flex items-center">
                                        <span className="font-medium text-white">{resource.title}</span>
                                        <span className="ml-2 text-gray-400">🔗</span>
                                      </div>
                                    </td>
                                    <td className="text-center py-3 px-4">
                                      <a
                                        href={resource.watch}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-red-400 hover:text-red-300"
                                        aria-label="Watch on YouTube"
                                      >
                                        <i className="fab fa-youtube fa-lg"></i>
                                      </a>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ));
                })()
              )}
            </div>
            
            {(!resources[selectedDomain.id] || resources[selectedDomain.id].length === 0) && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-4">📚</div>
                <p>No resources found for this domain yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-yellow-400">Practical Projects</h3>
              <span className="text-sm text-gray-400">({(projects[selectedDomain.id] || []).length} projects)</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 w-16">Status</th>
                    <th className="text-center py-3 px-4 w-16">Star</th>
                    <th className="text-left py-3 px-4">Project</th>
                    <th className="text-center py-3 px-4 w-24">Difficulty</th>
                    <th className="text-center py-3 px-4 w-20">GitHub</th>
                    <th className="text-center py-3 px-4 w-20">Play Video</th>
                  </tr>
                </thead>
                <tbody>
                  {(projects[selectedDomain.id] || []).map((project, index) => (
                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="py-3 px-4">
                        <button
                          onClick={() => toggleComplete(project, 'project', project.title)}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            isItemCompleted(project, 'project', project.title)
                              ? 'bg-yellow-400 border-yellow-400 text-black'
                              : 'border-gray-600 text-transparent hover:border-gray-400'
                          }`}
                        >
                          {isItemCompleted(project, 'project', project.title) && '✓'}
                        </button>
                      </td>
                      <td className="text-center py-3 px-4">
                        <button
                          onClick={() => toggleFavorite(project, 'project', project.title)}
                          className={`text-xl p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                            isItemFavorited(project, 'project', project.title) 
                              ? 'text-yellow-400 bg-yellow-400 bg-opacity-20 shadow-lg' 
                              : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-400 hover:bg-opacity-10'
                          }`}
                          title={isItemFavorited(project, 'project', project.title) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          {isItemFavorited(project, 'project', project.title) ? '⭐' : '☆'}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <span className="font-medium text-white">{project.title}</span>
                          <span className="ml-2 text-gray-400">🔗</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <span className="px-2 py-1 rounded text-xs font-medium text-orange-400 bg-orange-900/20">
                          Medium
                        </span>
                      </td>
                      <td className="text-center py-3 px-4">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-white"
                          aria-label="View on GitHub"
                        >
                          <i className="fab fa-github fa-lg"></i>
                        </a>
                      </td>
                      <td className="text-center py-3 px-4">
                        <a
                          href={project.video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-400 hover:text-red-300"
                          aria-label="Watch on YouTube"
                        >
                          <i className="fab fa-youtube fa-lg"></i>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {(!projects[selectedDomain.id] || projects[selectedDomain.id].length === 0) && (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-4">💼</div>
                <p>No projects found for this domain yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Fallback for unknown tabs */}
        {!['roadmaps', 'resources', 'projects'].includes(activeTab) && (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-4">❓</div>
            <p>Unknown tab: {activeTab}</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && modalImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <div className="absolute top-4 right-4 flex space-x-2 z-10">
              <button
                onClick={() => downloadImage(modalImage, modalImageAlt)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-400 transition-colors"
              >
                📥 Download
              </button>
              <button
                onClick={closeImageModal}
                className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-500 transition-colors"
              >
                ✕ Close
              </button>
            </div>
            <img
              src={modalImage}
              alt={modalImageAlt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default DomainTabs 