import { useState } from 'react'

const CourseCard = ({ course }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="card hover:bg-gray-800/50 transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{course.image}</div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            course.level === 'Beginner' ? 'bg-green-900/20 text-green-400' :
            course.level === 'Intermediate' ? 'bg-yellow-900/20 text-yellow-400' :
            'bg-red-900/20 text-red-400'
          }`}>
            {course.level}
          </span>
        </div>
      </div>

      <h3 className="text-lg font-semibold text-white mb-2">{course.title}</h3>
      <p className="text-gray-400 text-sm mb-4">{course.description}</p>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Instructor</span>
          <span className="text-white">{course.instructor}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Duration</span>
          <span className="text-white">{course.duration}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-white">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-accent h-2 rounded-full transition-all duration-300"
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <button className="flex-1 btn-primary text-sm">
          {course.progress === 0 ? 'Start Learning' : 'Continue'}
        </button>
        <button className="btn-secondary text-sm px-3">
          📖
        </button>
      </div>
    </div>
  )
}

export default CourseCard 