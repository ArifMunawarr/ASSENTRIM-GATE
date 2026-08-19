import React, { useEffect, useRef, useState } from 'react'

export default function WebRtcPlayer({ streamUrl, fallbackImg, alt = 'Camera Stream', theme = 'dark', className = 'w-full h-full object-cover' }) {
  const videoRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!streamUrl) {
      setIsConnected(false)
      return
    }

    let pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })

    let isMounted = true

    pc.ontrack = (event) => {
      if (videoRef.current && event.streams && event.streams[0]) {
        videoRef.current.srcObject = event.streams[0]
        if (isMounted) {
          setIsConnected(true)
          setError(false)
        }
      }
    }

    async function initWebRtc() {
      try {
        pc.addTransceiver('video', { direction: 'recvonly' })
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        const res = await fetch(streamUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/sdp' },
          body: offer.sdp
        })

        if (!res.ok) throw new Error(`WHEP Handshake failed: ${res.status}`)
        const answerSdp = await res.text()

        if (isMounted && pc.signalingState !== 'closed') {
          await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answerSdp }))
        }
      } catch (err) {
        console.warn(`WebRTC connection failed for ${streamUrl}:`, err.message)
        if (isMounted) {
          setIsConnected(false)
          setError(true)
        }
      }
    }

    initWebRtc()

    return () => {
      isMounted = false
      if (pc) pc.close()
    }
  }, [streamUrl])

  if (streamUrl && isConnected && !error) {
    return (
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={className}
      />
    )
  }

  if (fallbackImg) {
    return (
      <img
        src={fallbackImg}
        alt={alt}
        className={`${className} ${theme === 'light' ? 'opacity-100' : 'mix-blend-screen opacity-90'}`}
      />
    )
  }

  return null
}
