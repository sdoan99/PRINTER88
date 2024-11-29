import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

const trendingData = [
  { name: 'AAPL', price: 150.25, change: 2.5 },
  { name: 'TSLA', price: 700.10, change: -1.8 },
  { name: 'BTC', price: 45000, change: 5.2 },
  { name: 'ETH', price: 3200, change: 3.7 },
  { name: 'NFL Parlay', odds: '+450', popularity: 'High' },
]

const TrendingAssets: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">Trending Assets</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Asset</th>
              <th className="text-right py-2">Price/Odds</th>
              <th className="text-right py-2">Change/Popularity</th>
            </tr>
          </thead>
          <tbody>
            {trendingData.map((asset, index) => (
              <tr key={index} className="border-b last:border-b-0">
                <td className="py-3">{asset.name}</td>
                <td className="text-right py-3">
                  {'price' in asset ? `$${asset.price.toFixed(2)}` : asset.odds}
                </td>
                <td className="text-right py-3">
                  {'change' in asset ? (
                    <span className={`flex items-center justify-end ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {asset.change >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
                      {Math.abs(asset.change)}%
                    </span>
                  ) : (
                    asset.popularity
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TrendingAssets