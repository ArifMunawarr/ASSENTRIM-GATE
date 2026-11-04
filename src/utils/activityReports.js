const EMPTY = '—'
export const REPORT_TIMEZONE = 'Asia/Jakarta'

export function apiPhotoUrl(value, baseUrl) {
  if (typeof value !== 'string' || !value) return null
  if (/^https?:\/\//i.test(value)) return value
  return `${baseUrl.replace(/\/$/, '')}/${value.replace(/^\//, '')}`
}

// A display label only: denied access must never become permission to open a gate.
export const accessStatusLabel = (status) => status === 'DENIED' ? 'OPERATOR OVERRIDE' : status

export function reportStatus(item) {
  if (item?.access_status === 'allowed') {
    return item.operator_name ? 'OPERATOR OVERRIDE' : 'AUTO AUTHORIZED'
  }
  return item?.access_status === 'denied' ? accessStatusLabel('DENIED') : 'PENDING'
}

export function rfidLabel(value) {
  return value === 'verified' ? 'VERIFIED' : 'NO RFID'
}

export function reportTime(value, timezone = REPORT_TIMEZONE, withDate = false) {
  if (!value) return EMPTY
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return EMPTY
  const time = date.toLocaleTimeString('en-GB', { timeZone: timezone, hour12: false })
  if (!withDate) return time
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  const part = (type) => parts.find((p) => p.type === type)?.value
  return `${part('year')}-${part('month')}-${part('day')} ${time}`
}

export function reportDuration(seconds) {
  if (seconds === null || seconds === undefined || seconds === '') return EMPTY
  const total = Number(seconds)
  if (!Number.isFinite(total) || total < 0) return EMPTY
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  return hours === 0 ? `${minutes} minutes` : `${hours} hours ${minutes} minutes`
}

const gateLabel = (side, withName) => {
  if (!side) return EMPTY
  const code = String(side.gate_code || '').replace(/-/g, ' ').toUpperCase()
  if (!code) return EMPTY
  const name = side.gate_name
  return withName && name && name !== side.gate_code ? `${code} - ${name}` : code
}

export function mapActivityReport(item, baseUrl, timezone = REPORT_TIMEZONE) {
  // Attempts fill the existing side columns according to their actual direction.
  // Unknown direction stays empty rather than being fabricated as an entry.
  const attempt = item.attempt
  const entry = item.entry ?? (attempt?.direction === 'entry' ? attempt : null)
  const exit = item.exit ?? (attempt?.direction === 'exit' ? attempt : null)
  const sideStatus = (side) => {
    if (!side) return null
    return reportStatus({
      ...side,
      access_status: side.access_status ?? item.access_status,
      operator_name: side.operator_name ?? (side.event_id === item.detail_event_id ? item.operator_name : null),
    })
  }
  const sideTime = (side) => side?.passed_at ?? side?.captured_at
  return {
    id: item.id,
    reportId: item.id,
    detailEventId: item.detail_event_id,
    plate: item.plate_number ?? null,
    alternativeNumber: item.alternative_number ?? null,
    type: item.vehicle_type ?? EMPTY,
    driver: item.responsible_name ?? 'Unknown',
    gateMasuk: gateLabel(entry, false),
    fotoMasuk: apiPhotoUrl(entry?.photo_url, baseUrl),
    waktuMasuk: reportTime(sideTime(entry), timezone),
    statusMasuk: sideStatus(entry),
    gateKeluar: gateLabel(exit, false),
    fotoKeluar: apiPhotoUrl(exit?.photo_url, baseUrl),
    waktuKeluar: reportTime(sideTime(exit), timezone),
    statusKeluar: sideStatus(exit),
    date: item.date ?? EMPTY,
    rfidStatus: rfidLabel(item.rfid_status),
    rfidOk: item.rfid_status === 'verified',
    status: reportStatus(item),
    accessStatus: item.access_status,
  }
}

export function mapActivityReportDetail(item, baseUrl) {
  const timezone = item.timezone ?? REPORT_TIMEZONE
  const row = mapActivityReport(item, baseUrl, timezone)
  const vehicle = item.vehicle ?? {}
  const entry = item.entry ?? (item.attempt?.direction === 'entry' ? item.attempt : null)
  const exit = item.exit ?? (item.attempt?.direction === 'exit' ? item.attempt : null)
  return {
    ...row,
    plate: row.plate ?? EMPTY,
    type: String(item.vehicle_type ?? vehicle.vehicle_type ?? EMPTY).toUpperCase(),
    status: item.access_status === 'allowed' ? 'AUTHORIZED' : item.access_status === 'denied' ? accessStatusLabel('DENIED') : 'PENDING',
    color: vehicle.vehicle_color ?? EMPTY,
    brand: [vehicle.brand, vehicle.vehicle_model].filter(Boolean).filter((v, i, all) => all.indexOf(v) === i).join(' ') || EMPTY,
    year: vehicle.year ?? EMPTY,
    rfidTag: vehicle.rfid_tag ?? EMPTY,
    driver: item.responsible_name ?? vehicle.personnel_name ?? 'Unknown',
    gateMasuk: gateLabel(entry, true),
    gateKeluar: gateLabel(exit, true),
    waktuMasuk: reportTime(entry?.passed_at ?? entry?.captured_at, timezone, true),
    waktuKeluar: reportTime(exit?.passed_at ?? exit?.captured_at, timezone, true),
    durasi: reportDuration(item.duration_seconds),
    operator: item.operator_name ?? EMPTY,
    catatan: item.notes || 'No operator notes.',
    riwayat: (item.vehicle_history ?? []).map((event) => ({
      waktu: reportTime(event.captured_at, timezone, true),
      gate: gateLabel(event, true),
      status: event.access_status === 'allowed' ? 'AUTHORIZED' : event.access_status === 'denied' ? accessStatusLabel('DENIED') : 'PENDING',
    })),
  }
}
