import React from 'react'
import { Link } from 'react-router-dom'
import { Settings, CreditCard, Users, HelpCircle, Bell, Sun, Moon, Globe, LogOut } from 'lucide-react'

interface UserProfileDropdownProps {
  user: any
  darkMode: boolean
  onSignOut: () => void
  onToggleDarkMode: () => void
  onClose: () => void
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({
  user,
  darkMode,
  onSignOut,
  onToggleDarkMode,
  onClose
}) => {
  const userInitial = user?.email?.[0].toUpperCase() || 'U'

  return (
    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50">
      {/* User Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-semibold text-lg">
            {userInitial}
          </div>
          <div className="ml-3">
            <div className="font-medium text-gray-900">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-2">
        <Link
          to="/profile/settings"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={onClose}
        >
          <Settings size={18} className="mr-3" />
          Profile Settings
        </Link>

        <Link
          to="/profile/billing"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={onClose}
        >
          <CreditCard size={18} className="mr-3" />
          Account and Billing
        </Link>

        <Link
          to="/profile/refer"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center justify-between"
          onClick={onClose}
        >
          <span className="flex items-center">
            <Users size={18} className="mr-3" />
            Refer a friend
          </span>
          <span className="text-gray-400">0 $</span>
        </Link>

        <div className="border-t border-gray-100 my-2"></div>

        <Link
          to="/help"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={onClose}
        >
          <HelpCircle size={18} className="mr-3" />
          Help Center
        </Link>

        <Link
          to="/notifications"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={onClose}
        >
          <Bell size={18} className="mr-3" />
          Notifications
        </Link>

        <Link
          to="/whats-new"
          className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
          onClick={onClose}
        >
          <span className="w-[18px] mr-3"></span>
          What's new
        </Link>

        <div className="border-t border-gray-100 my-2"></div>

        <button
          onClick={onToggleDarkMode}
          className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center justify-between"
        >
          <span className="flex items-center">
            {darkMode ? <Moon size={18} className="mr-3" /> : <Sun size={18} className="mr-3" />}
            Dark theme
          </span>
          <div className={`w-10 h-5 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-200'} relative`}>
            <div className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition-transform ${darkMode ? 'translate-x-5 left-0.5' : 'left-0.5'}`}></div>
          </div>
        </button>

        <button
          className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center justify-between"
        >
          <span className="flex items-center">
            <Globe size={18} className="mr-3" />
            Language
          </span>
          <span className="text-gray-400 flex items-center">
            English
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </button>

        <div className="border-t border-gray-100 my-2"></div>

        <button
          onClick={() => {
            onSignOut()
            onClose()
          }}
          className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <LogOut size={18} className="mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default UserProfileDropdown