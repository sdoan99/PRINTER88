import { Strategy, ParentBet, ChildBet, StrategyMetrics } from '../types/strategy'
import { strategyLoader } from './strategyLoader'

class Database {
  private strategies: Map<string, Strategy> = new Map()
  private readonly STORAGE_KEY = 'youngInvestorHub_strategies'

  constructor() {
    this.loadStrategies()
  }

  private async loadStrategies() {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY)
      if (storedData) {
        const strategies = JSON.parse(storedData)
        strategies.forEach((strategy: Strategy) => {
          this.strategies.set(strategy.id, strategy)
        })
      } else {
        const strategies = await strategyLoader.loadAllStrategies()
        strategies.forEach(strategy => {
          this.strategies.set(strategy.id, strategy)
        })
        this.saveToStorage()
      }
    } catch (error) {
      console.error('Error loading strategies:', error)
    }
  }

  private saveToStorage() {
    try {
      const strategiesArray = Array.from(this.strategies.values())
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(strategiesArray))
    } catch (error) {
      console.error('Error saving strategies:', error)
    }
  }

  async saveStrategy(strategy: Strategy): Promise<boolean> {
    try {
      this.strategies.set(strategy.id, strategy)
      this.saveToStorage()
      return true
    } catch (error) {
      console.error('Error saving strategy:', error)
      return false
    }
  }

  getStrategy(id: string): Strategy | null {
    return this.strategies.get(id) || null
  }

  getAllStrategies(): Strategy[] {
    return Array.from(this.strategies.values())
  }

  async createParentBet(strategyId: string, bet: Omit<ParentBet, 'id' | 'strategyId' | 'childBets'>): Promise<ParentBet> {
    const strategy = this.strategies.get(strategyId)
    if (!strategy) throw new Error('Strategy not found')

    const newBet: ParentBet = {
      ...bet,
      id: Math.max(0, ...strategy.parentBets.map(b => b.id)) + 1,
      strategyId,
      childBets: []
    }

    strategy.parentBets.push(newBet)
    strategy.metrics = this.updateStrategyMetrics(strategy)
    strategy.updatedAt = new Date().toISOString()

    this.saveToStorage()
    return newBet
  }

  async createChildBet(strategyId: string, parentBetId: number, bet: Omit<ChildBet, 'id' | 'parentBetId'>): Promise<ChildBet> {
    const strategy = this.strategies.get(strategyId)
    if (!strategy) throw new Error('Strategy not found')

    const parentBet = strategy.parentBets.find(b => b.id === parentBetId)
    if (!parentBet) throw new Error('Parent bet not found')

    const newBet: ChildBet = {
      ...bet,
      id: Math.max(0, ...parentBet.childBets.map(b => b.id)) + 1,
      parentBetId
    }

    parentBet.childBets.push(newBet)
    this.updateParentBetMetrics(parentBet)
    strategy.metrics = this.updateStrategyMetrics(strategy)
    strategy.updatedAt = new Date().toISOString()

    this.saveToStorage()
    return newBet
  }

  private updateStrategyMetrics(strategy: Strategy): StrategyMetrics {
    const closedParentBets = strategy.parentBets.filter(bet => bet.status !== 'Open')
    const winningBets = closedParentBets.filter(bet => bet.status === 'Won')
    const losingBets = closedParentBets.filter(bet => bet.status === 'Lost')

    const totalPnL = closedParentBets.reduce((sum, bet) => sum + bet.return, 0)
    const winRate = closedParentBets.length > 0 ? (winningBets.length / closedParentBets.length) * 100 : 0
    
    const avgWin = winningBets.length > 0
      ? winningBets.reduce((sum, bet) => sum + bet.return, 0) / winningBets.length
      : 0
      
    const avgLoss = losingBets.length > 0
      ? Math.abs(losingBets.reduce((sum, bet) => sum + bet.return, 0) / losingBets.length)
      : 0

    const totalWins = winningBets.reduce((sum, bet) => sum + bet.return, 0)
    const totalLosses = Math.abs(losingBets.reduce((sum, bet) => sum + bet.return, 0))
    const profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins || 0

    const dates = closedParentBets.map(bet => new Date(bet.dateOpened).toDateString())
    const uniqueDates = new Set(dates)
    const avgPnLPerDay = uniqueDates.size > 0 ? totalPnL / uniqueDates.size : 0

    return {
      totalPnL,
      winRate,
      avgWin,
      avgLoss,
      profitFactor,
      avgPnLPerDay
    }
  }

  private updateParentBetMetrics(parentBet: ParentBet) {
    const closedChildBets = parentBet.childBets.filter(bet => bet.status !== 'Open')
    
    const totalRisk = parentBet.childBets.reduce((sum, bet) => sum + bet.risk, 0)
    const totalReturn = closedChildBets.reduce((sum, bet) => sum + bet.return, 0)
    
    parentBet.risk = totalRisk
    parentBet.return = totalReturn
    parentBet.returnPercentage = totalRisk > 0 ? (totalReturn / totalRisk) * 100 : 0
    
    if (parentBet.childBets.every(bet => bet.status !== 'Open')) {
      parentBet.status = parentBet.return > 0 ? 'Won' : parentBet.return < 0 ? 'Lost' : 'Push'
      parentBet.dateClosed = new Date().toISOString()
    } else {
      parentBet.status = 'Open'
      parentBet.dateClosed = undefined
    }
  }
}

export const db = new Database()