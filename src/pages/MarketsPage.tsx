import React from 'react'
import { useStrategies } from '../hooks/useStrategies'
import { Link } from 'react-router-dom'
import { SortField } from '../types/screener'
import ScreenerHeader from '../components/screener/ScreenerHeader'
import StrategyRow from '../components/screener/StrategyRow'
import TradingViewWidget from '../components/TradingViewWidget'
import { StockScreener } from '../components/ScreenerStock'
import { CryptoScreener } from '../components/ScreenerCrypto'
import { Loader, ArrowRight } from 'lucide-react'

const MarketsPage: React.FC = () => {
  const { strategies, loading, error } = useStrategies()

  const mockPerformance = {
    '24h': () => (Math.random() * 10 - 5).toFixed(2),
    '7d': () => (Math.random() * 20 - 10).toFixed(2),
    '28d': () => (Math.random() * 30 - 15).toFixed(2),
    '3m': () => (Math.random() * 40 - 20).toFixed(2),
    '6m': () => (Math.random() * 50 - 25).toFixed(2),
    '1y': () => (Math.random() * 60 - 30).toFixed(2),
  }

  const trendingStrategies = React.useMemo(() => {
    const enhanced = strategies.map(strategy => ({
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

    return enhanced
      .sort((a, b) => b.total_pnl - a.total_pnl)
      .slice(0, 7)
  }, [strategies])

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
        <div>
          <h1 className="text-3xl font-bold mb-2">Markets</h1>
          <p className="text-gray-600">Discover and analyze top-performing assets and trading strategies</p>
        </div>
      </div>

      <div className="mb-12 h-[600px]">
        <TradingViewWidget />
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Trending Strategies</h2>
          <Link 
            to="/strategy-screener" 
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            View All
            <ArrowRight size={23} />
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <Loader className="animate-spin h-8 w-8 text-blue-600" />
            </div>
          ) : trendingStrategies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No strategies found. Create a new strategy to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <ScreenerHeader field="name" currentSort="total_pnl" onSort={() => {}}>Name</ScreenerHeader>
                    <ScreenerHeader field="total_pnl" currentSort="total_pnl" onSort={() => {}}>Total PNL</ScreenerHeader>
                    <ScreenerHeader field="win_rate" currentSort="total_pnl" onSort={() => {}}>Win Rate</ScreenerHeader>
                    <ScreenerHeader field="avg_win" currentSort="total_pnl" onSort={() => {}}>Avg Win</ScreenerHeader>
                    <ScreenerHeader field="avg_loss" currentSort="total_pnl" onSort={() => {}}>Avg Loss</ScreenerHeader>
                    <ScreenerHeader field="profit_factor" currentSort="total_pnl" onSort={() => {}}>Profit Factor</ScreenerHeader>
                    <ScreenerHeader field="avg_pnl_per_day" currentSort="total_pnl" onSort={() => {}}>Avg PnL/Day</ScreenerHeader>
                    <ScreenerHeader field="24h" currentSort="total_pnl" onSort={() => {}}>24H</ScreenerHeader>
                    <ScreenerHeader field="7d" currentSort="total_pnl" onSort={() => {}}>7D</ScreenerHeader>
                    <ScreenerHeader field="28d" currentSort="total_pnl" onSort={() => {}}>28D</ScreenerHeader>
                    <ScreenerHeader field="3m" currentSort="total_pnl" onSort={() => {}}>3M</ScreenerHeader>
                    <ScreenerHeader field="6m" currentSort="total_pnl" onSort={() => {}}>6M</ScreenerHeader>
                    <ScreenerHeader field="1y" currentSort="total_pnl" onSort={() => {}}>1Y</ScreenerHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trendingStrategies.map((strategy) => (
                    <StrategyRow key={strategy.id} strategy={strategy} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Stocks & Equities</h2>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <StockScreener />
        </div>
      </div>

      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Cryptocurrency</h2>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <CryptoScreener />
        </div>
      </div>
    </div>
  )
}

export default MarketsPage