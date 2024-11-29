import React from 'react'
import { ArrowUpDown } from 'lucide-react'
import { SortField } from '../../types/screener'

interface ScreenerHeaderProps {
  children: React.ReactNode
  field: SortField
  currentSort: SortField
  onSort: (field: SortField) => void
}

const ScreenerHeader: React.FC<ScreenerHeaderProps> = ({ 
  children, 
  field, 
  currentSort, 
  onSort 
}) => {
  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        <ArrowUpDown 
          size={14} 
          className={`${currentSort === field ? 'text-blue-500' : 'text-gray-400'}`}
        />
      </div>
    </th>
  )
}

export default ScreenerHeader