import React from 'react'
import { Check, X } from 'lucide-react'

const features = [
  { name: "Full and Historical Transparency", printer: true, citizen: false, mainstream: false },
  { name: "Multi Asset Coverage", printer: true, citizen: true, mainstream: true },
  { name: "Multi Market Coverage", printer: true, citizen: false, mainstream: true },
  { name: "A la Carte Services", printer: true, citizen: false, mainstream: false },
  { name: "1000+ Hours of Educational Resources", printer: true, citizen: true, mainstream: false },
  { name: "Community Group Chats", printer: true, citizen: true, mainstream: false },
  { name: "Live Trading Session", printer: true, citizen: true, mainstream: false },
  { name: "Economic and Trading Insights", printer: true, citizen: true, mainstream: false },
  { name: "Monthly Subscription Cost", printer: "$20", citizen: "$200", mainstream: "$12" },
]

const ComparisonTable: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-bold text-center text-white mb-12">Feature Comps</h2>
      <div className="bg-[#1C1C1C] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-4 px-6 text-gray-300 w-[40%]">Features</th>
              <th className="text-center py-4 px-4 text-gray-300 w-[20%]">Evergreen Printer</th>
              <th 
                className="text-center py-4 px-4 text-gray-300 w-[20%]"
                title="Discord, Substack, Twitter, Tiktok, YT, Social Platforms"
              >
                Financial Guru
              </th>
              <th 
                className="text-center py-4 px-4 text-gray-300 w-[20%]"
                title="CNBC, Financial Times, WSJ, Bloomberg, NYT"
              >
                Mainstream Media
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr 
                key={feature.name} 
                className={`border-b border-gray-700 ${
                  index === features.length - 1 ? 'font-bold' : ''
                }`}
              >
                <td className="py-4 px-6 text-gray-300">{feature.name}</td>
                <td className="text-center py-4 px-4">
                  {typeof feature.printer === 'boolean' ? (
                    feature.printer ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-300">{feature.printer}</span>
                  )}
                </td>
                <td className="text-center py-4 px-4">
                  {typeof feature.citizen === 'boolean' ? (
                    feature.citizen ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-300">{feature.citizen}</span>
                  )}
                </td>
                <td className="text-center py-4 px-4">
                  {typeof feature.mainstream === 'boolean' ? (
                    feature.mainstream ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-red-500 mx-auto" />
                    )
                  ) : (
                    <span className="text-gray-300">{feature.mainstream}</span>
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

export default ComparisonTable