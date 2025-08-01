import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'

const Home = () => {
  const { user } = useAuth()
  const [showRoadmaps, setShowRoadmaps] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowRoadmaps(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const username = user?.user_metadata?.username || user?.email?.split('@')[0]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Image */}
        <div className="text-center mb-8">
          <div className="w-32 h-32 mb-4 mx-auto">
            <img 
              src="/assets/Jignasa space Navbar Logo.png" 
              alt="Jignasa's Space" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl text-gray-300 mb-4">
            Welcome, <span className="text-yellow-400 font-semibold">{username}!</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl">
            Welcome to the flagship platform that empowers your learning journey!
          </p>
        </div>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button 
            onClick={() => window.location.href = '/explore'}
            className="px-8 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors"
          >
            Start Exploring
          </button>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3 border  border-yellow-400 text-black-400 font-semibold rounded-lg hover:bg-yellow-400 hover:text-black transition-colors"
          >
            View Dashboard
          </button>
        </div>
      </div>

      {/* Domain Roadmaps Section (appears on scroll) */}
      {showRoadmaps && (
        <div className="py-16 px-4 bg-black">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-yellow-400 text-center mb-12">
              Explore the domains
            </h2>
            <div className="mt-12 pt-8 border-t border-gray-700">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  {[
                    { name: 'Web Dev', icon: '🌐', color: 'text-blue-400' },
                    { name: 'Data Eng', icon: '⚙️', color: 'text-green-400' },
                    { name: 'Data Analyst', icon: '📊', color: 'text-purple-400' },
                    { name: 'Data Science', icon: '🧠', color: 'text-red-400' },
                    { name: 'UI/UX', icon: '🎨', color: 'text-pink-400' },
                    { name: 'Product', icon: '📋', color: 'text-orange-400' },
                  
                    { name: 'Marketing', icon: '📈', color: 'text-indigo-400' },
                    { name: 'Freelance', icon: '💼', color: 'text-yellow-400' },
                    
                    
                  ].map((domain, index) => (
                    <div 
                      key={index}
                      className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer group"
                      onClick={() => window.location.href = '/explore'}
                    >
                      <div className={`text-3xl mb-2 group-hover:scale-110 transition-transform duration-300`}>
                        {domain.icon}
                      </div>
                      <span className={`text-sm font-medium ${domain.color} text-center`}>
                        {domain.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            <div className=" rounded-2xl p-8 md:p-12">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                {/* Content */}
                

                {/* Explore Now Button */}
                <div className="flex-shrink-0">
                  <button 
                    onClick={() => window.location.href = '/explore'}
                    className="px-8 py-4 bg-yellow-400 text-black font-bold rounded-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Explore Now
                  </button>
                </div>
              </div>

              {/* Domain Logos */}
              
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home 