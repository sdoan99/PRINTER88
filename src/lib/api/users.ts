import { supabase } from '../supabase'
import { UpdateUserProfileDto } from '../../types/user'

export async function createUserProfile(userId: string, email: string) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          email: email,
        }
      ])
      .select()
    
    if (error) {
      console.error('Error creating user profile:', error)
      throw error
    }
    
    return data?.[0]
  } catch (error) {
    console.error('Error in createUserProfile:', error)
    throw error
  }
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: UpdateUserProfileDto) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Error in updateUserProfile:', error)
    throw error
  }
}