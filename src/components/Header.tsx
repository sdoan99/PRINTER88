import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import AuthModal from './auth/AuthModal'
import UserProfileDropdown from './dropdown/UserProfileDropdown'
import SignInDropdown from './dropdown/SignInDropdown'

const Header = () => {
  const { user } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setShowDropdown(false)
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center hover:text-blue-600">
          <TrendingUp className="text-blue-600 mr-2" size={32} />
          <span className="text-xl font-bold">PRINTER</span>
        </Link>
        <nav className="flex items-center">
          <ul className="flex space-x-6 mr-6">
            <li>
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
            </li>
            <li>
              <Link to="/markets" className="text-gray-600 hover:text-blue-600">
                Markets
              </Link>
            </li>
            <li>
              <Link to="/learn" className="text-gray-600 hover:text-blue-600">
                Learn
              </Link>
            </li>
            <li>
              <Link to="/community" className="text-gray-600 hover:text-blue-600">
                Community
              </Link>
            </li>
          </ul>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {user ? (
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold">
                  {user.email?.[0].toUpperCase()}
                </div>
              ) : (
                <User size={24} className="text-gray-600" />
              )}
            </button>

            {showDropdown && (
              user ? (
                <UserProfileDropdown
                  user={user}
                  darkMode={darkMode}
                  onSignOut={handleSignOut}
                  onToggleDarkMode={toggleDarkMode}
                  onClose={() => setShowDropdown(false)}
                />
              ) : (
                <SignInDropdown
                  darkMode={darkMode}
                  onToggleDarkMode={toggleDarkMode}
                  onSignInClick={() => setShowAuthModal(true)}
                  onClose={() => setShowDropdown(false)}
                />
              )
            )}
          </div>
        </nav>
      </div>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  )
}

export default Header