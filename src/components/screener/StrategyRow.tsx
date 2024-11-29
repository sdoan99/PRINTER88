import React from 'react'
import { Link } from 'react-router-dom'
import { Strategy } from '../../types/strategy'
import { Performance } from '../../types/screener'

interface EnhancedStrategy extends Strategy {
  performance: Performance
}

interface StrategyRowProps {
  strategy: EnhancedStrategy
}

const formatPercentage = (value: number | null) => {
  if (value === null || value === undefined) return '0.00%'
  return `${value.toFixed(2)}%`
}

const formatCurrency = (value: number | null) => {
  if (value === null || value === undefined) return '$0.00'
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
}

const formatNumber = (value: number | null) => {
  if (value === null || value === undefined) return '0.00'
  return value.toFixed(2)
}

const PerformanceCell: React.FC<{ value: number }> = ({ value }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm ${
    value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-500'
  }`}>
    {formatPercentage(value)}
  </td>
)

const StrategyRow: React.FC<StrategyRowProps> = ({ strategy }) => {
  const { performance } = strategy

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
        <Link to={`/bets?strategy=${strategy.id}`} className="hover:underline">
          {strategy.name}
        </Link>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {formatCurrency(strategy.total_pnl)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {formatPercentage(strategy.win_rate)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {formatCurrency(strategy.avg_win)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {formatCurrency(strategy.avg_loss)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {formatNumber(strategy.profit_factor)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {formatCurrency(strategy.avg_pnl_per_day)}
      </td>
      <PerformanceCell value={performance['24h']} />
      <PerformanceCell value={performance['7d']} />
      <PerformanceCell value={performance['28d']} />
      <PerformanceCell value={performance['3m']} />
      <PerformanceCell value={performance['6m']} />
      <PerformanceCell value={performance['1y']} />
    </tr>
  )
}

export default StrategyRow