import assert from 'node:assert/strict'
import { test } from 'node:test'
import { hasReportRange, normalizeReportRange, reportRangeParams } from '../src/utils/reportDate.js'

test('exports need a selected date and cached selections are normalized', () => {
  const day = new Date(2026, 10, 4)
  assert.equal(hasReportRange({ startDate: null, endDate: null }), false)
  assert.equal(hasReportRange({ startDate: new Date('invalid') }), false)
  assert.equal(hasReportRange({ startDate: day, endDate: new Date(2026, 10, 5) }), true)
  assert.deepEqual(normalizeReportRange({ startDate: null, endDate: null }), { startDate: null, endDate: null })
  assert.deepEqual(normalizeReportRange({ startDate: day }), { startDate: day, endDate: day })
  // A reversed pair is reordered instead of producing an inverted range.
  assert.deepEqual(normalizeReportRange({ startDate: new Date(2026, 10, 5), endDate: day }), { startDate: day, endDate: new Date(2026, 10, 5) })
})

test('list and export span inclusive Jakarta calendar days independent of browser timezone', () => {
  assert.deepEqual(reportRangeParams({ startDate: new Date(2026, 10, 4) }), {
    start_date: '2026-11-04T00:00:00+07:00',
    end_date: '2026-11-04T23:59:59.999999+07:00',
  })
  assert.deepEqual(reportRangeParams({ startDate: new Date(2026, 10, 1), endDate: new Date(2026, 10, 4) }), {
    start_date: '2026-11-01T00:00:00+07:00',
    end_date: '2026-11-04T23:59:59.999999+07:00',
  })
  assert.deepEqual(reportRangeParams({ startDate: null, endDate: null }), {})
})
