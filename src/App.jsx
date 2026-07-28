import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ActivityLogs from './pages/ActivityLogs'
import DetailLog from './pages/DetailLog'
import OperatorHelpDesk from './pages/OperatorHelpDesk'
import Profile from './pages/Profile'
import ViolationPopup from './components/ViolationPopup'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedLog, setSelectedLog] = useState(null)
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

  const handleNavigate = (page, logData) => {
    if (logData) {
      setSelectedLog(logData)
    }
    setCurrentPage(page)
  }

  const pageProps = { onNavigate: handleNavigate, theme, onToggleTheme: toggleTheme, onLogout: handleLogout }

  if (!isLoggedIn) {
    return (
      <>
        <ViolationPopup />
        <Login onLogin={() => setIsLoggedIn(true)} theme={theme} />
      </>
    )
  }

  if (currentPage === 'detaillog') {
    return (
      <>
        <ViolationPopup />
        <DetailLog logData={selectedLog} {...pageProps} />
      </>
    )
  }

  if (currentPage === 'activitylogs') {
    return (
      <>
        <ViolationPopup />
        <ActivityLogs {...pageProps} />
      </>
    )
  }

  if (currentPage === 'helpdesk') {
    return (
      <>
        <ViolationPopup />
        <OperatorHelpDesk {...pageProps} />
      </>
    )
  }

  if (currentPage === 'profile') {
    return (
      <>
        <ViolationPopup />
        <Profile {...pageProps} />
      </>
    )
  }

  return (
    <>
      <ViolationPopup />
      <Dashboard {...pageProps} />
    </>
  )
}

export default App

