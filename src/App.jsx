import { useEffect, useLayoutEffect, useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ActivityLogs from './pages/ActivityLogs'
import DetailLog from './pages/DetailLog'
import OperatorHelpDesk from './pages/OperatorHelpDesk'
import Profile from './pages/Profile'
import ViolationPopup from './components/ViolationPopup'

function App() {
  const [user, setUser] = useState(null)
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [selectedLog, setSelectedLog] = useState(null)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  const isLoggedIn = !!user

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  // Keep the approved Full HD composition at scale 1. Larger displays use
  // the tighter axis so a 4K 16:9 viewport is an exact 2x layout scale.
  useLayoutEffect(() => {
    const root = document.documentElement
    const updateZoom = () => {
      const requestedZoom = CSS.supports('zoom', '1')
        ? Math.max(1, Math.min(window.innerWidth / 1920, window.innerHeight / 1080))
        : 1
      // Zoom the root so rem sizes scale with pixel sizes in older WebKit too.
      root.style.zoom = requestedZoom > 1 ? String(requestedZoom) : ''
      const z = parseFloat(getComputedStyle(root).zoom) || 1
      root.style.setProperty('--z', String(z))
      root.classList.toggle('zoomed', z > 1)
      // Explicit pixels avoid engines applying zoom to vh/vw differently.
      root.style.setProperty('--layout-width', `${window.innerWidth / z}px`)
      root.style.setProperty('--layout-height', `${window.innerHeight / z}px`)

      // Legacy WebKit omits CSS zoom from client rectangles, while pointer
      // events still use visual pixels. Measure that behavior without UA checks.
      const probe = document.createElement('div')
      probe.style.cssText = 'position:fixed;width:100px;height:0;top:0;left:0;visibility:hidden;pointer-events:none'
      document.body.appendChild(probe)
      const rectangleScale = probe.getBoundingClientRect().width / 100 || 1
      root.style.setProperty('--client-rect-factor', String(z / rectangleScale))
      probe.remove()
    }
    updateZoom()
    window.addEventListener('resize', updateZoom)
    return () => {
      window.removeEventListener('resize', updateZoom)
      for (const property of ['--z', '--layout-width', '--layout-height', '--client-rect-factor']) {
        root.style.removeProperty(property)
      }
      root.classList.remove('zoomed')
      root.style.zoom = ''
    }
  }, [])

  const toggleTheme = () => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')

  const handleLoginSuccess = (userData) => setUser(userData)

  const handleLogout = () => {
    setUser(null)
    setCurrentPage('dashboard')
  }

  const handleNavigate = (page, logData) => {
    if (logData) {
      setSelectedLog(logData)
    }
    setCurrentPage(page)
  }

  const pageProps = { user, onNavigate: handleNavigate, theme, onToggleTheme: toggleTheme, onLogout: handleLogout }

  if (!isLoggedIn) {
    return (
      <>
        <ViolationPopup />
        <Login onLogin={handleLoginSuccess} theme={theme} />
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
