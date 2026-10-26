export const GATE_COUNT = 5

export function buildGateTiles(gateList) {
  const byNumber = new Map()
  for (const gate of Array.isArray(gateList) ? gateList : []) {
    const match = /^GATE[-_\s]?(\d+)$/i.exec(String(gate?.code || '').trim())
    if (match) byNumber.set(Number(match[1]), gate)
  }

  return Array.from({ length: GATE_COUNT }, (_, index) => {
    const id = index + 1
    const gateLabel = `GATE ${String(id).padStart(2, '0')}`
    const gate = byNumber.get(id)
    const apiCamera = Array.isArray(gate?.cameras)
      ? gate.cameras.find((camera) => camera && camera.enabled !== false)
      : null
    const candidateUrl = typeof apiCamera?.stream_url === 'string' ? apiCamera.stream_url.trim() : ''
    const streamUrl = /^https?:\/\//i.test(candidateUrl) ? candidateUrl : null
    const health = gate?.telemetry?.cameras?.[apiCamera?.id]

    let offlineReason = null
    if (!gate) offlineReason = 'Gate not configured'
    else if (gate.enabled === false) offlineReason = 'Gate disabled'
    else if (gate.agent_online !== true) offlineReason = 'Gate agent offline'
    else if (!apiCamera) offlineReason = 'Camera not configured'
    else if (!streamUrl) offlineReason = 'Stream URL not configured'
    else if (health?.ready === false) offlineReason = 'Camera not ready'
    else if (health?.publisher_connected === false) offlineReason = 'Stream publisher offline'

    const camId = (apiCamera?.id || gateLabel).toUpperCase()
    const offline = offlineReason !== null
    return {
      id,
      name: gate?.name && String(gate.name).toUpperCase() !== String(gate.code || '').toUpperCase()
        ? `${gateLabel} - ${gate.name}`.toUpperCase()
        : gateLabel,
      camera: {
        id,
        camId,
        streamUrl,
        offline,
        offlineReason,
        location: apiCamera?.location || null,
        coords: apiCamera?.coords || null,
        sourceKey: JSON.stringify([id, camId, streamUrl, offline]),
      },
    }
  })
}

export function getCameraStatus(camera, cameraStatuses) {
  if (camera.offline || !camera.streamUrl) return 'offline'
  const connection = cameraStatuses[camera.id]
  return connection?.sourceKey === camera.sourceKey ? connection.status : 'connecting'
}

// Discard playback state when a source changes or is disabled by the backend.
export function retainCameraStatuses(tiles, cameraStatuses) {
  const next = {}
  for (const { camera } of tiles) {
    const connection = cameraStatuses[camera.id]
    if (!camera.offline && connection?.sourceKey === camera.sourceKey) {
      next[camera.id] = connection
    }
  }
  return next
}
