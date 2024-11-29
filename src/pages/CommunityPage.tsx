import React from 'react'
import { TrendingUp, DollarSign, Bitcoin, Gamepad2, BarChart2, ArrowRight, Ticket } from 'lucide-react'
import MarketCard from '../components/MarketCard'
import TrendingAssets from '../components/TrendingAssets'
import TrendingStrategies from '../components/TrendingStrategies'

const CommunityPage: React.FC = () => {
  return (
    <div className="flex-grow container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">PRINTER</h1>
      <p className="text-xl text-center mb-12">Your gateway to smart investing and market analysis</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <MarketCard 
          title="Stocks" 
          icon={<TrendingUp />} 
          description="Analyze and track top performing stocks" 
          link="/strategy-screener"
        />
        <MarketCard 
          title="Options" 
          icon={<DollarSign />} 
          description="Explore stock options strategies" 
        />
        <MarketCard 
          title="Crypto" 
          icon={<Bitcoin />} 
          description="Stay updated on cryptocurrency trends" 
        />
        <MarketCard 
          title="Sports Betting" 
          icon={<Gamepad2 />} 
          description="Analyze odds and create winning parlays" 
        />
        <MarketCard 
          title="Strategies" 
          icon={<BarChart2 />} 
          description="Dive into trading strategies and opportunities" 
          link="/create-strategy" 
        />
        <MarketCard 
          title="Bets" 
          icon={<Ticket />} 
          description="Explore various capital markets and strategies" 
        />
      </div>

      <TrendingAssets />
      <TrendingStrategies />

      <div className="text-center mt-12">
        <a href="#" className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
          Get Started
          <ArrowRight className="ml-2" />
        </a>
      </div>
    </div>
  )
}

export default CommunityPage