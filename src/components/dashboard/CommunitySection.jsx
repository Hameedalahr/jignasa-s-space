const CommunitySection = () => {
  const studyGroups = [
    {
      id: 1,
      name: 'React Study Group',
      members: 24,
      topic: 'React Hooks & State Management',
      time: 'Today, 7:00 PM',
      level: 'Intermediate'
    },
    {
      id: 2,
      name: 'JavaScript Beginners',
      members: 18,
      topic: 'ES6+ Features',
      time: 'Tomorrow, 6:30 PM',
      level: 'Beginner'
    },
    {
      id: 3,
      name: 'Web Development',
      members: 32,
      topic: 'Full-Stack Projects',
      time: 'Friday, 8:00 PM',
      level: 'Advanced'
    }
  ]

  const recentDiscussions = [
    {
      id: 1,
      title: 'Help with React Context API',
      author: 'Sarah Chen',
      replies: 8,
      time: '2 hours ago',
      tags: ['react', 'help']
    },
    {
      id: 2,
      title: 'Best practices for JavaScript async/await',
      author: 'Mike Rodriguez',
      replies: 12,
      time: '1 day ago',
      tags: ['javascript', 'async']
    },
    {
      id: 3,
      title: 'CSS Grid vs Flexbox - When to use what?',
      author: 'Emily Johnson',
      replies: 15,
      time: '2 days ago',
      tags: ['css', 'layout']
    }
  ]

  const topContributors = [
    { name: 'Sarah Chen', points: 1240, avatar: 'SC' },
    { name: 'Mike Rodriguez', points: 1180, avatar: 'MR' },
    { name: 'Emily Johnson', points: 1050, avatar: 'EJ' },
    { name: 'Alex Thompson', points: 920, avatar: 'AT' },
    { name: 'Lisa Wang', points: 890, avatar: 'LW' }
  ]

  return (
    <div className="space-y-6">
      {/* Study Groups */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-accent">👥 Study Groups</h3>
          <button className="btn-primary text-sm">Create Group</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studyGroups.map((group) => (
            <div key={group.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-accent/50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-white">{group.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  group.level === 'Beginner' ? 'bg-green-900/20 text-green-400' :
                  group.level === 'Intermediate' ? 'bg-yellow-900/20 text-yellow-400' :
                  'bg-red-900/20 text-red-400'
                }`}>
                  {group.level}
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{group.topic}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">👥 {group.members} members</span>
                <span className="text-accent">🕐 {group.time}</span>
              </div>
              <button className="w-full btn-secondary mt-3 text-sm">Join Group</button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Discussions */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-accent">💬 Recent Discussions</h3>
          <button className="btn-secondary text-sm">View All</button>
        </div>
        <div className="space-y-4">
          {recentDiscussions.map((discussion) => (
            <div key={discussion.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-accent/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">{discussion.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>by {discussion.author}</span>
                    <span>💬 {discussion.replies} replies</span>
                    <span>{discussion.time}</span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {discussion.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-accent/20 text-accent text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Contributors */}
      <div className="card">
        <h3 className="text-lg font-semibold text-accent mb-4">🏆 Top Contributors</h3>
        <div className="space-y-3">
          {topContributors.map((contributor, index) => (
            <div key={contributor.name} className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-semibold">
                  {contributor.avatar}
                </div>
                <div>
                  <div className="font-medium text-white">{contributor.name}</div>
                  <div className="text-sm text-gray-400">{contributor.points} points</div>
                </div>
              </div>
              <div className="ml-auto">
                {index === 0 && <span className="text-yellow-400">🥇</span>}
                {index === 1 && <span className="text-gray-400">🥈</span>}
                {index === 2 && <span className="text-orange-400">🥉</span>}
                {index > 2 && <span className="text-gray-500">#{index + 1}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-bold text-white">1,247</div>
          <div className="text-sm text-gray-400">Active Members</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-white">89</div>
          <div className="text-sm text-gray-400">Study Groups</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-white">2,456</div>
          <div className="text-sm text-gray-400">Discussions</div>
        </div>
      </div>
    </div>
  )
}

export default CommunitySection 