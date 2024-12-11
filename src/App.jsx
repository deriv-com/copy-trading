import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import OAuthRedirect from './components/OAuthRedirect'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import { testAccounts } from './utils/testData'
import { useEffect } from 'react'

function App() {
  // For testing: Set test data on first load if no data exists
  useEffect(() => {
    const existingAccount = localStorage.getItem('deriv_default_account')
    if (!existingAccount) {
      localStorage.setItem('deriv_default_account', JSON.stringify(testAccounts.defaultAccount))
      localStorage.setItem('deriv_other_accounts', JSON.stringify(testAccounts.otherAccounts))
    }
  }, [])

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/redirect" element={<OAuthRedirect />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<OAuthRedirect />} />
      </Routes>
    </Router>
  )
}

export default App
