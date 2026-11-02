import assert from 'node:assert/strict'
import { test } from 'node:test'
import { mapActivityReport, mapActivityReportDetail, reportDuration } from '../src/utils/activityReports.js'
import { reportFromLocation, reportDetailPath } from '../src/utils/reportRouting.js'

const base = 'http://gate.test:8007'
const entry = {
  event_id: 'entry-id', gate_code: 'GATE-01', gate_name: 'Main Entrance',
  passed_at: '2026-11-02T01:00:00Z', captured_at: '2026-11-02T01:00:00Z',
  photo_url: '/api/v1/evidence/entry-photo', access_status: 'allowed', operator_name: null,
}
const exit = {
  ...entry, event_id: 'exit-id', gate_code: 'GATE-02', gate_name: 'Side Exit',
  passed_at: '2026-11-02T02:00:00Z', captured_at: '2026-11-02T02:00:00Z',
  photo_url: '/api/v1/evidence/exit-photo', operator_name: 'Operator',
}
const visit = {
  id: 'visit-id', row_type: 'visit', detail_event_id: entry.event_id,
  plate_number: 'B1234ABC', alternative_number: '212-09', vehicle_type: 'SUV',
  responsible_name: 'Person', entry, exit, attempt: null, date: '2026-11-02',
  rfid_status: 'verified', access_status: 'allowed', operator_name: null, duration_seconds: 3600,
}

test('visit maps both sides and uses report ID for navigation, event ID for notes', () => {
  const row = mapActivityReport(visit, base)
  assert.equal(row.id, 'visit-id')
  assert.equal(row.detailEventId, 'entry-id')
  assert.equal(row.fotoMasuk, `${base}/api/v1/evidence/entry-photo`)
  assert.equal(row.fotoKeluar, `${base}/api/v1/evidence/exit-photo`)
  assert.equal(row.waktuMasuk, '08:00:00')
  assert.equal(row.waktuKeluar, '09:00:00')
  assert.equal(row.statusMasuk, 'AUTO AUTHORIZED')
  assert.equal(row.statusKeluar, 'OPERATOR OVERRIDE')
  assert.equal(row.date, '2026-11-02')
})

test('inside visit has no invented exit or zero duration', () => {
  const row = mapActivityReportDetail({ ...visit, exit: null, duration_seconds: null }, base)
  assert.equal(row.fotoKeluar, null)
  assert.equal(row.waktuKeluar, '—')
  assert.equal(row.gateKeluar, '—')
  assert.equal(row.durasi, '—')
  assert.equal(reportDuration(0), '0 minutes')
})

test('unmatched exit does not invent entry', () => {
  const row = mapActivityReport({ ...visit, entry: null }, base)
  assert.equal(row.fotoMasuk, null)
  assert.equal(row.statusMasuk, null)
  assert.equal(row.gateKeluar, 'GATE 02')
})

test('denied attempt uses its actual side, timestamp and RFID reason', () => {
  const row = mapActivityReport({
    ...visit, row_type: 'attempt', entry: null, exit: null, access_status: 'denied',
    rfid_status: 'mismatch', attempt: { ...exit, access_status: undefined, direction: 'exit', passed_at: undefined },
  }, base)
  assert.equal(row.statusKeluar, 'DENIED')
  assert.equal(row.waktuKeluar, '09:00:00')
  assert.equal(row.fotoMasuk, null)
  assert.equal(row.rfidStatus, 'MISMATCH')
  assert.equal(row.rfidOk, false)
})

test('pending is not presented as no RFID and unknown direction is not an entry', () => {
  const row = mapActivityReport({
    ...visit, entry: null, exit: null, access_status: 'pending', rfid_status: 'pending',
    attempt: { ...entry, direction: 'unknown' },
  }, base)
  assert.equal(row.rfidStatus, 'PENDING')
  assert.equal(row.fotoMasuk, null)
  assert.equal(row.fotoKeluar, null)
})

test('detail uses vehicle snapshot, history and server timezone', () => {
  const data = mapActivityReportDetail({
    ...visit, timezone: 'Asia/Jakarta', notes: 'Checked',
    vehicle: { vehicle_color: 'Black', brand: 'Toyota', vehicle_model: 'Fortuner', year: '2022', rfid_tag: 'TAG' },
    vehicle_history: [{ ...exit, direction: 'exit', verification_status: 'verified' }],
  }, base)
  assert.equal(data.color, 'Black')
  assert.equal(data.brand, 'Toyota Fortuner')
  assert.equal(data.year, '2022')
  assert.equal(data.rfidTag, 'TAG')
  assert.equal(data.gateMasuk, 'GATE 01 - Main Entrance')
  assert.equal(data.waktuKeluar, '2026-11-02 09:00:00')
  assert.equal(data.durasi, '1 hours 0 minutes')
  assert.equal(data.riwayat[0].waktu, '2026-11-02 09:00:00')
  assert.equal(data.catatan, 'Checked')
})

test('empty detail never defaults to authorized or verified', () => {
  const row = mapActivityReportDetail({ id: 'missing', vehicle: null }, base)
  assert.equal(row.status, 'PENDING')
  assert.equal(row.rfidOk, false)
  assert.equal(row.rfidStatus, '—')
  assert.equal(row.rfidTag, '—')
  assert.equal(row.durasi, '—')
  assert.deepEqual(row.riwayat, [])
})

test('report detail URL survives direct opening, refresh and back/forward state', () => {
  assert.equal(reportDetailPath('/activity-logs/detail', { id: 'report-id' }), '/activity-logs/detail?report_id=report-id')
  const location = { search: '?report_id=report-id' }
  assert.deepEqual(reportFromLocation(location, null), { id: 'report-id', reportId: 'report-id' })
  assert.equal(reportFromLocation(location, { logData: { id: 'stale' } }).id, 'report-id')
  assert.equal(reportFromLocation({ search: '' }, { logData: { id: 'legacy' } }).id, 'legacy')
})
