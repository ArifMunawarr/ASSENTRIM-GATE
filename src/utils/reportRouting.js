export function reportFromLocation(location, state) {
  const id = new URLSearchParams(location.search).get('report_id')
  if (id) return { ...(state?.logData?.id === id ? state.logData : {}), id, reportId: id }
  return state?.logData ?? null
}

export function reportDetailPath(path, logData) {
  const id = logData?.reportId ?? logData?.id
  return id ? `${path}?report_id=${encodeURIComponent(id)}` : path
}
