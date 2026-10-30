export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://10.70.10.10:8007').replace(/\/$/, '')

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const buildQuery = (params) => {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params || {})) {
    if (value !== undefined && value !== null && value !== '') query.set(key, value)
  }
  const str = query.toString()
  return str ? `?${str}` : ''
}

async function requestFull(path, { method = 'GET', token, body } = {}) {
  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection.', 0)
  }

  const payload = await response.json().catch(() => null)
  if (!response.ok) {
    const detail = payload?.detail
    const message = Array.isArray(detail)
      ? detail.map((item) => item.msg || String(item)).join('. ')
      : (detail || `Request failed (${response.status})`)
    throw new ApiError(message, response.status)
  }
  return payload
}

async function request(path, options) {
  const payload = await requestFull(path, options)
  return payload?.data ?? payload
}

export const login = (username, password) =>
  request('/api/v1/auth/login', { method: 'POST', body: { username, password } })

export const logout = (token) =>
  request('/api/v1/auth/logout', { method: 'POST', token })

export const getMe = (token) =>
  request('/api/v1/auth/me', { token })

export const refreshToken = (token) =>
  request('/api/v1/auth/refresh', { method: 'POST', token })

export const updateProfile = (token, changes) =>
  request('/api/v1/auth/me', { method: 'PATCH', token, body: changes })

export const getGates = (token) =>
  request('/api/v1/gates', { token })

export const getDashboardSummary = (token) =>
  request('/api/v1/dashboard/summary', { token })

export const getActivity = (token, limit = 20) =>
  request(`/api/v1/activity?limit=${limit}`, { token })

export const getCommands = (token, limit = 20) =>
  request(`/api/v1/commands?limit=${limit}`, { token })

export const getLogs = async (token, params = {}) => {
  const payload = await requestFull(`/api/v1/logs${buildQuery(params)}`, { token })
  return { items: payload?.data ?? [], pagination: payload?.pagination ?? null }
}

export const getVisits = async (token, params = {}) => {
  const payload = await requestFull(`/api/v1/visits${buildQuery(params)}`, { token })
  return { items: payload?.data ?? [], pagination: payload?.pagination ?? null }
}

export const getLogDetail = (token, eventId) =>
  request(`/api/v1/logs/${eventId}`, { token })

export const updateLogNotes = (token, eventId, notes) =>
  request(`/api/v1/logs/${eventId}/notes`, { method: 'PATCH', token, body: { notes } })

export const exportLogs = async (token, format, params = {}) => {
  let response
  try {
    response = await fetch(`${API_BASE_URL}/api/v1/logs/export/${format}${buildQuery(params)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    throw new ApiError('Unable to reach the server. Check your connection.', 0)
  }
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new ApiError(payload?.detail || `Export failed (${response.status})`, response.status)
  }
  return {
    blob: await response.blob(),
    filename: /filename="?([^";]+)"?/.exec(response.headers.get('content-disposition') || '')?.[1] || `activity-logs.${format}`,
  }
}

const parseSseBlock = (block) => {
  const event = { event: 'message', data: null, id: null }
  for (const line of block.split('\n')) {
    if (!line || line.startsWith(':')) continue
    const colon = line.indexOf(':')
    const field = colon === -1 ? line : line.slice(0, colon)
    const value = colon === -1 ? '' : line.slice(colon + 1).replace(/^ /, '')
    if (field === 'event') event.event = value
    else if (field === 'id') event.id = value
    else if (field === 'data') event.data = event.data === null ? value : `${event.data}\n${value}`
  }
  if (event.data !== null) {
    try { event.data = JSON.parse(event.data) } catch { /* keep raw string */ }
  }
  return event
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const subscribeRealtime = (token, { onEvent } = {}) => {
  const controller = new AbortController()
  let closed = false
  let lastId = 0

  const connect = async () => {
    while (!closed) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/realtime/events?after=${lastId}`, {
          headers: { Authorization: `Bearer ${token}`, Accept: 'text/event-stream' },
          signal: controller.signal,
        })

        if (!response.ok || !response.body) {
          if (response.status === 401) {
            onEvent?.({ event: 'unauthorized', data: null, id: null })
            return
          }
          await delay(3000)
          continue
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (!closed) {
          const { value, done } = await reader.read()
          if (done) break
          buffer += decoder.decode(value, { stream: true })
          const blocks = buffer.split('\n\n')
          buffer = blocks.pop() ?? ''
          for (const block of blocks) {
            const event = parseSseBlock(block)
            if (event.id === null && event.data === null) continue
            if (event.id !== null) {
              const seq = Number(event.id)
              if (Number.isFinite(seq)) lastId = seq
            }
            onEvent?.(event)
          }
        }
      } catch (err) {
        if (closed || err?.name === 'AbortError') return
      }
      if (!closed) await delay(3000)
    }
  }

  connect()
  return () => {
    closed = true
    controller.abort()
  }
}
