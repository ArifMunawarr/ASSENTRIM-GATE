import React, { useState, useEffect } from 'react'
import { CameraOff } from 'lucide-react'

// Evidence endpoints require a Bearer token, so <img src> can't be used
// directly — fetch each photo as a blob once and reuse the object URL.
const photoBlobCache = new Map()

export default function AuthImage({ src, token, alt, className, fallbackSize = 14 }) {
  const [url, setUrl] = useState(() => photoBlobCache.get(src) ?? null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    if (!src) return undefined
    const cachedUrl = photoBlobCache.get(src)
    if (cachedUrl) {
      setUrl(cachedUrl)
      return undefined
    }
    let cancelled = false
    fetch(src, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(String(res.status)))))
      .then((blob) => {
        if (cancelled) return
        const objectUrl = URL.createObjectURL(blob)
        photoBlobCache.set(src, objectUrl)
        setUrl(objectUrl)
      })
      .catch(() => !cancelled && setFailed(true))
    return () => { cancelled = true }
  }, [src, token])
  if (!src || failed || !url) {
    return <CameraOff size={fallbackSize} className="text-slate-500" />
  }
  return <img src={url} alt={alt} className={className} />
}
