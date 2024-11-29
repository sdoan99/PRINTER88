import React from 'react'
import { Link } from 'react-router-dom'
import { User, HelpCircle, Sun, Moon } from 'lucide-react'

interface SignInDropdownProps {
  darkMode: boolean
  onToggleDarkMode: () => void
  onSignInClick: () => void
  onClose: () => void
}

const SignInDropdown: React.FC<SignInDropdownProps> = ({
  darkMode,
  onToggleDarkMode,
  onSignInClick,
  onClose
}) => {
  return (
    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50">
      <button
        onClick={() => {
          onSignInClick()
          onClose()
        }}
        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
      >
        <User size={18} className="mr-3" />
        Sign in
      </button>

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
    </div>
  )
}

export default SignInDropdown