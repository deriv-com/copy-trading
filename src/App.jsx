import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider, SnackbarProvider } from '@deriv-com/quill-ui'
import Login from './components/Login'
import OAuthRedirect from './components/OAuthRedirect'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <ThemeProvider
      theme="light"
      persistent
    >
      <SnackbarProvider>
        <Router>
          <Routes>
            <Route path="/" element={<OAuthRedirect />} />
            <Route path="/login" element={<Login />} />
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
      </SnackbarProvider>
    </ThemeProvider>
  )
}

export default App
