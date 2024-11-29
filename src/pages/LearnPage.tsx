import React from 'react'
import { Link } from 'react-router-dom'
import { 
  TrendingUp, 
  Binary, 
  Bitcoin, 
  Trophy, 
  Gem,
  Lightbulb,
  ArrowRight
} from 'lucide-react'

interface EducationCardProps {
  title: string
  description: string
  icon: React.ReactNode
  imageUrl: string
  link: string
}

const EducationCard: React.FC<EducationCardProps> = ({
  title,
  description,
  icon,
  imageUrl,
  link
}) => (
  <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
    <div className="relative h-48">
      <img
        src={imageUrl}
        alt={title}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
      </div>
    </div>
    <div className="p-6">
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        to={link}
        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
      >
        Learn More
        <ArrowRight size={18} className="ml-1" />
      </Link>
    </div>
  </div>
)

const LearnPage: React.FC = () => {
  const educationCards = [
    {
      title: 'Stocks & Equities',
      description: 'Master fundamental and technical analysis for stock market investing and trading.',
      icon: <TrendingUp size={24} />,
      imageUrl: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80',
      link: '/learn/stocks'
    },
    {
      title: 'Derivatives',
      description: 'Understand options, futures, and other derivative instruments for advanced trading.',
      icon: <Binary size={24} />,
      imageUrl: 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?auto=format&fit=crop&q=80',
      link: '/learn/derivatives'
    },
    {
      title: 'Cryptocurrency',
      description: 'Explore digital assets, blockchain technology, and crypto trading strategies.',
      icon: <Bitcoin size={24} />,
      imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80',
      link: '/learn/crypto'
    },
    {
      title: 'Sports Analytics',
      description: 'Learn data-driven approaches to sports betting and predictive modeling.',
      icon: <Trophy size={24} />,
      imageUrl: 'https://images.unsplash.com/photo-1509027572446-af8401acfdc3?auto=format&fit=crop&q=80',
      link: '/learn/sports'
    },
    {
      title: 'Alternative Assets',
      description: 'Discover unique investment opportunities beyond traditional markets.',
      icon: <Gem size={24} />,
      imageUrl: 'https://images.unsplash.com/photo-1626266061368-46a8f578ddd6?auto=format&fit=crop&q=80',
      link: '/learn/alternatives'
    },
    {
      title: 'Create Strategy',
      description: 'Build and backtest your own custom trading and investment strategies.',
      icon: <Lightbulb size={24} />,
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80',
      link: '/create-strategy'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Market Education</h1>
        <p className="text-xl text-gray-600">
          Expand your knowledge across different markets and asset classes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {educationCards.map((card) => (
          <EducationCard
            key={card.title}
            {...card}
          />
        ))}
      </div>
    </div>
  )
}

export default LearnPage