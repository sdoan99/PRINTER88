import { useState, useEffect, useCallback } from 'react'
import { Strategy, StrategyMetrics } from '../types/strategy'
import { 
  createStrategy, 
  updateStrategyMetrics, 
  getUserStrategies, 
  deleteStrategy,
  CreateStrategyDto
} from '../lib/api/strategies'
import { useAuth } from '../contexts/AuthContext'

export function useStrategies() {
  const { user } = useAuth()
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStrategies = useCallback(async () => {
    if (!user) {
      setStrategies([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const data = await getUserStrategies()
      setStrategies(data)
      setError(null)
    } catch (err) {
      setError('Failed to load strategies')
      console.error('Error loading strategies:', err)
      setStrategies([])
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadStrategies()
  }, [loadStrategies])

  const addStrategy = async (strategy: CreateStrategyDto): Promise<Strategy> => {
    if (!user) throw new Error('Authentication required')

    try {
      const newStrategy = await createStrategy(strategy)
      await loadStrategies()
      return newStrategy
    } catch (err) {
      setError('Failed to create strategy')
      console.error('Error creating strategy:', err)
      throw err
    }
  }

  const updateMetrics = async (strategyId: string, metrics: StrategyMetrics) => {
    if (!user) return

    try {
      await updateStrategyMetrics(strategyId, {
        totalPnL: metrics.totalPnL,
        winRate: metrics.winRate,
        avgWin: metrics.avgWin,
        avgLoss: metrics.avgLoss,
        profitFactor: metrics.profitFactor,
        avgPnLPerDay: metrics.avgPnLPerDay
      })
      await loadStrategies()
    } catch (err) {
      // Don't set error state here as this is a background operation
      console.error('Error updating strategy metrics:', err)
    }
  }

  const removeStrategy = async (strategyId: string) => {
    if (!user) throw new Error('Authentication required')

    try {
      await deleteStrategy(strategyId)
      await loadStrategies()
    } catch (err) {
      setError('Failed to delete strategy')
      console.error('Error deleting strategy:', err)
    }
  }

  return {
    strategies,
    loading,
    error,
    addStrategy,
    updateMetrics,
    removeStrategy,
    refreshStrategies: loadStrategies
  }
}