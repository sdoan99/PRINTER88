import React, { useState, useMemo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useStrategies } from '../hooks/useStrategies'
import { SortField, SortDirection } from '../types/screener'
import ScreenerHeader from '../components/screener/ScreenerHeader'
import StrategyRow from '../components/screener/StrategyRow'
import { Loader } from 'lucide-react'

const StrategyScreener: React.FC = () => {
  const { user } = useAuth()
  const { strategies, loading, error } = useStrategies()
  const [sortField, setSortField] = useState<SortField>('totalPnL')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [marketFilter, setMarketFilter] = useState<string>('all')

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const mockPerformance = {
    '24h': () => (Math.random() * 10 - 5).toFixed(2),
    '7d': () => (Math.random() * 20 - 10).toFixed(2),
    '28d': () => (Math.random() * 30 - 15).toFixed(2),
    '3m': () => (Math.random() * 40 - 20).toFixed(2),
    '6m': () => (Math.random() * 50 - 25).toFixed(2),
    '1y': () => (Math.random() * 60 - 30).toFixed(2),
  }

  const filteredAndSortedStrategies = useMemo(() => {
    const filtered = marketFilter === 'all'
      ? strategies
      : strategies.filter(s => s.market_types.includes(marketFilter.toLowerCase()))

    const enhanced = filtered.map(strategy => ({
      ...strategy,
      performance: {
        '24h': parseFloat(mockPerformance['24h']()),
        '7d': parseFloat(mockPerformance['7d']()),
        '28d': parseFloat(mockPerformance['28d']()),
        '3m': parseFloat(mockPerformance['3m']()),
        '6m': parseFloat(mockPerformance['6m']()),
        '1y': parseFloat(mockPerformance['1y']()),
      }
    }))

    return [...enhanced].sort((a, b) => {
      let compareA: number | string
      let compareB: number | string

      if (sortField === 'name') {
        compareA = a.name.toLowerCase()
        compareB = b.name.toLowerCase()
      } else if (sortField in mockPerformance) {
        compareA = a.performance[sortField as keyof typeof mockPerformance]
        compareB = b.performance[sortField as keyof typeof mockPerformance]
      } else {
        compareA = a[`${sortField}`]
        compareB = b[`${sortField}`]
      }

      if (typeof compareA === 'string') {
        return sortDirection === 'asc'
          ? compareA.localeCompare(compareB as string)
          : (compareB as string).localeCompare(compareA)
      }

      return sortDirection === 'asc'
        ? (compareA as number) - (compareB as number)
        : (compareB as number) - (compareA as number)
    })
  }, [strategies, sortField, sortDirection, marketFilter])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Please sign in to view strategies
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Strategy Screener</h1>
        <div className="flex space-x-4">
          <select 
            className="form-select rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={marketFilter}
            onChange={(e) => setMarketFilter(e.target.value)}
          >
            <option value="all">All Markets</option>
            <option value="stocks">Stocks</option>
            <option value="options">Options</option>
            <option value="crypto">Crypto</option>
            <option value="sports">Sports</option>
            <option value="forex">Forex</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        ) : filteredAndSortedStrategies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No strategies found. Create a new strategy to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <ScreenerHeader field="name" currentSort={sortField} onSort={handleSort}>Name</ScreenerHeader>
                  <ScreenerHeader field="total_pnl" currentSort={sortField} onSort={handleSort}>Total PNL</ScreenerHeader>
                  <ScreenerHeader field="win_rate" currentSort={sortField} onSort={handleSort}>Win Rate</ScreenerHeader>
                  <ScreenerHeader field="avg_win" currentSort={sortField} onSort={handleSort}>Avg Win</ScreenerHeader>
                  <ScreenerHeader field="avg_loss" currentSort={sortField} onSort={handleSort}>Avg Loss</ScreenerHeader>
                  <ScreenerHeader field="profit_factor" currentSort={sortField} onSort={handleSort}>Profit Factor</ScreenerHeader>
                  <ScreenerHeader field="avg_pnl_per_day" currentSort={sortField} onSort={handleSort}>Avg PnL/Day</ScreenerHeader>
                  <ScreenerHeader field="24h" currentSort={sortField} onSort={handleSort}>24H</ScreenerHeader>
                  <ScreenerHeader field="7d" currentSort={sortField} onSort={handleSort}>7D</ScreenerHeader>
                  <ScreenerHeader field="28d" currentSort={sortField} onSort={handleSort}>28D</ScreenerHeader>
                  <ScreenerHeader field="3m" currentSort={sortField} onSort={handleSort}>3M</ScreenerHeader>
                  <ScreenerHeader field="6m" currentSort={sortField} onSort={handleSort}>6M</ScreenerHeader>
                  <ScreenerHeader field="1y" currentSort={sortField} onSort={handleSort}>1Y</ScreenerHeader>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedStrategies.map((strategy) => (
                  <StrategyRow key={strategy.id} strategy={strategy} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default StrategyScreener