import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import BetsPage from './pages/BetsPage'
import CreateStrategyPage from './pages/CreateStrategyPage'
import StrategyScreener from './pages/StrategyScreener'
import ProfileSettingsPage from './pages/ProfileSettingsPage'
import MarketsPage from './pages/MarketsPage'
import CommunityPage from './pages/CommunityPage'
import LearnPage from './pages/LearnPage'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/markets" element={<MarketsPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/bets" element={<BetsPage />} />
            <Route path="/create-strategy" element={<CreateStrategyPage />} />
            <Route path="/strategy-screener" element={<StrategyScreener />} />
            <Route path="/profile/settings" element={<ProfileSettingsPage />} />
            <Route path="/community" element={<CommunityPage />} />
          </Routes>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App