import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ActivityLogs from './pages/ActivityLogs'
import OperatorHelpDesk from './pages/OperatorHelpDesk'
import Profile from './pages/Profile'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')
  const handleLogout = () => {
    setIsLoggedIn(false)
    setCurrentPage('dashboard')
  }
  const pageProps = { onNavigate: setCurrentPage, theme, onToggleTheme: toggleTheme, onLogout: handleLogout }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} theme={theme} />
  }

  if (currentPage === 'activitylogs') {
    return <ActivityLogs {...pageProps} />
  }

  if (currentPage === 'helpdesk') {
    return <OperatorHelpDesk {...pageProps} />
  }

  if (currentPage === 'profile') {
    return <Profile {...pageProps} />
  }

  return <Dashboard {...pageProps} />
}

export default App

