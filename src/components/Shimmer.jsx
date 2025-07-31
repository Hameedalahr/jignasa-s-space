import React from 'react'

const Shimmer = ({ className = "", width = "w-full", height = "h-4" }) => {
  return (
    <div className={`animate-pulse bg-gray-700 rounded ${width} ${height} ${className}`}></div>
  )
}

export const ShimmerCard = ({ className = "" }) => {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 border border-gray-700 ${className}`}>
      <div className="flex items-center space-x-3 mb-3">
        <Shimmer className="w-8 h-8 rounded-full" />
        <div className="flex-1">
          <Shimmer className="w-3/4 mb-2" />
          <Shimmer className="w-1/2" />
        </div>
      </div>
      <Shimmer className="w-full h-2 mb-2" />
      <Shimmer className="w-2/3" />
    </div>
  )
}

export const ShimmerTableRow = () => {
  return (
    <tr className="border-b border-gray-700">
      <td className="py-3 px-4">
        <Shimmer className="w-6 h-6 rounded" />
      </td>
      <td className="text-center py-3 px-4">
        <Shimmer className="w-6 h-6 rounded-full mx-auto" />
      </td>
      <td className="py-3 px-4">
        <div className="space-y-2">
          <Shimmer className="w-3/4" />
          <Shimmer className="w-1/2" />
        </div>
      </td>
      <td className="text-center py-3 px-4">
        <Shimmer className="w-6 h-6 rounded mx-auto" />
      </td>
    </tr>
  )
}

export const ShimmerStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-center border border-gray-700">
          <Shimmer className="w-16 h-16 rounded-full mx-auto mb-2" />
          <Shimmer className="w-24 h-6 mx-auto mb-2" />
          <Shimmer className="w-32 h-4 mx-auto" />
        </div>
      ))}
    </div>
  )
}

export const ShimmerDomainCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Shimmer className="w-3/4 mb-2" />
          <Shimmer className="w-1/2" />
        </div>
        <div className="flex items-center space-x-2 ml-3">
          <Shimmer className="w-6 h-6 rounded" />
          <Shimmer className="w-12 h-6 rounded" />
        </div>
      </div>
      <Shimmer className="w-full h-2" />
    </div>
  )
}

export const ShimmerExploreCard = () => {
  return (
    <div className="p-6 rounded-lg border-2 bg-gray-800 border-gray-700">
      <div className="w-12 h-12 bg-gray-700 rounded animate-pulse mb-4"></div>
      <div className="w-48 h-6 bg-gray-700 rounded animate-pulse mb-2"></div>
      <div className="w-64 h-4 bg-gray-700 rounded animate-pulse"></div>
    </div>
  )
}

export const ShimmerFavoriteItem = () => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center space-x-3">
        <Shimmer className="w-6 h-6 rounded" />
        <div>
          <Shimmer className="w-32 h-4 mb-2" />
          <Shimmer className="w-24 h-3" />
        </div>
      </div>
      <Shimmer className="w-6 h-6 rounded" />
    </div>
  )
}

export const ShimmerSessionDetails = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
          <Shimmer className="w-24 h-4" />
          <Shimmer className="w-32 h-4" />
        </div>
      ))}
    </div>
  )
}

export const ShimmerTabContent = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <Shimmer className="w-32 h-6" />
        <Shimmer className="w-16 h-4" />
      </div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shimmer className="w-6 h-6 rounded" />
                  <Shimmer className="w-32 h-5" />
                  <Shimmer className="w-12 h-4" />
                </div>
                <Shimmer className="w-4 h-4 rounded" />
              </div>
            </div>
            <div className="p-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 w-16">
                        <Shimmer className="w-12 h-4" />
                      </th>
                      <th className="text-center py-3 px-4 w-16">
                        <Shimmer className="w-12 h-4 mx-auto" />
                      </th>
                      <th className="text-left py-3 px-4">
                        <Shimmer className="w-20 h-4" />
                      </th>
                      <th className="text-center py-3 px-4 w-20">
                        <Shimmer className="w-12 h-4 mx-auto" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((j) => (
                      <ShimmerTableRow key={j} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const ShimmerAuthLoading = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center max-w-md w-full px-4">
        {/* Logo Shimmer */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gray-700 rounded-full animate-pulse"></div>
        </div>
        
        {/* Title Shimmer */}
        <div className="w-48 h-8 bg-gray-700 rounded animate-pulse mx-auto mb-4"></div>
        
        {/* Subtitle Shimmer */}
        <div className="w-64 h-4 bg-gray-700 rounded animate-pulse mx-auto mb-6"></div>
        
        {/* Loading Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6 w-full bg-gray-700 rounded-full h-1">
          <div className="bg-yellow-400 h-1 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
      </div>
    </div>
  )
}

export default Shimmer 