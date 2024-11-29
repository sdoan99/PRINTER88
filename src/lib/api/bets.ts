import { supabase } from '../supabase'
import { Bet, BetLeg } from '../../types/strategy'

export async function createBet(strategyId: string, bet: Omit<Bet, 'id'>) {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('No authenticated user')

    // First, create the main bet record
    const { data: betData, error: betError } = await supabase
      .from('bets_page')
      .insert([{
        user_id: user.id, // Add the user_id
        strategy_id: strategyId,
        date_time: bet.dateTime,
        market: bet.market,
        sector: bet.sector,
        symbol: bet.symbol,
        expiration: bet.expiration || null,
        risk: bet.risk,
        return: bet.return,
        return_percentage: bet.returnPercentage,
        status: bet.status
      }])
      .select()
      .single()

    if (betError) throw betError

    // Then, create all bet legs
    const betLegs = bet.legs.map(leg => ({
      bet_id: betData.id,
      date_time: leg.dateTime,
      quantity: leg.quantity,
      position: leg.position,
      price: leg.price,
      risk: leg.risk
    }))

    const { error: legsError } = await supabase
      .from('bets_new')
      .insert(betLegs)

    if (legsError) throw legsError

    return betData
  } catch (error) {
    console.error('Error creating bet:', error)
    throw error
  }
}

export async function updateBet(betId: string, updates: Partial<Bet>) {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('No authenticated user')

    // Update main bet record
    const { error: betError } = await supabase
      .from('bets_page')
      .update({
        date_time: updates.dateTime,
        market: updates.market,
        sector: updates.sector,
        symbol: updates.symbol,
        expiration: updates.expiration || null,
        risk: updates.risk,
        return: updates.return,
        return_percentage: updates.returnPercentage,
        status: updates.status
      })
      .eq('id', betId)
      .eq('user_id', user.id) // Ensure user owns the bet

    if (betError) throw betError

    // If legs are provided, update them
    if (updates.legs) {
      // Delete existing legs
      const { error: deleteError } = await supabase
        .from('bets_new')
        .delete()
        .eq('bet_id', betId)

      if (deleteError) throw deleteError

      // Insert new legs
      const betLegs = updates.legs.map(leg => ({
        bet_id: betId,
        date_time: leg.dateTime,
        quantity: leg.quantity,
        position: leg.position,
        price: leg.price,
        risk: leg.risk
      }))

      const { error: legsError } = await supabase
        .from('bets_new')
        .insert(betLegs)

      if (legsError) throw legsError
    }

    return true
  } catch (error) {
    console.error('Error updating bet:', error)
    throw error
  }
}

export async function deleteBet(betId: string) {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('No authenticated user')

    const { error } = await supabase
      .from('bets_page')
      .delete()
      .eq('id', betId)
      .eq('user_id', user.id) // Ensure user owns the bet

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting bet:', error)
    throw error
  }
}

export async function getBetsForStrategy(strategyId: string): Promise<Bet[]> {
  try {
    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError
    if (!user) throw new Error('No authenticated user')

    // First, get all bets for the strategy
    const { data: bets, error: betsError } = await supabase
      .from('bets_page')
      .select('*')
      .eq('strategy_id', strategyId)
      .eq('user_id', user.id) // Only get user's bets
      .order('date_time', { ascending: false })

    if (betsError) throw betsError
    if (!bets) return []

    // Then, get all legs for these bets
    const { data: legs, error: legsError } = await supabase
      .from('bets_new')
      .select('*')
      .in('bet_id', bets.map(bet => bet.id))
      .order('date_time', { ascending: true })

    if (legsError) throw legsError
    if (!legs) return []

    // Combine the data
    return bets.map(bet => ({
      id: bet.id,
      strategyId: bet.strategy_id,
      dateTime: bet.date_time,
      market: bet.market,
      sector: bet.sector,
      symbol: bet.symbol,
      expiration: bet.expiration || '',
      risk: bet.risk,
      return: bet.return,
      returnPercentage: bet.return_percentage,
      status: bet.status,
      legs: legs
        .filter(leg => leg.bet_id === bet.id)
        .map(leg => ({
          id: leg.id,
          dateTime: leg.date_time,
          quantity: leg.quantity,
          position: leg.position,
          price: leg.price,
          risk: leg.risk
        }))
    }))
  } catch (error) {
    console.error('Error fetching bets:', error)
    throw error
  }
}