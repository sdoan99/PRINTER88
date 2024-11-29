import React from 'react'
import { Link } from 'react-router-dom'

interface MarketCardProps {
  title: string
  icon: React.ReactNode
  description: string
  link?: string
}

const MarketCard: React.FC<MarketCardProps> = ({ title, icon, description, link }) => {
  const content = (
    <>
      <div className="flex items-center mb-4">
        <div className="bg-blue-100 p-3 rounded-full mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </>
  )

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      {link ? (
        <Link to={link} className="block">
          {content}
          <span className="mt-4 inline-block text-blue-600 hover:underline">Create</span>
        </Link>
      ) : (
        <>
          {content}
          <span className="mt-4 inline-block text-blue-600 hover:underline">Create</span>
        </>
      )}
    </div>
  )
}

export default MarketCard