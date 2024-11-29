import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useProfile } from '../hooks/useProfile'
import { Upload, Trash2, Info } from 'lucide-react'
import { supabase } from '../lib/supabase'

const ProfileSettingsPage: React.FC = () => {
  const { user } = useAuth()
  const { profile, updateProfile, loading, error: profileError } = useProfile()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    phone: '',
    alternative_email: '',
    twitter_handle: '',
    youtube_channel_link: '',
    youtube_username: '',
    facebook_profile: '',
    instagram_profile: '',
    website_url: '',
    signature: '',
    show_social_networks: true,
    is_online: true
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        alternative_email: profile.alternative_email || '',
        twitter_handle: profile.twitter_handle || '',
        youtube_channel_link: profile.youtube_channel_link || '',
        youtube_username: profile.youtube_username || '',
        facebook_profile: profile.facebook_profile || '',
        instagram_profile: profile.instagram_profile || '',
        website_url: profile.website_url || '',
        signature: profile.signature || '',
        show_social_networks: profile.show_social_networks ?? true,
        is_online: profile.is_online ?? true
      })
    }
  }, [profile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null)
      setUploading(true)

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      await updateProfile({ avatar_url: publicUrl })
      setSuccess('Avatar updated successfully')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error uploading avatar')
    } finally {
      setUploading(false)
    }
  }

  const handlePhotoDelete = async () => {
    try {
      setError(null)
      if (!profile?.avatar_url) return

      const fileName = profile.avatar_url.split('/').pop()
      if (!fileName) return

      const { error: deleteError } = await supabase.storage
        .from('avatars')
        .remove([fileName])

      if (deleteError) {
        throw deleteError
      }

      await updateProfile({ avatar_url: null })
      setSuccess('Avatar removed successfully')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error deleting avatar')
    }
  }

  const handleSavePublicInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      await updateProfile({
        username: formData.username,
        twitter_handle: formData.twitter_handle,
        youtube_channel_link: formData.youtube_channel_link,
        youtube_username: formData.youtube_username,
        facebook_profile: formData.facebook_profile,
        instagram_profile: formData.instagram_profile,
        website_url: formData.website_url,
        signature: formData.signature,
        show_social_networks: formData.show_social_networks,
        is_online: formData.is_online
      })
      setSuccess('Public information updated successfully')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error updating profile')
    }
  }

  const handleSavePrivateDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    try {
      await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        alternative_email: formData.alternative_email
      })
      setSuccess('Private details updated successfully')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error updating profile')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        {(error || profileError) && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error || profileError}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Public Info Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">PUBLIC INFO</h2>
            <p className="text-gray-600 mb-6">This information will be publicly displayed.</p>
            
            <form onSubmit={handleSavePublicInfo} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Choose a username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-green-500 flex items-center justify-center text-white text-2xl rounded">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover rounded" />
                    ) : (
                      user?.email?.[0].toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">JPG, GIF or PNG. Max size of 700KB</p>
                    <div className="flex space-x-2 mt-1">
                      <label className="cursor-pointer text-blue-600 hover:text-blue-800 text-sm">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          disabled={uploading}
                        />
                        {uploading ? 'Uploading...' : 'Upload photo'}
                      </label>
                      {profile?.avatar_url && (
                        <button
                          type="button"
                          onClick={handlePhotoDelete}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_online"
                    checked={formData.is_online}
                    onChange={handleCheckboxChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Show my online status</span>
                </label>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">Social Media Links</label>
                  <button type="button" className="text-gray-400 hover:text-gray-600">
                    <Info size={16} />
                  </button>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    name="twitter_handle"
                    placeholder="Twitter Username"
                    value={formData.twitter_handle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="url"
                    name="youtube_channel_link"
                    placeholder="YouTube Channel URL"
                    value={formData.youtube_channel_link}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="youtube_username"
                    placeholder="YouTube Username"
                    value={formData.youtube_username}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="facebook_profile"
                    placeholder="Facebook Username"
                    value={formData.facebook_profile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="text"
                    name="instagram_profile"
                    placeholder="Instagram Username"
                    value={formData.instagram_profile}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <input
                    type="url"
                    name="website_url"
                    placeholder="Website URL"
                    value={formData.website_url}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Signature</label>
                  <textarea
                    name="signature"
                    value={formData.signature}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="show_social_networks"
                      checked={formData.show_social_networks}
                      onChange={handleCheckboxChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Show social networks in my signature</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>

          {/* Private Details Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">PRIVATE DETAILS</h2>
            <p className="text-gray-600 mb-6">This information will not be publicly displayed.</p>
            
            <form onSubmit={handleSavePrivateDetails} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                >
                  Change email
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="+1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alternative email for alerts</label>
                <input
                  type="email"
                  name="alternative_email"
                  value={formData.alternative_email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Email address for alerts"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettingsPage