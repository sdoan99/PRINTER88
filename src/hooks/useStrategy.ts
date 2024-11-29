import { useState, useCallback } from 'react'
import { Strategy, Bet } from '../types/strategy'
import { db } from '../lib/db'

export function useStrategy(strategyId: string) {
  const [strategy, setStrategy] = useState<Strategy | null>(() => 
    db.getStrategy(strategyId) || null
  )

  const refreshStrategy = useCallback(() => {
    const updated = db.getStrategy(strategyId)
    setStrategy(updated || null)
  }, [strategyId])

  const createBet = useCallback((bet: Omit<Bet, 'id' | 'strategyId'>) => {
    if (!strategy) return null
    const newBet = db.createBet(strategyId, bet)
    refreshStrategy()
    return newBet
  }, [strategy, strategyId, refreshStrategy])

  const updateBet = useCallback((betId: number, updates: Partial<Bet>) => {
    if (!strategy) return null
    const updatedBet = db.updateBet(strategyId, betId, updates)
    refreshStrategy()
    return updatedBet
  }, [strategy, strategyId, refreshStrategy])

  const deleteBet = useCallback((betId: number) => {
    if (!strategy) return
    db.deleteBet(strategyId, betId)
    refreshStrategy()
  }, [strategy, strategyId, refreshStrategy])

  return {
    strategy,
    createBet,
    updateBet,
    deleteBet,
    refreshStrategy
  }
}