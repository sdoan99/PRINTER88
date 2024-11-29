import { useState, useEffect, useCallback } from 'react'
import { Bet } from '../types/strategy'
import { createBet, updateBet, deleteBet, getBetsForStrategy } from '../lib/api/bets'

export function useBets(strategyId: string) {
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadBets = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getBetsForStrategy(strategyId)
      setBets(data)
      setError(null)
    } catch (err) {
      setError('Failed to load bets')
      console.error('Error loading bets:', err)
    } finally {
      setLoading(false)
    }
  }, [strategyId])

  useEffect(() => {
    loadBets()
  }, [loadBets])

  const addBet = async (bet: Omit<Bet, 'id'>) => {
    try {
      await createBet(strategyId, bet)
      await loadBets()
    } catch (err) {
      setError('Failed to create bet')
      console.error('Error creating bet:', err)
    }
  }

  const editBet = async (betId: string, updates: Partial<Bet>) => {
    try {
      await updateBet(betId, updates)
      await loadBets()
    } catch (err) {
      setError('Failed to update bet')
      console.error('Error updating bet:', err)
    }
  }

  const removeBet = async (betId: string) => {
    try {
      await deleteBet(betId)
      await loadBets()
    } catch (err) {
      setError('Failed to delete bet')
      console.error('Error deleting bet:', err)
    }
  }

  return {
    bets,
    loading,
    error,
    addBet,
    editBet,
    removeBet,
    refreshBets: loadBets
  }
}