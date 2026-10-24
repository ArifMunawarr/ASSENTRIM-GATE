import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Camera, Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react'

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

function waitForIceGathering(pc, signal) {
  if (pc.iceGatheringState === 'complete') return Promise.resolve()

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timeout)
      pc.removeEventListener('icegatheringstatechange', onStateChange)
      signal.removeEventListener('abort', onAbort)
    }
    const onStateChange = () => {
      if (pc.iceGatheringState === 'complete') {
        cleanup()
        resolve()
      }
    }
    const onAbort = () => {
      cleanup()
      reject(new DOMException('WebRTC setup cancelled', 'AbortError'))
    }
    const timeout = setTimeout(() => {
      cleanup()
      reject(new Error('ICE gathering timed out'))
    }, 10000)

    pc.addEventListener('icegatheringstatechange', onStateChange)
    signal.addEventListener('abort', onAbort, { once: true })
    if (signal.aborted) onAbort()
    else onStateChange()
  })
}

export default function WebRtcPlayer({
  streamUrl,
  fallbackImg,
  mediaStream,
  onStream,
  onStatusChange,
  alt = 'Camera Stream',
  theme = 'dark',
  className = 'w-full h-full object-cover',
  showControls = false,
  fullscreenTargetRef,
}) {
  const videoRef = useRef(null)
  const receivedStreamRef = useRef(mediaStream || null)
  const onStreamRef = useRef(onStream)
  const onStatusChangeRef = useRef(onStatusChange)
  const failConnectionRef = useRef(null)
  const mutedRef = useRef(true)
  const [connectedStreamUrl, setConnectedStreamUrl] = useState(mediaStream ? streamUrl : null)
  const [error, setError] = useState(false)
  const [status, setStatus] = useState(streamUrl ? 'connecting' : 'offline')
  const [retryCount, setRetryCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [controlMessage, setControlMessage] = useState('')

  onStreamRef.current = onStream
  onStatusChangeRef.current = onStatusChange

  useEffect(() => {
    onStatusChangeRef.current?.(status)
  }, [status])

  const setVideoElement = useCallback((video) => {
    const previousVideo = videoRef.current
    if (previousVideo && previousVideo !== video) {
      clearVideo(previousVideo)
    }

    videoRef.current = video

    if (video) {
      video.muted = mutedRef.current
      if (receivedStreamRef.current) {
        attachStream(video, receivedStreamRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!showControls) return

    const handleFullscreenChange = () => {
      const target = fullscreenTargetRef?.current || videoRef.current
      setIsFullscreen(Boolean(document.fullscreenElement && document.fullscreenElement === target))
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [showControls, fullscreenTargetRef])

  useEffect(() => {
    if (!controlMessage) return
    const timeout = setTimeout(() => setControlMessage(''), 2500)
    return () => clearTimeout(timeout)
  }, [controlMessage])

  useEffect(() => {
    setConnectedStreamUrl(null)
    setError(false)
    setStatus(streamUrl ? 'connecting' : 'offline')

    // Reuse an already-playing stream in fullscreen so opening it does not
    // start another WHEP handshake or briefly show the static camera image.
    if (mediaStream) {
      receivedStreamRef.current = mediaStream
      attachStream(videoRef.current, mediaStream)
      setConnectedStreamUrl(streamUrl)

      return () => {
        clearVideo(videoRef.current)
      }
    }

    if (!streamUrl) {
      receivedStreamRef.current = null
      clearVideo(videoRef.current)
      return
    }

    let pc = null
    let isMounted = true
    let receivedStream = null
    let retryTimer = null
    let failed = false
    const abortController = new AbortController()

    const failConnection = () => {
      if (!isMounted || failed) return
      failed = true
      setStatus('offline')
      setConnectedStreamUrl(null)
      setError(true)
      receivedStreamRef.current = null
      clearVideo(videoRef.current)
      retryTimer = setTimeout(() => setRetryCount((count) => count + 1), 3000)
    }

    failConnectionRef.current = failConnection

    async function initWebRtc() {
      try {
        pc = new RTCPeerConnection()

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
            failConnection()
          }
        }

        pc.ontrack = (event) => {
          if (!isMounted || failed) return

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
          event.track.addEventListener('ended', failConnection, { once: true })
          attachStream(videoRef.current, receivedStream)
          setConnectedStreamUrl(streamUrl)
          setError(false)
          onStreamRef.current?.(receivedStream)
        }

        pc.addTransceiver('video', { direction: 'recvonly' })
        pc.addTransceiver('audio', { direction: 'recvonly' })
        const offer = await pc.createOffer()
        if (!isMounted || pc.signalingState === 'closed') return

        await pc.setLocalDescription(offer)
        await waitForIceGathering(pc, abortController.signal)
        if (!isMounted || pc.signalingState === 'closed') return

        const res = await fetch(streamUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/sdp' },
          body: pc.localDescription.sdp,
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
        failConnection()
      }
    }

    initWebRtc()

    return () => {
      isMounted = false
      abortController.abort()
      clearTimeout(retryTimer)
      failConnectionRef.current = null

      receivedStreamRef.current = null
      clearVideo(videoRef.current)

      if (pc) {
        pc.ontrack = null
        pc.onconnectionstatechange = null
        pc.close()
      }
    }
  }, [streamUrl, mediaStream, retryCount])

  const showVideo = Boolean(mediaStream || (streamUrl && connectedStreamUrl === streamUrl && !error))

  const togglePlayback = async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      try {
        await video.play()
      } catch {
        setControlMessage('Video cannot be played')
      }
    } else {
      video.pause()
    }
  }

  const toggleMuted = () => {
    const nextMuted = !mutedRef.current
    mutedRef.current = nextMuted
    if (videoRef.current) videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const takeSnapshot = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth || !video.videoHeight) {
      setControlMessage('Video frame is not available yet')
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
    canvas.toBlob((blob) => {
      if (!blob) {
        setControlMessage('Snapshot failed')
        return
      }

      const objectUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const safeName = alt.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'camera'
      link.href = objectUrl
      link.download = `${safeName}-${new Date().toISOString().replace(/[:.]/g, '-')}.png`
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
      setControlMessage('Snapshot saved')
    }, 'image/png')
  }

  const toggleFullscreen = async () => {
    const target = fullscreenTargetRef?.current || videoRef.current
    if (!target) return

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await target.requestFullscreen()
      }
    } catch {
      setControlMessage('Fullscreen is not supported by this browser')
    }
  }

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
          muted={isMuted}
          onPlaying={() => {
            setIsPlaying(true)
            setStatus('live')
          }}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => { if (!error) setStatus('connecting') }}
          onStalled={() => { if (!error) setStatus('connecting') }}
          onError={() => failConnectionRef.current?.()}
          className={className}
          style={showVideo ? undefined : { display: 'none' }}
        />
      )}

      {showControls && showVideo && (
        <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/15 bg-black/75 p-1.5 shadow-xl backdrop-blur-md sm:bottom-7 sm:gap-2 sm:p-2">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            title={isPlaying ? 'Pause' : 'Play'}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAFF9] sm:h-10 sm:w-10"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            type="button"
            onClick={toggleMuted}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            title={isMuted ? 'Unmute audio' : 'Mute audio'}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAFF9] sm:h-10 sm:w-10"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button
            type="button"
            onClick={takeSnapshot}
            aria-label="Save snapshot"
            title="Snapshot"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAFF9] sm:h-10 sm:w-10"
          >
            <Camera size={18} />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EAFF9] sm:h-10 sm:w-10"
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>
        </div>
      )}

      {showControls && controlMessage && (
        <div className="pointer-events-none absolute bottom-20 left-1/2 z-30 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-3 py-1.5 text-xs font-medium text-white sm:bottom-24">
          {controlMessage}
        </div>
      )}
    </>
  )
}
