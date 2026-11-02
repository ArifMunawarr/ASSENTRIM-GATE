import React, { useState, useEffect } from 'react'
import { CameraOff } from 'lucide-react'

// Evidence endpoints require a Bearer token, so <img src> can't be used
// directly — fetch each photo as a blob and release its URL when it changes.
export default function AuthImage({ src, token, alt, className, fallbackSize = 14 }) {
  const [photo, setPhoto] = useState(null)
  useEffect(() => {
    if (!src) return undefined
    const controller = new AbortController()
    let objectUrl
    fetch(src, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal })
      .then((res) => (res.ok ? res.blob() : Promise.reject(new Error(String(res.status)))))
      .then((blob) => {
        if (controller.signal.aborted) return
        objectUrl = URL.createObjectURL(blob)
        setPhoto({ src, token, url: objectUrl })
      })
      .catch(() => {
        if (!controller.signal.aborted) setPhoto({ src, token, failed: true })
      })
    return () => {
      controller.abort()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [src, token])
  if (!src || photo?.src !== src || photo?.token !== token || photo.failed || !photo.url) {
    return <CameraOff size={fallbackSize} className="text-slate-500" />
  }
  return <img src={photo.url} alt={alt} className={className} />
}
