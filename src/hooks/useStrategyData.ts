import { useState, useEffect, useCallback } from 'react'
import { Strategy } from '../types/strategy'
import { db } from '../lib/db'

export function useStrategyData() {
  const [strategies, setStrategies] = useState<Strategy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadStrategies = useCallback(async () => {
    try {
      setLoading(true)
      const allStrategies = db.getAllStrategies()
      setStrategies(allStrategies)
      setError(null)
    } catch (err) {
      setError('Failed to load strategies')
      console.error('Error loading strategies:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadStrategies()
  }, [loadStrategies])

  const saveStrategy = useCallback(async (strategy: Strategy) => {
    try {
      setLoading(true)
      const success = await db.saveStrategy(strategy)
      if (success) {
        await loadStrategies() // Refresh the list after saving
      }
      return success
    } catch (err) {
      setError('Failed to save strategy')
      return false
    } finally {
      setLoading(false)
    }
  }, [loadStrategies])

  return {
    strategies,
    loading,
    error,
    refreshStrategies: loadStrategies,
    saveStrategy
  }
}