import { useEffect, useLayoutEffect, useState } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ActivityLogs from './pages/ActivityLogs'
import DetailLog from './pages/DetailLog'
import OperatorHelpDesk from './pages/OperatorHelpDesk'
import Profile from './pages/Profile'
import ViolationPopup from './components/ViolationPopup'
import { getMe, logout as apiLogout, refreshToken, subscribeRealtime } from './services/api'
import { OPERATOR_HELP_DESK_ENABLED } from './features'

const PAGE_PATHS = {
  login: '/login',
  dashboard: '/dashboard',
  activitylogs: '/activity-logs',
  detaillog: '/activity-logs/detail',
  helpdesk: '/operator-help-desk',
  profile: '/profile',
}

const getPageFromPath = (pathname) => {
  const normalizedPath = pathname.replace(/\/+$/, '') || '/'
  const page = Object.keys(PAGE_PATHS).find((page) => PAGE_PATHS[page] === normalizedPath) || null
  return page === 'helpdesk' && !OPERATOR_HELP_DESK_ENABLED ? null : page
}

const AUTH_KEY = 'asentrim-auth'

const getStoredAuth = () => {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_KEY))
  } catch {
    return null
  }
}

const saveAuth = (auth) => sessionStorage.setItem(AUTH_KEY, JSON.stringify(auth))

function App() {
  const [auth, setAuth] = useState(getStoredAuth)
  const [currentPage, setCurrentPage] = useState(() => getPageFromPath(window.location.pathname) || 'dashboard')
  const [selectedLog, setSelectedLog] = useState(() => window.history.state?.logData || null)
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

  const isLoggedIn = !!auth?.accessToken

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    const syncPageFromUrl = () => {
      const pageFromUrl = getPageFromPath(window.location.pathname)

      if (!isLoggedIn) {
        if (pageFromUrl !== 'login') {
          window.history.replaceState({}, '', PAGE_PATHS.login)
        }
        return
      }

      if (!pageFromUrl || pageFromUrl === 'login') {
        window.history.replaceState({}, '', PAGE_PATHS.dashboard)
        setCurrentPage('dashboard')
        setSelectedLog(null)
        return
      }

      setCurrentPage(pageFromUrl)
      setSelectedLog(window.history.state?.logData || null)
    }

    syncPageFromUrl()
    window.addEventListener('popstate', syncPageFromUrl)
    return () => window.removeEventListener('popstate', syncPageFromUrl)
  }, [isLoggedIn])

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

  // Verify the stored session once per token, then keep it alive by refreshing
  // before expiry (the API rotates tokens on refresh).
  useEffect(() => {
    if (!auth?.accessToken) return undefined
    const token = auth.accessToken
    let cancelled = false

    const dropSession = () => {
      sessionStorage.removeItem(AUTH_KEY)
      setAuth(null)
      updateRoute('login', { replace: true })
    }

    getMe(token).then((me) => {
      if (!cancelled && me) {
        const next = { ...auth, user: me }
        saveAuth(next)
        setAuth(next)
      }
    }).catch((err) => {
      if (!cancelled && err.status === 401) dropSession()
    })

    const maybeRefresh = async () => {
      const expiry = Date.parse(auth.expiresAt || '')
      if (Number.isFinite(expiry) && expiry - Date.now() > 5 * 60 * 1000) return
      try {
        const data = await refreshToken(token)
        if (cancelled) return
        const next = { accessToken: data.access_token, expiresAt: data.expires_at, user: data.user }
        saveAuth(next)
        setAuth(next)
      } catch (err) {
        if (!cancelled && err.status === 401) dropSession()
      }
    }

    const interval = setInterval(maybeRefresh, 60 * 1000)
    maybeRefresh()
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [auth?.accessToken])

  // Single SSE connection for the whole app; survives page navigation.
  useEffect(() => {
    if (!auth?.accessToken) return undefined

    const unsubscribe = subscribeRealtime(auth.accessToken, {
      onEvent: (event) => {
        if (event.event === 'unauthorized') {
          sessionStorage.removeItem(AUTH_KEY)
          setAuth(null)
          updateRoute('login', { replace: true })
          return
        }

        const envelope = typeof event.data === 'object' && event.data !== null ? event.data : {}
        const data = typeof envelope.data === 'object' && envelope.data !== null ? envelope.data : envelope
        const kind = String(event.event || envelope.type || data.type || '').toLowerCase()
        if (['keepalive', 'keep-alive', 'ping', 'heartbeat', 'connected'].includes(kind)
          || (event.data === null && kind === 'message')) return
        const violationLike = ['violation', 'denied', 'unreadable'].some((k) => kind.includes(k))
          || ['violation', 'denied', 'unreadable'].includes(String(data.access_status ?? data.verification_status ?? '').toLowerCase())

        if (violationLike) {
          window.dispatchEvent(new CustomEvent('show-violation', {
            detail: {
              gateId: data.gate_code ?? data.gate,
              type: data.type ?? data.violation_type ?? kind.toUpperCase(),
              timestamp: data.timestamp ?? data.occurred_at ?? data.created_at,
              message: data.message,
            },
          }))
        }

        window.dispatchEvent(new CustomEvent('asentrim-realtime', { detail: event }))
      },
    })

    return unsubscribe
  }, [auth?.accessToken])

  const toggleTheme = () => setTheme((currentTheme) => currentTheme === 'dark' ? 'light' : 'dark')

  const updateRoute = (page, { replace = false, logData = null } = {}) => {
    const nextPage = PAGE_PATHS[page] && (page !== 'helpdesk' || OPERATOR_HELP_DESK_ENABLED) ? page : 'dashboard'
    const historyMethod = replace ? 'replaceState' : 'pushState'
    window.history[historyMethod](logData ? { logData } : {}, '', PAGE_PATHS[nextPage])
    setCurrentPage(nextPage)
    setSelectedLog(logData)
  }

  const handleLoginSuccess = (data) => {
    const next = { accessToken: data.access_token, expiresAt: data.expires_at, user: data.user }
    saveAuth(next)
    setAuth(next)
    updateRoute('dashboard', { replace: true })
  }

  const handleLogout = () => {
    if (auth?.accessToken) apiLogout(auth.accessToken).catch(() => {})
    sessionStorage.removeItem(AUTH_KEY)
    setAuth(null)
    updateRoute('login', { replace: true })
  }

  const handleUserUpdate = (updatedUser) => {
    const next = { ...auth, user: updatedUser }
    saveAuth(next)
    setAuth(next)
  }

  const handleNavigate = (page, logData) => {
    updateRoute(page, { logData })
  }

  const pageProps = { user: auth?.user, accessToken: auth?.accessToken, onUserUpdate: handleUserUpdate, onNavigate: handleNavigate, theme, onToggleTheme: toggleTheme, onLogout: handleLogout }

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

  if (OPERATOR_HELP_DESK_ENABLED && currentPage === 'helpdesk') {
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
