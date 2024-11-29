export type SortField = 
  | 'name' 
  | 'totalPnL' 
  | 'winRate' 
  | 'avgWin' 
  | 'avgLoss' 
  | 'profitFactor' 
  | 'avgPnLPerDay'
  | '24h'
  | '7d'
  | '28d'
  | '3m'
  | '6m'
  | '1y'

export type SortDirection = 'asc' | 'desc'

export interface Performance {
  '24h': number
  '7d': number
  '28d': number
  '3m': number
  '6m': number
  '1y': number
}