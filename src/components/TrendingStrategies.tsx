import React from 'react'
import { TrendingUp, DollarSign, Percent, BarChart2, TrendingDown } from 'lucide-react'
import { Link } from 'react-router-dom'

const trendingStrategies = [
  {
    id: 'momentum-breakout-001',
    name: 'Momentum Breakout',
    winRate: 65.5,
    avgWin: 450,
    avgLoss: 225,
    profitFactor: 2.1,
    avgPnLPerDay: 287.5
  },
  {
    id: 'options-iron-condor-001',
    name: 'Iron Condor',
    winRate: 78.2,
    avgWin: 550,
    avgLoss: 175,
    profitFactor: 2.8,
    avgPnLPerDay: 358.3
  },
  {
    id: 'crypto-dca-001',
    name: 'Crypto DCA',
    winRate: 55.0,
    avgWin: 325,
    avgLoss: 275,
    profitFactor: 1.5,
    avgPnLPerDay: 158.3
  }
]

const TrendingStrategies: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Trending Strategies</h2>
        <Link to="/bets" className="text-blue-600 hover:text-blue-800 flex items-center">
          View All
          <TrendingUp size={16} className="ml-1" />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Strategy</th>
              <th className="text-right py-2">
                <span className="flex items-center justify-end">
                  <Percent size={16} className="mr-1" />
                  Win Rate
                </span>
              </th>
              <th className="text-right py-2">
                <span className="flex items-center justify-end">
                  <TrendingUp size={16} className="mr-1" />
                  Avg Win
                </span>
              </th>
              <th className="text-right py-2">
                <span className="flex items-center justify-end">
                  <TrendingDown size={16} className="mr-1" />
                  Avg Loss
                </span>
              </th>
              <th className="text-right py-2">
                <span className="flex items-center justify-end">
                  <BarChart2 size={16} className="mr-1" />
                  Profit Factor
                </span>
              </th>
              <th className="text-right py-2">
                <span className="flex items-center justify-end">
                  <DollarSign size={16} className="mr-1" />
                  Avg Daily P&L
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {trendingStrategies.map((strategy) => (
              <tr key={strategy.id} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="py-3">
                  <Link to={`/bets?strategy=${strategy.id}`} className="text-blue-600 hover:text-blue-800">
                    {strategy.name}
                  </Link>
                </td>
                <td className="text-right py-3">
                  <span className={strategy.winRate >= 50 ? 'text-green-600' : 'text-red-600'}>
                    {strategy.winRate}%
                  </span>
                </td>
                <td className="text-right py-3">
                  <span className="text-green-600">
                    ${strategy.avgWin.toLocaleString()}
                  </span>
                </td>
                <td className="text-right py-3">
                  <span className="text-red-600">
                    ${strategy.avgLoss.toLocaleString()}
                  </span>
                </td>
                <td className="text-right py-3">
                  <span className={strategy.profitFactor >= 1 ? 'text-green-600' : 'text-red-600'}>
                    {strategy.profitFactor.toFixed(2)}
                  </span>
                </td>
                <td className="text-right py-3">
                  <span className={strategy.avgPnLPerDay >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ${strategy.avgPnLPerDay.toLocaleString()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TrendingStrategies