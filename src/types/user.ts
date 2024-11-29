export interface UserProfile {
  id: string
  user_id: string
  email: string
  created_at: string
  updated_at: string
  username?: string
  first_name?: string
  last_name?: string
  phone?: string
  alternative_email?: string
  avatar_url?: string | null
  is_online?: boolean
  twitter_handle?: string
  youtube_channel_link?: string
  youtube_username?: string
  facebook_profile?: string
  instagram_profile?: string
  website_url?: string
  signature?: string
  show_social_networks?: boolean
}

export interface UpdateUserProfileDto {
  username?: string
  first_name?: string
  last_name?: string
  phone?: string
  alternative_email?: string
  avatar_url?: string | null
  is_online?: boolean
  twitter_handle?: string
  youtube_channel_link?: string
  youtube_username?: string
  facebook_profile?: string
  instagram_profile?: string
  website_url?: string
  signature?: string
  show_social_networks?: boolean
}