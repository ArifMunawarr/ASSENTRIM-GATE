import React, { useCallback, useEffect, useRef, useState } from 'react'

function attachStream(video, stream) {
  if (!video || !stream) return

  if (video.srcObject !== stream) {
    video.srcObject = stream
  }

  // `autoPlay` normally handles this, but explicitly starting playback makes
  // attaching a stream reliable when the video was hidden during negotiation.
  try {
    const playPromise = video.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {})
    }
  } catch {
    // The browser can retry through the `autoPlay` attribute once media loads.
  }
}

function clearVideo(video) {
  if (!video) return

  try {
    video.pause()
  } catch {
    // The element may already have been detached.
  }

  video.srcObject = null
}

export default function WebRtcPlayer({ streamUrl, fallbackImg, alt = 'Camera Stream', theme = 'dark', className = 'w-full h-full object-cover' }) {
  const videoRef = useRef(null)
  const receivedStreamRef = useRef(null)
  const [connectedStreamUrl, setConnectedStreamUrl] = useState(null)
  const [error, setError] = useState(false)

  const setVideoElement = useCallback((video) => {
    const previousVideo = videoRef.current
    if (previousVideo && previousVideo !== video) {
      clearVideo(previousVideo)
    }

    videoRef.current = video

    if (video && receivedStreamRef.current) {
      attachStream(video, receivedStreamRef.current)
    }
  }, [])

  useEffect(() => {
    setConnectedStreamUrl(null)
    setError(false)

    if (!streamUrl) {
      receivedStreamRef.current = null
      clearVideo(videoRef.current)
      return
    }

    let pc = null
    let isMounted = true
    let receivedStream = null
    const abortController = new AbortController()

    async function initWebRtc() {
      try {
        pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        })

        pc.ontrack = (event) => {
          if (!isMounted) return

          // Some WebRTC senders omit `event.streams`; collect their tracks in
          // a local MediaStream so those feeds still attach to the player.
          if (event.streams && event.streams[0]) {
            receivedStream = event.streams[0]
          } else {
            receivedStream = receivedStream || new MediaStream()
            if (!receivedStream.getTracks().includes(event.track)) {
              receivedStream.addTrack(event.track)
            }
          }

          receivedStreamRef.current = receivedStream
          attachStream(videoRef.current, receivedStream)
          setConnectedStreamUrl(streamUrl)
          setError(false)
        }

        pc.addTransceiver('video', { direction: 'recvonly' })
        const offer = await pc.createOffer()
        if (!isMounted || pc.signalingState === 'closed') return

        await pc.setLocalDescription(offer)
        if (!isMounted || pc.signalingState === 'closed') return

        const res = await fetch(streamUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/sdp' },
          body: offer.sdp,
          signal: abortController.signal
        })

        if (!res.ok) throw new Error(`WHEP Handshake failed: ${res.status}`)
        const answerSdp = await res.text()

        if (isMounted && pc.signalingState !== 'closed') {
          await pc.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: answerSdp }))
        }
      } catch (err) {
        if (!isMounted) return

        console.warn(`WebRTC connection failed for ${streamUrl}:`, err.message)
        setConnectedStreamUrl(null)
        setError(true)
      }
    }

    initWebRtc()

    return () => {
      isMounted = false
      abortController.abort()

      receivedStreamRef.current = null
      clearVideo(videoRef.current)

      if (pc) {
        pc.ontrack = null
        pc.close()
      }
    }
  }, [streamUrl])

  const showVideo = Boolean(streamUrl && connectedStreamUrl === streamUrl && !error)

  return (
    <>
      {fallbackImg && !showVideo && (
        <img
          key="fallback"
          src={fallbackImg}
          alt={alt}
          className={`${className} ${theme === 'light' ? 'opacity-100' : 'mix-blend-screen opacity-90'}`}
        />
      )}

      {streamUrl && (
        <video
          key="video"
          ref={setVideoElement}
          autoPlay
          playsInline
          muted
          className={className}
          style={showVideo ? undefined : { display: 'none' }}
        />
      )}
    </>
  )
}
