import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import { UserProfile, UpdateUserProfileDto } from '../types/user'
import { getUserProfile, updateUserProfile } from '../lib/api/users'

export function useProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        setProfile(null)
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const data = await getUserProfile(user.id)
        setProfile(data)
        setError(null)
      } catch (err) {
        setError('Failed to load profile')
        console.error('Error loading profile:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [user])

  const updateProfile = async (updates: UpdateUserProfileDto) => {
    if (!user) return null

    setLoading(true)
    try {
      const updatedProfile = await updateUserProfile(user.id, updates)
      if (updatedProfile) {
        setProfile(updatedProfile)
        setError(null)
      }
      return updatedProfile
    } catch (err) {
      setError('Failed to update profile')
      console.error('Error updating profile:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    profile,
    loading,
    error,
    updateProfile,
  }
}