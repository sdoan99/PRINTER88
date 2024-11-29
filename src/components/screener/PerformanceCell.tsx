import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface PerformanceCellProps {
  value: number
}

const PerformanceCell: React.FC<PerformanceCellProps> = ({ value }) => (
  <td className="px-6 py-4 whitespace-nowrap">
    <div className={`flex items-center ${value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {value >= 0 ? <TrendingUp size={16} className="mr-1" /> : <TrendingDown size={16} className="mr-1" />}
      {value.toFixed(2)}%
    </div>
  </td>
)

export default PerformanceCell