// Gate reports use calendar days in Asia/Jakarta, regardless of browser timezone.
export function reportDateKey(value) {
  if (!(value instanceof Date) || Number.isNaN(value.getTime())) return null
  const pad = (part) => String(part).padStart(2, '0')
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`
}

export function hasReportRange(range) {
  return Boolean(reportDateKey(range?.startDate))
}

export function normalizeReportRange(range) {
  if (!hasReportRange(range)) return { startDate: null, endDate: null }
  const start = range.startDate
  const end = reportDateKey(range.endDate) ? range.endDate : start
  return reportDateKey(end) < reportDateKey(start)
    ? { startDate: end, endDate: start }
    : { startDate: start, endDate: end }
}

export function reportRangeParams(range) {
  if (!hasReportRange(range)) return {}
  const start = reportDateKey(range.startDate)
  const end = reportDateKey(range.endDate) ?? start
  return { start_date: `${start}T00:00:00+07:00`, end_date: `${end}T23:59:59.999999+07:00` }
}
