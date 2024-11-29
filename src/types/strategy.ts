export interface Strategy {
  id: string
  user_id: string
  name: string
  description: string
  market_types: string[]
  timeframes: string[]
  categories: string[]
  total_pnl: number
  win_rate: number
  avg_win: number
  avg_loss: number
  profit_factor: number
  avg_pnl_per_day: number
  created_at: string
  updated_at: string
}

export interface Bet {
  id: string
  strategyId: string
  dateTime: string | null
  market: string
  sector: string
  symbol: string
  expiration: string | null
  risk: number
  return: number
  returnPercentage: number
  status: 'Open' | 'Closed' | 'Won' | 'Lost' | 'Push'
  legs: {
    id?: number
    dateTime: string | null
    quantity: number
    position: 'Buy' | 'Sell'
    price: number
    risk: number
  }[]
}

export interface StrategyMetrics {
  totalPnL: number
  winRate: number
  avgWin: number
  avgLoss: number
  profitFactor: number
  avgPnLPerDay: number
}