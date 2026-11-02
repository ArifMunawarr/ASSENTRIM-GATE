import assert from 'node:assert/strict'
import { afterEach, mock, test } from 'node:test'
import { getActivityReports, getActivityReportDetail, exportActivityReports, updateLogNotes } from '../src/services/api.js'

afterEach(() => mock.restoreAll())
const json = (body, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })

test('report list sends page, server authorization filter and auth token', async () => {
  const fetch = mock.method(globalThis, 'fetch', async () => json({ data: [{ id: 'report' }], pagination: { total: 1 }, timezone: 'Asia/Jakarta' }))
  const data = await getActivityReports('temporary-token', { page: 2, limit: 4, authorization_mode: 'operator_override', search: 'B 123', gate_code: undefined })
  const [url, options] = fetch.mock.calls[0].arguments
  assert.equal(new URL(url).pathname, '/api/v1/activity-reports')
  assert.equal(new URL(url).searchParams.get('authorization_mode'), 'operator_override')
  assert.equal(new URL(url).searchParams.get('page'), '2')
  assert.equal(new URL(url).searchParams.has('gate_code'), false)
  assert.equal(options.headers.Authorization, 'Bearer temporary-token')
  assert.equal(data.items[0].id, 'report')
})

test('detail uses report endpoint and preserves response timezone', async () => {
  const fetch = mock.method(globalThis, 'fetch', async () => json({ data: { id: 'visit', detail_event_id: 'event' }, timezone: 'Asia/Jakarta' }))
  const data = await getActivityReportDetail('token', 'visit')
  assert.equal(new URL(fetch.mock.calls[0].arguments[0]).pathname, '/api/v1/activity-reports/visit')
  assert.equal(data.detail_event_id, 'event')
  assert.equal(data.timezone, 'Asia/Jakarta')
})

test('attempt that became a visit resolves its canonical report', async () => {
  const responses = [json({ detail: 'Report not found' }, 404), json({ data: { visit: { id: 'visit' } } }), json({ data: { id: 'visit' }, timezone: 'Asia/Jakarta' })]
  const fetch = mock.method(globalThis, 'fetch', async () => responses.shift())
  assert.equal((await getActivityReportDetail('token', 'event')).id, 'visit')
  assert.deepEqual(fetch.mock.calls.map((call) => new URL(call.arguments[0]).pathname), [
    '/api/v1/activity-reports/event', '/api/v1/logs/event', '/api/v1/activity-reports/visit',
  ])
})

test('auth errors propagate without fallback requests', async () => {
  const fetch = mock.method(globalThis, 'fetch', async () => json({ detail: 'Expired' }, 401))
  await assert.rejects(getActivityReportDetail('token', 'report'), { status: 401 })
  assert.equal(fetch.mock.calls.length, 1)
})

test('notes remain on the event endpoint', async () => {
  const fetch = mock.method(globalThis, 'fetch', async () => json({ data: { notes: 'checked' } }))
  await updateLogNotes('token', 'event-id', 'checked')
  const [url, options] = fetch.mock.calls[0].arguments
  assert.equal(new URL(url).pathname, '/api/v1/logs/event-id/notes')
  assert.equal(options.method, 'PATCH')
})

test('export uses report endpoint with the same filters and filename', async () => {
  const fetch = mock.method(globalThis, 'fetch', async () => new Response('%PDF', { headers: { 'Content-Disposition': 'attachment; filename="gate-activity-reports.pdf"' } }))
  const exported = await exportActivityReports('token', 'pdf', { authorization_mode: 'auto_authorized', gate_code: 'GATE-01' })
  const url = new URL(fetch.mock.calls[0].arguments[0])
  assert.equal(url.pathname, '/api/v1/activity-reports/export/pdf')
  assert.equal(url.searchParams.get('authorization_mode'), 'auto_authorized')
  assert.equal(exported.filename, 'gate-activity-reports.pdf')
  assert.equal(await exported.blob.text(), '%PDF')
})
