import { useNavigate } from 'react-router-dom'
import { getTotalResources, getTotalProjects } from '../utils/resourceCounter'

const Explore = () => {
  const navigate = useNavigate()

  const domains = [
   
    // { id: 'c', name: 'C Programming', icon: 'fa-solid fa-c', color: '#A8B9CC', description: 'Start your programming journey with C language' },
    // { id: 'cpp', name: 'C++ Programming', icon: 'fa-solid fa-code', color: '#00599C', description: 'Explore C++ programming concepts and projects' },
    { id: 'java', name: 'Java Programming', icon: 'fa-brands fa-java', color: ' #FFD43B', description: 'Master Java programming from basics to advanced topics' },
    { id: 'python', name: 'Python Programming', icon: 'fa-brands fa-python', color: '#007396', description: 'Learn Python for all levels and applications' },
    { id: 'fullstack', name: 'MERN Stack Web Development', icon: 'fa-brands fa-react', color: '#61DAFB', description: 'Master the complete web development stack' },
    { id: 'dataeng', name: 'Data Engineering', icon: 'fa-solid fa-database', color: '#6C3483', description: 'Build scalable data pipelines and infrastructure' },
    { id: 'dataanalyst', name: 'Data Analyst', icon: 'fa-solid fa-chart-bar', color: '#27AE60', description: 'Transform data into actionable insights' },
    { id: 'datascientist', name: 'Data Scientist', icon: 'fa-solid fa-brain', color: '#F39C12', description: 'Advanced analytics and machine learning' },
    { id: 'uiux', name: 'UI/UX Design', icon: 'fa-solid fa-palette', color: '#E17055', description: 'Create beautiful and functional user experiences' },
    // { id: 'product', name: 'Product Manager', icon: 'fa-solid fa-clipboard-list', color: '#00B894', description: 'Lead product strategy and development' },
    // { id: 'hr', name: 'HR Manager', icon: 'fa-solid fa-users', color: 'rgb(121, 0, 164)', description: 'Manage human resources and talent' },
    // { id: 'marketing', name: 'Marketing', icon: 'fa-solid fa-bullhorn', color: '#E67E22', description: 'Digital marketing and growth strategies' },
    { id: 'freelance', name: 'Freelancing', icon: 'fa-solid fa-briefcase', color: 'rgb(0, 200, 255)', description: 'Build your freelance career' },
    { id: 'dsa', name: 'Data Structures & Algorithms', icon: 'fa-solid fa-sitemap', color: '#0984E3', description: 'Master fundamental programming concepts' }
  ]

  const handleDomainClick = (domain) => {
    navigate(`/explore/${domain.id}`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-block p-4 rounded-full border-4 border-yellow-400 mb-6">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-yellow-400 mb-4">
            Explore Domains
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose your path and embark on an exciting journey of learning and growth
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-12">
          {domains.map((domain) => (
            <div
              key={domain.id}
              onClick={() => handleDomainClick(domain)}
              className="group relative p-6 rounded-xl cursor-pointer border-2 border-yellow-400 bg-black hover:bg-yellow-900/10 transition-all duration-300 shadow-lg hover:shadow-yellow-400/20"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                <i className={`${domain.icon}`} style={{ color: domain.color }}></i>
              </div>
              <h3 className="text-lg font-bold mb-2 text-white group-hover:text-yellow-300 transition-colors duration-200">
                {domain.name}
              </h3>
              <p className="text-sm text-gray-300 mb-4 group-hover:text-yellow-200 transition-colors duration-200">
                {domain.description}
              </p>
              <div className="flex items-center text-xs text-yellow-400 group-hover:text-yellow-300 transition-colors duration-200 font-medium">
                <span>Explore</span>
                <svg className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics Section */}
        <div className="text-center mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 rounded-xl border-2 border-yellow-400 bg-black hover:bg-yellow-900/10 transition-all duration-300">
              <div className="text-4xl font-bold text-blue-400 mb-2">10+</div>
              <div className="text-lg text-white font-semibold">Domains</div>
              <div className="text-sm text-gray-400 mt-1">Comprehensive Learning Paths</div>
            </div>
            <div className="p-6 rounded-xl border-2 border-yellow-400 bg-black hover:bg-yellow-900/10 transition-all duration-300">
              <div className="text-4xl font-bold text-green-400 mb-2">{getTotalResources()}+</div>
              <div className="text-lg text-white font-semibold">Resources</div>
              <div className="text-sm text-gray-400 mt-1">Curated Learning Materials</div>
            </div>
            <div className="p-6 rounded-xl border-2 border-yellow-400 bg-black hover:bg-yellow-900/10 transition-all duration-300">
              <div className="text-4xl font-bold text-orange-400 mb-2">{getTotalProjects()}+</div>
              <div className="text-lg text-white font-semibold">Projects</div>
              <div className="text-sm text-gray-400 mt-1">Hands-on Experience</div>
            </div>
          </div>
        </div>

        <div className="text-center py-16">
          <div className="inline-block p-6 rounded-full border-4 border-yellow-400 mb-6">
            <span className="text-6xl">🎯</span>
          </div>
          <h3 className="text-3xl font-bold text-yellow-400 mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Click on any domain card above to view its comprehensive roadmap, curated resources, and hands-on projects. 
            Each domain is carefully designed to take you from beginner to professional.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Explore 