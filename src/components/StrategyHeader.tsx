import React from 'react'
import { Activity, Briefcase, Clock, Tag } from 'lucide-react'
import { useStrategies } from '../hooks/useStrategies'

interface StrategyHeaderProps {
  strategyId: string
}

const StrategyHeader: React.FC<StrategyHeaderProps> = ({ strategyId }) => {
  const { strategies, loading } = useStrategies()
  const strategy = strategies.find(s => s.id === strategyId)

  if (loading || !strategy) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <Briefcase className="text-blue-600" size={32} />
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{strategy.name}</h1>
          <p className="text-gray-600 mt-1">{strategy.description}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-6 mt-4">
        <div>
          <div className="flex items-center mb-2">
            <Activity className="text-blue-600 mr-2" size={20} />
            <h3 className="text-sm font-medium text-gray-700">Markets</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {strategy.market_types.map((market, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {market}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center mb-2">
            <Clock className="text-blue-600 mr-2" size={20} />
            <h3 className="text-sm font-medium text-gray-700">Timeframes</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {strategy.timeframes.map((timeframe, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {timeframe}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center mb-2">
            <Tag className="text-blue-600 mr-2" size={20} />
            <h3 className="text-sm font-medium text-gray-700">Categories</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {strategy.categories.map((category, index) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StrategyHeader