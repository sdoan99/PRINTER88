import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStrategies } from '../hooks/useStrategies'
import { Info } from 'lucide-react'

const marketTypes = [
  { id: 'stocks', label: 'Stocks' },
  { id: 'options', label: 'Options' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'sports', label: 'Sports' },
  { id: 'forex', label: 'Forex' }
]

const categories = [
  {
    id: 'trend-analysis',
    label: 'Trend Analysis',
    description: 'Strategies focused on identifying and following market trends using moving averages, trend lines, and momentum indicators.'
  },
  {
    id: 'harmonic-patterns',
    label: 'Harmonic Patterns',
    description: 'Trading based on geometric price patterns that identify reversals using Fibonacci ratios (Gartley, Butterfly, Bat patterns).'
  },
  {
    id: 'chart-patterns',
    label: 'Chart Patterns',
    description: 'Recognition and trading of classical chart formations like Head & Shoulders, Double Tops/Bottoms, Triangles, and Flags.'
  },
  {
    id: 'technical-indicators',
    label: 'Technical Indicators',
    description: 'Strategies utilizing mathematical calculations based on price and volume (RSI, MACD, Stochastic, Bollinger Bands).'
  },
  {
    id: 'wave-analysis',
    label: 'Wave Analysis',
    description: 'Elliott Wave Theory application to identify market cycles and predict future price movements.'
  },
  {
    id: 'gann',
    label: 'Gann',
    description: 'W.D. Gann methods including Square of 9, angles, and time/price relationships.'
  },
  {
    id: 'fundamental-analysis',
    label: 'Fundamental Analysis',
    description: 'Trading based on economic indicators, financial statements, and company/market valuations.'
  },
  {
    id: 'beyond-technical',
    label: 'Beyond Technical Analysis',
    description: 'Alternative approaches including market psychology, order flow, and intermarket analysis.'
  }
]

const timeframes = [
  { id: '1m', label: '1 Minute' },
  { id: '5m', label: '5 Minutes' },
  { id: '15m', label: '15 Minutes' },
  { id: '1h', label: '1 Hour' },
  { id: '4h', label: '4 Hours' },
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' }
]

const CreateStrategyPage: React.FC = () => {
  const navigate = useNavigate()
  const { addStrategy } = useStrategies()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    marketTypes: [] as string[],
    categories: [] as string[],
    timeframes: [] as string[]
  })
  const [error, setError] = useState<string | null>(null)
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleMarketTypeChange = (marketType: string) => {
    setFormData(prev => ({
      ...prev,
      marketTypes: prev.marketTypes.includes(marketType)
        ? prev.marketTypes.filter(t => t !== marketType)
        : [...prev.marketTypes, marketType]
    }))
  }

  const handleCategoryChange = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter(c => c !== categoryId)
        : [...prev.categories, categoryId]
    }))
  }

  const handleTimeframeChange = (timeframe: string) => {
    setFormData(prev => ({
      ...prev,
      timeframes: prev.timeframes.includes(timeframe)
        ? prev.timeframes.filter(t => t !== timeframe)
        : [...prev.timeframes, timeframe]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (formData.marketTypes.length === 0) {
        throw new Error('Please select at least one market type')
      }

      if (formData.categories.length === 0) {
        throw new Error('Please select at least one category')
      }

      if (formData.timeframes.length === 0) {
        throw new Error('Please select at least one timeframe')
      }

      const strategy = await addStrategy({
        name: formData.name,
        description: formData.description,
        marketTypes: formData.marketTypes,
        timeframes: formData.timeframes,
        categories: formData.categories
      })

      navigate(`/bets?strategy=${strategy.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating the strategy')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Strategy</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strategy Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Enter a unique name for your strategy"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder="Describe your strategy's approach, rules, and objectives"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market Types
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {marketTypes.map(market => (
                <label key={market.id} className="relative flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.marketTypes.includes(market.id)}
                    onChange={() => handleMarketTypeChange(market.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{market.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories
            </label>
            <div className="grid grid-cols-1 gap-4">
              {categories.map(category => (
                <div key={category.id} className="relative">
                  <label className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)}
                      className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">{category.label}</span>
                        <button
                          type="button"
                          className="ml-2 text-gray-400 hover:text-gray-500"
                          onMouseEnter={() => setShowTooltip(category.id)}
                          onMouseLeave={() => setShowTooltip(null)}
                        >
                          <Info size={16} />
                        </button>
                      </div>
                      {showTooltip === category.id && (
                        <div className="mt-1 text-sm text-gray-500">
                          {category.description}
                        </div>
                      )}
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeframes
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {timeframes.map(timeframe => (
                <label key={timeframe.id} className="relative flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={formData.timeframes.includes(timeframe.id)}
                    onChange={() => handleTimeframeChange(timeframe.id)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{timeframe.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Strategy
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateStrategyPage