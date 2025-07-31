const ProgressTracker = () => {
  const weeklyData = [
    { day: 'Mon', hours: 3, completed: 2 },
    { day: 'Tue', hours: 2, completed: 1 },
    { day: 'Wed', hours: 4, completed: 3 },
    { day: 'Thu', hours: 1, completed: 1 },
    { day: 'Fri', hours: 5, completed: 4 },
    { day: 'Sat', hours: 6, completed: 5 },
    { day: 'Sun', hours: 2, completed: 2 }
  ]

  const skills = [
    { name: 'React.js', progress: 85, level: 'Advanced' },
    { name: 'JavaScript', progress: 92, level: 'Expert' },
    { name: 'HTML/CSS', progress: 78, level: 'Intermediate' },
    { name: 'Node.js', progress: 45, level: 'Beginner' },
    { name: 'Python', progress: 60, level: 'Intermediate' }
  ]

  const achievements = [
    { name: 'First Steps', description: 'Complete your first course', earned: true, icon: '🎯' },
    { name: 'Week Warrior', description: 'Study for 7 consecutive days', earned: true, icon: '🔥' },
    { name: 'Quiz Master', description: 'Score 100% on 5 quizzes', earned: false, icon: '🏆' },
    { name: 'Community Helper', description: 'Help 10 other students', earned: false, icon: '🤝' }
  ]

  return (
    <div className="space-y-6">
      {/* Weekly Activity Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-accent mb-4">📊 Weekly Activity</h3>
        <div className="flex items-end justify-between h-32 mb-4">
          {weeklyData.map((data, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="relative">
                <div 
                  className="bg-accent rounded-t transition-all duration-300"
                  style={{ 
                    height: `${(data.hours / 6) * 100}px`,
                    width: '20px'
                  }}
                ></div>
                <div className="text-xs text-gray-400 mt-1">{data.hours}h</div>
              </div>
              <div className="text-xs text-gray-500">{data.day}</div>
            </div>
          ))}
        </div>
        <div className="text-sm text-gray-400">
          Total: {weeklyData.reduce((sum, data) => sum + data.hours, 0)} hours this week
        </div>
      </div>

      {/* Skills Progress */}
      <div className="card">
        <h3 className="text-lg font-semibold text-accent mb-4">🎯 Skills Progress</h3>
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{skill.name}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">{skill.level}</span>
                  <span className="text-sm text-accent">{skill.progress}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${skill.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h3 className="text-lg font-semibold text-accent mb-4">🏆 Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg border ${
                achievement.earned 
                  ? 'bg-green-900/20 border-green-500/20' 
                  : 'bg-gray-800/20 border-gray-700/20'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`text-2xl ${achievement.earned ? 'opacity-100' : 'opacity-50'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${achievement.earned ? 'text-white' : 'text-gray-400'}`}>
                    {achievement.name}
                  </h4>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
                {achievement.earned && (
                  <div className="text-green-400">✓</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Learning Streak */}
      <div className="card">
        <h3 className="text-lg font-semibold text-accent mb-4">🔥 Learning Streak</h3>
        <div className="flex items-center space-x-4">
          <div className="text-4xl">🔥</div>
          <div>
            <div className="text-2xl font-bold text-white">12 days</div>
            <div className="text-sm text-gray-400">Current learning streak</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-lg font-semibold text-green-400">+3 days</div>
            <div className="text-sm text-gray-400">This week</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressTracker 