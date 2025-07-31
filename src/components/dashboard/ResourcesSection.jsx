const ResourcesSection = () => {
  const categories = [
    { name: 'Documentation', icon: '📚', count: 45 },
    { name: 'Video Tutorials', icon: '🎥', count: 128 },
    { name: 'Code Examples', icon: '💻', count: 89 },
    { name: 'Cheat Sheets', icon: '📋', count: 23 },
    { name: 'Practice Projects', icon: '🏗️', count: 34 },
    { name: 'Interview Prep', icon: '💼', count: 56 }
  ]

  const recentResources = [
    {
      id: 1,
      title: 'React Hooks Complete Guide',
      type: 'Documentation',
      size: '2.4 MB',
      downloads: 1247,
      rating: 4.8,
      icon: '📚'
    },
    {
      id: 2,
      title: 'JavaScript ES6+ Features Tutorial',
      type: 'Video',
      size: '45.2 MB',
      downloads: 892,
      rating: 4.9,
      icon: '🎥'
    },
    {
      id: 3,
      title: 'CSS Grid Layout Examples',
      type: 'Code Examples',
      size: '1.8 MB',
      downloads: 567,
      rating: 4.7,
      icon: '💻'
    },
    {
      id: 4,
      title: 'Web Development Interview Questions',
      type: 'Interview Prep',
      size: '3.1 MB',
      downloads: 2341,
      rating: 4.6,
      icon: '💼'
    }
  ]

  const featuredResources = [
    {
      id: 1,
      title: 'Complete Web Development Roadmap',
      description: 'A comprehensive guide from HTML basics to advanced React concepts',
      downloads: 5678,
      rating: 4.9,
      featured: true
    },
    {
      id: 2,
      title: 'JavaScript Interview Masterclass',
      description: 'Practice questions and solutions for technical interviews',
      downloads: 3421,
      rating: 4.8,
      featured: true
    }
  ]

  return (
    <div className="space-y-6">
      {/* Resource Categories */}
      <div className="card">
        <h3 className="text-lg font-semibold text-accent mb-4">📁 Resource Categories</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <div key={category.name} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-accent/50 transition-colors cursor-pointer">
              <div className="text-center">
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium text-white text-sm">{category.name}</div>
                <div className="text-xs text-gray-400">{category.count} items</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Resources */}
      <div className="card">
        <h3 className="text-lg font-semibold text-accent mb-4">⭐ Featured Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredResources.map((resource) => (
            <div key={resource.id} className="p-6 bg-gradient-to-r from-accent/10 to-purple-500/10 rounded-lg border border-accent/20">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-white text-lg">{resource.title}</h4>
                <span className="text-yellow-400">⭐</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">{resource.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-gray-400">📥 {resource.downloads}</span>
                  <span className="text-yellow-400">★ {resource.rating}</span>
                </div>
                <button className="btn-primary text-sm">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Resources */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-accent">📥 Recent Resources</h3>
          <button className="btn-secondary text-sm">View All</button>
        </div>
        <div className="space-y-4">
          {recentResources.map((resource) => (
            <div key={resource.id} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-accent/50 transition-colors">
              <div className="text-2xl">{resource.icon}</div>
              <div className="flex-1">
                <h4 className="font-medium text-white">{resource.title}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <span>{resource.type}</span>
                  <span>📦 {resource.size}</span>
                  <span>📥 {resource.downloads}</span>
                  <span className="text-yellow-400">★ {resource.rating}</span>
                </div>
              </div>
              <button className="btn-secondary text-sm">Download</button>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <h3 className="text-lg font-semibold text-accent mb-4">🔍 Search Resources</h3>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search for resources..."
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent"
            />
            <button className="btn-primary">Search</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-accent/20 text-accent text-sm rounded-full cursor-pointer">All</span>
            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full cursor-pointer">Documentation</span>
            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full cursor-pointer">Videos</span>
            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full cursor-pointer">Code</span>
            <span className="px-3 py-1 bg-gray-700 text-gray-300 text-sm rounded-full cursor-pointer">Projects</span>
          </div>
        </div>
      </div>

      {/* Resource Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-white">375</div>
          <div className="text-sm text-gray-400">Total Resources</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-white">12.4K</div>
          <div className="text-sm text-gray-400">Total Downloads</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-white">4.8</div>
          <div className="text-sm text-gray-400">Avg Rating</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-white">89</div>
          <div className="text-sm text-gray-400">New This Week</div>
        </div>
      </div>
    </div>
  )
}

export default ResourcesSection 