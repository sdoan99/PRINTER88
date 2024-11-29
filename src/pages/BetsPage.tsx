import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Calendar, TrendingUp, TrendingDown, BarChart2, DollarSign, Percent } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useStrategies } from '../hooks/useStrategies'
import { useBets } from '../hooks/useBets'
import NewBetForm from '../components/NewBetForm'
import StrategyHeader from '../components/StrategyHeader'
import PnLChart from '../components/PnLChart'
import { Bet } from '../types/strategy'

const BetsPage: React.FC = () => {
  const { user } = useAuth()
  const [showNewBetForm, setShowNewBetForm] = useState(false)
  const [selectedBet, setSelectedBet] = useState<Bet | null>(null)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const strategyId = searchParams.get('strategy') || ''
  
  const { updateMetrics } = useStrategies()
  const { bets, loading, error, addBet, editBet, removeBet } = useBets(strategyId)

  const generateChartData = (bets: Bet[]) => {
    const dailyTotals = bets
      .filter(bet => bet.dateTime && bet.status !== 'Open')
      .reduce((acc, bet) => {
        const date = new Date(bet.dateTime!).toISOString().split('T')[0]
        acc[date] = (acc[date] || 0) + (bet.return || 0)
        return acc
      }, {} as Record<string, number>)

    const sortedDates = Object.keys(dailyTotals).sort()
    
    let runningTotal = 0
    return sortedDates.map(date => {
      runningTotal += dailyTotals[date]
      return {
        time: date,
        value: runningTotal
      }
    })
  }

  const calculateMetrics = (bets: Bet[]) => {
    const closedBets = bets.filter(bet => bet.status !== 'Open')
    const winningBets = closedBets.filter(bet => bet.status === 'Won')
    const losingBets = closedBets.filter(bet => bet.status === 'Lost')

    const totalPnL = closedBets.reduce((sum, bet) => sum + (bet.return || 0), 0)
    const winRate = closedBets.length > 0 ? (winningBets.length / closedBets.length) * 100 : 0
    
    const avgWin = winningBets.length > 0
      ? winningBets.reduce((sum, bet) => sum + (bet.return || 0), 0) / winningBets.length
      : 0
      
    const avgLoss = losingBets.length > 0
      ? Math.abs(losingBets.reduce((sum, bet) => sum + (bet.return || 0), 0) / losingBets.length)
      : 0

    const totalWins = winningBets.reduce((sum, bet) => sum + (bet.return || 0), 0)
    const totalLosses = Math.abs(losingBets.reduce((sum, bet) => sum + (bet.return || 0), 0))
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins || 0

    const dates = closedBets.map(bet => new Date(bet.dateTime || '').toDateString())
    const uniqueDates = new Set(dates)
    const avgPnLPerDay = uniqueDates.size > 0 ? totalPnL / uniqueDates.size : 0

    return {
      totalPnL,
      winRate,
      avgWin,
      avgLoss,
      profitFactor,
      avgPnLPerDay
    }
  }

  useEffect(() => {
    if (!user || !bets.length) return

    const metrics = calculateMetrics(bets)
    updateMetrics(strategyId, metrics)
  }, [bets, strategyId, updateMetrics, user])

  const handleNewBet = async (bet: Omit<Bet, 'id' | 'strategyId'>) => {
    if (selectedBet) {
      await editBet(selectedBet.id, bet)
    } else {
      await addBet(bet)
    }
    setShowNewBetForm(false)
    setSelectedBet(null)
  }

  const handleRowClick = (bet: Bet) => {
    setSelectedBet(bet)
    setShowNewBetForm(true)
  }

  const handleCloseForm = () => {
    setShowNewBetForm(false)
    setSelectedBet(null)
  }

  const handleDeleteBet = async (betId: string) => {
    await removeBet(betId)
    setShowNewBetForm(false)
    setSelectedBet(null)
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Please sign in to view bets
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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

  const metrics = calculateMetrics(bets)
  const chartData = generateChartData(bets)

  const MetricCard: React.FC<{ 
    title: string
    value: string | number
    icon: React.ReactNode
    trend?: 'up' | 'down' 
  }> = ({ 
    title, 
    value, 
    icon,
    trend 
  }) => (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <span className="text-gray-400">{icon}</span>
      </div>
      <div className="flex items-center">
        <span className="text-2xl font-bold">
          {typeof value === 'number' ? value.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }) : value}
        </span>
        {trend && (
          <span className={`ml-2 ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
          </span>
        )}
      </div>
    </div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-3">
          <StrategyHeader strategyId={strategyId} />
          
          <div className="grid grid-cols-1 gap-4 mt-6">
            <MetricCard
              title="TOTAL PNL"
              value={`$${metrics.totalPnL}`}
              icon={<DollarSign size={20} />}
              trend={metrics.totalPnL >= 0 ? 'up' : 'down'}
            />
            <MetricCard
              title="WIN RATE"
              value={`${metrics.winRate.toFixed(1)}%`}
              icon={<Percent size={20} />}
            />
            <MetricCard
              title="AVG WIN"
              value={`$${metrics.avgWin}`}
              icon={<TrendingUp size={20} />}
            />
            <MetricCard
              title="AVG LOSS"
              value={`$${metrics.avgLoss}`}
              icon={<TrendingDown size={20} />}
            />
            <MetricCard
              title="PROFIT FACTOR"
              value={metrics.profitFactor}
              icon={<BarChart2 size={20} />}
            />
            <MetricCard
              title="AVG PNL/DAY"
              value={`$${metrics.avgPnLPerDay}`}
              icon={<Calendar size={20} />}
              trend={metrics.avgPnLPerDay >= 0 ? 'up' : 'down'}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Performance</h2>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowNewBetForm(true)}
              >
                New Bet
              </button>
            </div>
            <PnLChart data={chartData} />
          </div>
          
          <div className="bg-white rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sector</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QTY</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return %</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bets.map((bet) => (
                    <tr 
                      key={bet.id} 
                      onClick={() => handleRowClick(bet)}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">{bet.market}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{bet.sector}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{bet.symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{bet.expiration}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{bet.dateTime ? new Date(bet.dateTime).toLocaleString() : ''}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {bet.legs.reduce((sum, leg) => sum + (leg.position === 'Buy' ? leg.quantity : -leg.quantity), 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">${bet.risk?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">${bet.return?.toFixed(2) || '0.00'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{bet.returnPercentage?.toFixed(2) || '0.00'}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          bet.status === 'Open' ? 'bg-yellow-100 text-yellow-800' :
                          bet.status === 'Closed' ? 'bg-blue-100 text-blue-800' :
                          bet.status === 'Won' ? 'bg-green-100 text-green-800' :
                          bet.status === 'Lost' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {bet.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {showNewBetForm && (
        <NewBetForm
          onSubmit={handleNewBet}
          onClose={handleCloseForm}
          onDelete={handleDeleteBet}
          initialBet={selectedBet}
        />
      )}
    </div>
  )
}

export default BetsPage