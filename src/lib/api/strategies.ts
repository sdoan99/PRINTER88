import { supabase } from '../supabase'
import { Strategy } from '../../types/strategy'
import { v4 as uuidv4 } from 'uuid'

export interface CreateStrategyDto {
  name: string
  description: string
  marketTypes: string[]
  timeframes: string[]
  categories: string[]
}

export interface UpdateStrategyMetricsDto {
  totalPnL: number
  winRate: number
  avgWin: number
  avgLoss: number
  profitFactor: number
  avgPnLPerDay: number
}

async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) throw error
  if (!user) throw new Error('Authentication required')
  return user
}

export async function createStrategy(strategy: CreateStrategyDto) {
  try {
    const user = await getCurrentUser()
    const strategyId = uuidv4()

    const { data, error } = await supabase
      .from('strategies')
      .insert([{
        id: strategyId,
        user_id: user.id,
        name: strategy.name,
        description: strategy.description,
        market_types: strategy.marketTypes,
        timeframes: strategy.timeframes,
        categories: strategy.categories
      }])
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating strategy:', error)
    throw error
  }
}

export async function updateStrategyMetrics(strategyId: string, metrics: UpdateStrategyMetricsDto) {
  try {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('strategies')
      .update({
        total_pnl: metrics.totalPnL,
        win_rate: metrics.winRate,
        avg_win: metrics.avgWin,
        avg_loss: metrics.avgLoss,
        profit_factor: metrics.profitFactor,
        avg_pnl_per_day: metrics.avgPnLPerDay,
        updated_at: new Date().toISOString()
      })
      .eq('id', strategyId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating strategy metrics:', error)
    throw error
  }
}

export async function getStrategy(strategyId: string) {
  try {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('strategies')
      .select('*')
      .eq('id', strategyId)
      .eq('user_id', user.id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching strategy:', error)
    throw error
  }
}

export async function getUserStrategies() {
  try {
    const user = await getCurrentUser()

    const { data, error } = await supabase
      .from('strategies')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching user strategies:', error)
    throw error
  }
}

export async function deleteStrategy(strategyId: string) {
  try {
    const user = await getCurrentUser()

    const { error } = await supabase
      .from('strategies')
      .delete()
      .eq('id', strategyId)
      .eq('user_id', user.id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting strategy:', error)
    throw error
  }
}