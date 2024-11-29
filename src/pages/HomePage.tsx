import React from 'react'
import Hero from '../components/Hero'
import { Market } from '../components/Previews2'
import ComparisonTable from '../components/ComparisonTable'

const HomePage: React.FC = () => {
  return (
    <div>
      <Hero 
        title="Vetted strategies/" 
        subtitle="Open playbooks."
      />
      <div className="bg-black">
        <Market 
          title="Where the world does markets"
          subtitle="Join 90 million traders and investors taking the future into their own hands."
          className="py-20"
        />
        <div className="py-20">
          <ComparisonTable />
        </div>
      </div>
    </div>
  )
}

export default HomePage