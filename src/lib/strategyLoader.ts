import { Strategy } from '../types/strategy'

export const strategyLoader = {
  async loadStrategy(strategyId: string): Promise<Strategy | null> {
    try {
      const response = await fetch(`/src/data/strategies/${strategyId}.json`)
      if (!response.ok) return null
      return await response.json()
    } catch (error) {
      console.error('Error loading strategy:', error)
      return null
    }
  },

  async loadAllStrategies(): Promise<Strategy[]> {
    try {
      // First load the index
      const indexResponse = await fetch('/src/data/strategies/index.json')
      if (!indexResponse.ok) return []
      const { strategies: strategyList } = await indexResponse.json()

      // Then load each strategy's full data
      const strategies = await Promise.all(
        strategyList.map(async (strategy: { id: string }) => {
          const fullStrategy = await this.loadStrategy(strategy.id)
          return fullStrategy
        })
      )

      return strategies.filter((s): s is Strategy => s !== null)
    } catch (error) {
      console.error('Error loading strategies:', error)
      return []
    }
  },

  async saveStrategy(strategy: Strategy): Promise<boolean> {
    try {
      const response = await fetch(`/api/strategies/${strategy.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(strategy, null, 2)
      })

      if (!response.ok) {
        throw new Error(`Failed to save strategy: ${response.statusText}`)
      }

      // Also update the strategy file directly
      const fileResponse = await fetch(`/src/data/strategies/${strategy.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(strategy, null, 2)
      })

      return fileResponse.ok
    } catch (error) {
      console.error('Error saving strategy:', error)
      return false
    }
  }
}