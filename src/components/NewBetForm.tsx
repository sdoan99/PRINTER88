import React, { useState, useEffect } from 'react'
import { Bet } from '../types/strategy'

interface NewBetFormProps {
  onSubmit: (bet: Omit<Bet, 'id' | 'strategyId'>) => void
  onClose: () => void
  onDelete: (id: string) => void
  initialBet?: Bet | null
}

const marketOptions = ['Stocks', 'Options', 'Crypto', 'Futures', 'Forex', 'Index', 'Sports']

const NewBetForm: React.FC<NewBetFormProps> = ({ onSubmit, onClose, onDelete, initialBet }) => {
  const [newBet, setNewBet] = useState<Omit<Bet, 'id' | 'strategyId'>>({
    dateTime: '',
    market: '',
    sector: '',
    symbol: '',
    expiration: null,
    risk: 0,
    return: 0,
    returnPercentage: 0,
    status: 'Open',
    legs: []
  })

  useEffect(() => {
    if (initialBet) {
      setNewBet({
        dateTime: initialBet.dateTime || '',
        market: initialBet.market,
        sector: initialBet.sector,
        symbol: initialBet.symbol,
        expiration: initialBet.expiration || null,
        risk: initialBet.risk,
        return: initialBet.return,
        returnPercentage: initialBet.returnPercentage,
        status: initialBet.status,
        legs: initialBet.legs || []
      })
    } else {
      const now = new Date()
      const formattedDateTime = now.toISOString().slice(0, 16)
      setNewBet(prev => ({
        ...prev,
        dateTime: formattedDateTime,
        legs: [{
          dateTime: formattedDateTime,
          quantity: 0,
          position: 'Buy',
          price: 0,
          risk: 0
        }]
      }))
    }
  }, [initialBet])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => {
    const { name, value } = e.target
    if (index !== undefined) {
      setNewBet(prev => {
        const updatedLegs = [...prev.legs]
        const updatedLeg = { ...updatedLegs[index], [name]: name === 'position' ? value : parseFloat(value) || value }
        
        if (name === 'quantity' || name === 'price') {
          updatedLeg.risk = updatedLeg.quantity * updatedLeg.price
        }
        
        updatedLegs[index] = updatedLeg
        return { ...prev, legs: updatedLegs }
      })
    } else {
      setNewBet(prev => ({ 
        ...prev, 
        [name]: name === 'expiration' && value === '' ? null : value 
      }))
    }
  }

  const calculateTotalQuantity = () => {
    return newBet.legs.reduce((sum, leg) => 
      sum + (leg.position === 'Buy' ? leg.quantity : -leg.quantity), 0)
  }

  const calculateRiskAndReturn = () => {
    if (newBet.legs.length === 0) {
      return { risk: 0, return: 0, returnPercentage: 0 }
    }

    const initialPosition = newBet.legs[0].position
    let entryRisk = 0
    let exitReturn = 0

    newBet.legs.forEach(leg => {
      if (leg.position === initialPosition) {
        entryRisk += leg.risk
      } else {
        exitReturn += leg.risk
      }
    })

    let returnValue: number
    let returnPercentage: number

    if (initialPosition === 'Sell') {
      returnValue = entryRisk - exitReturn
      returnPercentage = entryRisk ? ((entryRisk - exitReturn) / entryRisk) * 100 : 0
    } else {
      returnValue = exitReturn - entryRisk
      returnPercentage = entryRisk ? ((exitReturn - entryRisk) / entryRisk) * 100 : 0
    }

    return { risk: entryRisk, return: returnValue, returnPercentage }
  }

  const determineStatus = (totalQuantity: number, returnPercentage: number): Bet['status'] => {
    if (totalQuantity !== 0) return 'Open'
    if (returnPercentage > 0) return 'Won'
    if (returnPercentage < 0) return 'Lost'
    return 'Push'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const totalQuantity = calculateTotalQuantity()
    const { risk, return: returnValue, returnPercentage } = calculateRiskAndReturn()
    const status = determineStatus(totalQuantity, returnPercentage)

    onSubmit({
      ...newBet,
      risk,
      return: returnValue,
      returnPercentage,
      status,
      dateTime: newBet.dateTime || null,
      expiration: newBet.expiration || null
    })
  }

  const addLeg = () => {
    const now = new Date()
    const formattedDateTime = now.toISOString().slice(0, 16)
    setNewBet(prev => ({
      ...prev,
      legs: [...prev.legs, {
        dateTime: formattedDateTime,
        quantity: 0,
        position: 'Buy',
        price: 0,
        risk: 0
      }]
    }))
  }

  const removeLeg = (index: number) => {
    setNewBet(prev => ({
      ...prev,
      legs: prev.legs.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center" style={{ zIndex: 9999 }}>
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl relative" style={{ zIndex: 10000 }}>
        <h2 className="text-2xl font-semibold mb-6">{initialBet ? 'Edit Bet' : 'Enter New Bet'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="market">
                Market
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="market"
                name="market"
                value={newBet.market}
                onChange={handleInputChange}
                required
              >
                <option value="">Select market</option>
                {marketOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sector">
                Sector
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="sector"
                type="text"
                name="sector"
                value={newBet.sector}
                onChange={handleInputChange}
                placeholder="Enter sector"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="symbol">
                Symbol
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="symbol"
                type="text"
                name="symbol"
                value={newBet.symbol}
                onChange={handleInputChange}
                required
                placeholder="Enter symbol"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="expiration">
                Expiration
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="expiration"
                type="date"
                name="expiration"
                value={newBet.expiration || ''}
                onChange={handleInputChange}
                placeholder="Enter expiration"
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-6 gap-4 mb-2">
              <div className="text-center w-[35px]"></div>
              <div className="text-center">
                <span className="block text-gray-700 text-sm font-bold mb-2">Position</span>
              </div>
              <div className="text-center">
                <span className="block text-gray-700 text-sm font-bold mb-2">Date/Time</span>
              </div>
              <div className="text-center">
                <span className="block text-gray-700 text-sm font-bold mb-2">Quantity</span>
              </div>
              <div className="text-center">
                <span className="block text-gray-700 text-sm font-bold mb-2">Price</span>
              </div>
              <div className="text-center">
                <span className="block text-gray-700 text-sm font-bold mb-2">Risk</span>
              </div>
            </div>

            {newBet.legs.map((leg, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 mb-2 items-center">
                <div>
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-full w-[35px] h-[35px] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => removeLeg(index)}
                    disabled={newBet.legs.length === 1}
                  >
                    -
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className={`w-full py-2 px-4 rounded ${leg.position === 'Buy' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white font-bold transition-colors`}
                    onClick={() => handleInputChange({ target: { name: 'position', value: leg.position === 'Buy' ? 'Sell' : 'Buy' } } as React.ChangeEvent<HTMLSelectElement>, index)}
                  >
                    {leg.position}
                  </button>
                </div>
                <div>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="datetime-local"
                    name="dateTime"
                    value={leg.dateTime || ''}
                    onChange={(e) => handleInputChange(e, index)}
                  />
                </div>
                <div>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number"
                    name="quantity"
                    value={leg.quantity}
                    onChange={(e) => handleInputChange(e, index)}
                    required
                    step="0.01"
                  />
                </div>
                <div>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number"
                    name="price"
                    value={leg.price}
                    onChange={(e) => handleInputChange(e, index)}
                    required
                    step="0.01"
                  />
                </div>
                <div>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    type="number"
                    name="risk"
                    value={leg.risk}
                    readOnly
                    step="0.01"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-4">
            <p className="font-bold text-blue-600">Total Quantity: {calculateTotalQuantity()}</p>
            <p className="font-bold text-blue-600">Total Risk: ${calculateRiskAndReturn().risk.toFixed(2)}</p>
            <p className="font-bold text-blue-600">Total Return: ${calculateRiskAndReturn().return.toFixed(2)}</p>
          </div>

          <div className="flex items-center justify-end mt-6 space-x-4">
            <button
              type="button"
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={addLeg}
            >
              Add Leg
            </button>
            {initialBet && (
              <button
                type="button"
                className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => onDelete(initialBet.id)}
              >
                Delete
              </button>
            )}
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewBetForm