import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import DateRangePicker from '../components/DateRangePicker'
import CustomSelect from '../components/CustomSelect'
import CheckboxSelect from '../components/CheckboxSelect'
import AuthImage from '../components/AuthImage'
import { LayoutDashboard, History, HeadphonesIcon, Settings, Car, Grid3X3, ShieldAlert, Search, ChevronDown, ChevronLeft, ChevronRight, Eye, FileText, FileSpreadsheet, RotateCcw, CameraOff } from 'lucide-react'

import bgTotalToday from '../assets/total_today.png'
import bgActiveGate from '../assets/active_gate_today.png'
import bgTodayDenied from '../assets/today_denied_accses.png'
import bgTotalTodayLight from '../assets/total today (1).png'
import bgActiveGateLight from '../assets/active_gate_today(1).png'
import bgTodayDeniedLight from '../assets/today_denied_accses(1).png'
import iconTotToday from '../assets/icontottoday.svg'
import activeGateIcon from '../assets/activegateicon.svg'
import deniedIcon from '../assets/deniedicon.svg'
import iconTotTodayLight from '../assets/icontottoday(1).svg'
import activeGateIconLight from '../assets/activegateicon(1).svg'
import deniedIconLight from '../assets/deniedicon(1).svg'
import { getDashboardSummary, getLogs, getGates, exportLogs } from '../services/api'
import { evidencePhotoUrl } from '../utils/evidence'
import { buildGateTiles } from '../utils/gates'

const PAGE_SIZE = 4
// Fetch server rows in bigger chunks so client-side filtering (empty plates,
// auto/operator split) can backfill a full page instead of leaving gaps.
const CHUNK_SIZE = 20

const defaultStats = {
  totalHariIni: 0,
  ditolakHariIni: 0,
  gateAktif: 0,
  gateTotal: 0
}

const gateApiCode = (label) => String(label || '').replace(/\s+/g, '-').toUpperCase()

const formatLogTime = (value) => {
  if (!value) return '—'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleTimeString('en-GB', { hour12: false })
}

const formatLogDate = (value) => {
  if (!value) return '—'
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? String(value).slice(0, 10) : parsed.toISOString().slice(0, 10)
}

const mapAccessStatus = (item) => {
  const value = String(item.access_status ?? item.verification_status ?? item.status ?? '').toLowerCase()
  if (value === 'denied' || value === 'violation' || value === 'unreadable') return 'DENIED'
  if (value === 'pending') return 'PENDING'
  const isOverride = item.command?.source === 'manual' || Boolean(item.operator_id || item.operator_name || item.command?.operator_id)
  return isOverride ? 'OPERATOR OVERRIDE' : 'AUTO AUTHORIZED'
}

// /logs returns one event per row; its direction decides whether it fills
// the Entry columns or the Exit columns (unknown counts as entry-side).
const mapLogItem = (item) => {
  const isExit = item.direction === 'exit'
  const status = mapAccessStatus(item)
  const rfidVerified = item.verification_status === 'verified'
  const gate = String(item.gate_code ?? item.gate ?? '').replace(/-/g, ' ').toUpperCase() || '—'
  const photo = evidencePhotoUrl(item)
  const time = formatLogTime(item.captured_at ?? item.occurred_at ?? item.created_at ?? item.passed_at)
  return {
    id: item.event_id ?? item.id ?? item.observation?.event_id,
    plate: item.plate_number ?? item.plate ?? item.observation?.normalized_license_plate ?? item.observation?.raw_ocr_text ?? null,
    alternativeNumber: item.alternative_number ?? item.alt_plate ?? null,
    gateMasuk: isExit ? '—' : gate,
    fotoMasuk: isExit ? null : photo,
    waktuMasuk: isExit ? '—' : time,
    statusMasuk: isExit ? null : status,
    gateKeluar: isExit ? gate : '—',
    fotoKeluar: isExit ? photo : null,
    waktuKeluar: isExit ? time : '—',
    statusKeluar: isExit ? status : null,
    date: formatLogDate(item.captured_at ?? item.occurred_at ?? item.created_at ?? item.date),
    rfidStatus: rfidVerified ? 'VERIFIED' : 'NO RFID',
    rfidOk: rfidVerified,
  }
}

function LogNumberBadge({ value, status, theme, alternative = false }) {
  return (
    <span className={`inline-flex h-[22px] items-center justify-center align-middle whitespace-nowrap rounded-sm border px-1.5 text-[12px] font-normal leading-none 2xl:h-[25px] 2xl:text-[15px] ${alternative ? 'min-w-[72px] 2xl:min-w-[82px]' : 'min-w-[58px] 2xl:min-w-[65px]'} ${
      theme === 'light'
        ? 'border-[#AECBFA] bg-[#E8F0FE] text-[#1A73E8]'
        : status === 'AUTO AUTHORIZED'
          ? 'border-[#444841] bg-[#24292C] text-[#2EAFF9]'
          : status === 'OPERATOR OVERRIDE'
            ? 'border-[#444841] bg-transparent text-[#FFB662]'
            : 'border-[#444841] bg-transparent text-[#DFE2EB]'
    }`}>
      {value || '-'}
    </span>
  )
}

function StatusBadge({ status, theme }) {
  if (!status) return <span className="text-slate-500">—</span>
  return (
    <span
      className={`inline-flex items-center text-[8.5px] 2xl:text-[10px] font-black tracking-widest px-2 py-0.5 uppercase ${
        status === 'DENIED'
          ? (theme === 'light'
              ? 'bg-[#FF1B001A] text-[#EF4444] border-l-[4px] border-[#EF4444]'
              : 'bg-[#FFB4AB1A] text-[#FFB4AB] border-l-[4px] border-[#FFB4AB]')
          : status === 'PENDING'
            ? (theme === 'light'
                ? 'bg-[#FEF3C7] text-[#B45309] border-l-[4px] border-[#F59E0B]'
                : 'bg-[#FFA7411A] text-[#FFA741] border-l-[4px] border-[#FFA741]')
            : status === 'OPERATOR OVERRIDE'
              ? (theme === 'light'
                  ? 'bg-[#FFF4DF] text-[#9A5700] border-l-[4px] border-[#F59E0B]'
                  : 'bg-[#352A1B] text-[#FFB662] border-l-[4px] border-[#F59E0B]')
              : (theme === 'light'
                  ? 'bg-[#E6F4EA] text-[#137333] border-l-[4px] border-[#34A853]'
                  : 'bg-[#BCCBB11A] text-[#2EAFF9] border-l-[4px] border-[#2EAFF9]')
      }`}
    >
      {status}
    </span>
  )
}

// Keeps the last fetched view so navigating back renders instantly
// instead of flashing the loading/empty states on every remount.
const activityLogsCache = { token: null, summary: null, logs: null, totalItems: 0, view: null }

export default function ActivityLogs({ onNavigate, theme, onToggleTheme, onLogout, accessToken }) {
  const cached = activityLogsCache.token === accessToken ? activityLogsCache : null
  const cachedView = cached?.view

  const [currentPage, setCurrentPage] = useState(() => cachedView?.currentPage ?? 1)
  const [searchQuery, setSearchQuery] = useState(() => cachedView?.searchQuery ?? '')
  const [summary, setSummary] = useState(() => cached?.summary ?? null)

  const stats = {
    totalHariIni: summary?.total_today ?? defaultStats.totalHariIni,
    ditolakHariIni: summary?.denied_today ?? defaultStats.ditolakHariIni,
    gateAktif: summary?.active_gates ?? defaultStats.gateAktif,
    gateTotal: summary?.total_gates ?? defaultStats.gateTotal,
  }

  useEffect(() => {
    if (!accessToken) return undefined
    let cancelled = false
    activityLogsCache.token = accessToken
    const load = async () => {
      try {
        const [summaryResult, gatesResult] = await Promise.allSettled([
          getDashboardSummary(accessToken),
          getGates(accessToken),
        ])
        if (cancelled) return
        const data = summaryResult.status === 'fulfilled' ? summaryResult.value : null
        if (!data) return
        // "Active" means the camera is actually stream-ready — the same rules
        // the dashboard tiles use — not merely an online gate agent.
        if (gatesResult.status === 'fulfilled' && Array.isArray(gatesResult.value)) {
          data.active_gates = buildGateTiles(gatesResult.value).filter((tile) => !tile.camera.offline).length
          data.total_gates = gatesResult.value.length
        }
        activityLogsCache.summary = data
        setSummary(data)
      } catch {
        // Keep last known values when the API is unreachable
      }
    }
    load()
    const interval = setInterval(load, 30000)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [accessToken])

  // Draft (pending) filter state
  const [pendingDateRange, setPendingDateRange] = useState(() => cachedView?.dateRange ?? { startDate: null, endDate: null })
  const [pendingVehicleType, setPendingVehicleType] = useState(() => cachedView?.vehicleType ?? 'all')
  const [pendingGateSelection, setPendingGateSelection] = useState(() => cachedView?.gateSelection ?? [])
  const [pendingRfidStatus, setPendingRfidStatus] = useState(() => cachedView?.rfidStatus ?? 'all')

  // Applied state - used to actually filter the table
  const [dateRange, setDateRange] = useState(() => cachedView?.dateRange ?? { startDate: null, endDate: null })
  const [vehicleType, setVehicleType] = useState(() => cachedView?.vehicleType ?? 'all')
  const [gateSelection, setGateSelection] = useState(() => cachedView?.gateSelection ?? [])
  const [rfidStatus, setRfidStatus] = useState(() => cachedView?.rfidStatus ?? 'all')

  const [logs, setLogs] = useState(() => cached?.logs ?? [])
  const [totalItems, setTotalItems] = useState(() => cached?.totalItems ?? 0)
  const [logsLoading, setLogsLoading] = useState(() => cached?.logs == null)
  const [exportError, setExportError] = useState(null)
  const [debouncedQuery, setDebouncedQuery] = useState(() => cachedView?.debouncedQuery ?? '')
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const visibleLogs = logs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const dayBoundaryIso = (d, endOfDay) => {
    if (!d) return undefined
    return endOfDay
      ? new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999).toISOString()
      : new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0).toISOString()
  }

  const buildLogParams = () => ({
    search: debouncedQuery || undefined,
    gate_code: gateSelection.length === 1 ? gateApiCode(gateSelection[0]) : undefined,
    vehicle_type: vehicleType !== 'all' ? vehicleType : undefined,
    access_status: rfidStatus === 'all' ? undefined : (rfidStatus === 'auto_authorized' || rfidStatus === 'operator_override' ? 'allowed' : rfidStatus),
    start_date: dayBoundaryIso(dateRange.startDate, false),
    end_date: dayBoundaryIso(dateRange.endDate || dateRange.startDate, true),
  })

  useEffect(() => {
    if (!accessToken) return undefined
    let cancelled = false
    activityLogsCache.view = {
      currentPage, searchQuery, debouncedQuery, dateRange, vehicleType, gateSelection, rfidStatus,
    }
    // Single-flight loader: realtime bursts (e.g. the SSE backlog replayed on
    // connect) queue one follow-up refresh instead of spawning a request per event.
    let inFlight = false
    let queued = false

    const load = async () => {
      if (inFlight) {
        queued = true
        return
      }
      inFlight = true
      try {
        setLogsLoading(true)
        // Accumulate filtered rows until the current page is full so hidden
        // rows (no plate / excluded status) don't leave empty slots.
        const needed = currentPage * PAGE_SIZE
        const visible = []
        let serverPage = 1
        let total = null
        for (;;) {
          const { items, pagination } = await getLogs(accessToken, {
            ...buildLogParams(),
            page: serverPage,
            limit: CHUNK_SIZE,
          })
          if (cancelled) return
          const rows = items ?? []
          total = pagination?.total ?? total
          let mapped = rows.map(mapLogItem).filter((row) => row.plate)
          // The API groups both allowed variants under access_status=allowed;
          // the auto/operator split can only be applied client-side.
          if (rfidStatus === 'auto_authorized' || rfidStatus === 'operator_override') {
            const wanted = rfidStatus === 'auto_authorized' ? 'AUTO AUTHORIZED' : 'OPERATOR OVERRIDE'
            mapped = mapped.filter((row) => row.statusMasuk === wanted || row.statusKeluar === wanted)
          }
          visible.push(...mapped)
          if (rows.length < CHUNK_SIZE || visible.length >= needed) break
          serverPage += 1
        }
        activityLogsCache.logs = visible
        activityLogsCache.totalItems = total ?? visible.length
        setLogs(visible)
        setTotalItems(activityLogsCache.totalItems)
      } catch {
        // Keep showing the last known rows when the API is unreachable
      } finally {
        if (!cancelled) setLogsLoading(false)
        inFlight = false
        if (queued && !cancelled) {
          queued = false
          load()
        }
      }
    }
    load()
    window.addEventListener('asentrim-realtime', load)
    return () => {
      cancelled = true
      window.removeEventListener('asentrim-realtime', load)
    }
  }, [accessToken, currentPage, debouncedQuery, dateRange, vehicleType, gateSelection, rfidStatus])

  const handleExport = async (format) => {
    setExportError(null)
    try {
      const { blob, filename } = await exportLogs(accessToken, format, {
        ...buildLogParams(),
        page: undefined,
        limit: undefined,
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      setExportError(err.message)
      setTimeout(() => setExportError(null), 5000)
    }
  }

  const handleApplyFilters = () => {
    setDateRange(pendingDateRange)
    setVehicleType(pendingVehicleType)
    setGateSelection(pendingGateSelection)
    setRfidStatus(pendingRfidStatus)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    const emptyRange = { startDate: null, endDate: null }
    setPendingDateRange(emptyRange)
    setDateRange(emptyRange)
    setPendingVehicleType('all')
    setVehicleType('all')
    setPendingGateSelection([])
    setGateSelection([])
    setPendingRfidStatus('all')
    setRfidStatus('all')
    setSearchQuery('')
    setDebouncedQuery('')
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[#121416] text-white flex flex-col font-display h-screen overflow-hidden">
      {/* Header */}
      <Header activePage="activitylogs" onNavigate={onNavigate} theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout} />

      {/* Page Content */}
      <div className="flex-1 px-3 py-3 sm:px-4 sm:py-4 2xl:px-6 2xl:py-5 flex flex-col gap-2 sm:gap-3 min-h-0 overflow-y-auto lg:overflow-hidden no-scrollbar">

        {/* Page Title Row */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 2xl:gap-3 shrink-0">
          <div>
            <div className="text-[9px] 2xl:text-[11px] font-black tracking-[0.2em] text-[#2EAFF9] uppercase mb-1">
              OPERATIONAL GATE SERVICE
            </div>
            <h2 className="text-lg 2xl:text-[24px] font-bold text-white tracking-wide">
              Activity Logs & Reports
            </h2>
          </div>
          <div className="flex items-center gap-2 2xl:gap-4">
            <button 
              onClick={() => handleExport('pdf')}
              className={`flex items-center gap-1.5 2xl:gap-2.5 text-[9px] 2xl:text-[12px] font-black px-3 py-2 2xl:px-5 2xl:py-3 rounded tracking-widest uppercase transition-colors ${theme === 'light' ? 'bg-[#0C5F9A] hover:bg-[#094d7d] text-[#FAFAFA]' : 'bg-[#2EAFF9] hover:bg-[#1f9beb] text-[#0a0d14]'}`}
            >
              <FileText className="w-3 h-3 2xl:w-4 2xl:h-4" strokeWidth={2.5} />
              Print PDF
            </button>
            <button 
              onClick={() => handleExport('xlsx')}
              className={`flex items-center gap-1.5 2xl:gap-2.5 text-[9px] 2xl:text-[12px] font-black px-3 py-2 2xl:px-5 2xl:py-3 rounded tracking-widest uppercase transition-colors ${theme === 'light' ? 'bg-[#0C5F9A] hover:bg-[#094d7d] text-[#FAFAFA]' : 'bg-[#2EAFF9] hover:bg-[#1f9beb] text-[#0a0d14]'}`}
            >
              <FileSpreadsheet className="w-3 h-3 2xl:w-4 2xl:h-4" strokeWidth={2.5} />
              Print Excel
            </button>
          </div>
        </div>
        {exportError && (
          <p className="text-[10px] text-red-400 shrink-0 -mt-1">{exportError}</p>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 shrink-0">
          {/* Total Today */}
          <div className={`border bg-[length:100%_100%] bg-no-repeat p-3 2xl:p-4 flex flex-col justify-between min-h-[86px] 2xl:min-h-[110px] ${theme === 'light' ? 'bg-[#FAFAFA] border-[#D8D8D8]' : 'bg-[#0F1115] border-[#444841]'}`} style={{ backgroundImage: `url("${theme === 'light' ? bgTotalTodayLight : bgTotalToday}")` }}>
            <div className="flex justify-between items-start">
              <img src={theme === 'light' ? iconTotTodayLight : iconTotToday} alt="Total Today" className="w-5 h-5 2xl:w-8 2xl:h-8 object-contain" />
              <div className={`text-[8px] 2xl:text-[11px] font-bold tracking-widest uppercase mt-0.5 2xl:mt-1 ${theme === 'light' ? 'text-slate-800' : 'text-slate-300'}`}>
                TOTAL TODAY
              </div>
            </div>
            <div className="mt-3 2xl:mt-5">
              <div className={`text-3xl sm:text-4xl 2xl:text-5xl font-black leading-none tracking-tight ${theme === 'light' ? 'text-[#00A300]' : 'text-white'}`}>
                {stats.totalHariIni.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Active Gates */}
          <div className={`border bg-[length:100%_100%] bg-no-repeat p-3 2xl:p-4 flex flex-col justify-between min-h-[86px] 2xl:min-h-[110px] ${theme === 'light' ? 'bg-[#FAFAFA] border-[#D8D8D8]' : 'bg-[#0F1115] border-[#444841]'}`} style={{ backgroundImage: `url("${theme === 'light' ? bgActiveGateLight : bgActiveGate}")` }}>
            <div className="flex justify-between items-start">
              <img src={theme === 'light' ? activeGateIconLight : activeGateIcon} alt="Active Gates" className="w-5 h-5 2xl:w-8 2xl:h-8 object-contain" />
              <div className={`text-[8px] 2xl:text-[11px] font-bold tracking-widest uppercase mt-0.5 2xl:mt-1 ${theme === 'light' ? 'text-slate-800' : 'text-slate-300'}`}>
                ACTIVE GATES TODAY
              </div>
            </div>
            <div className="mt-3 2xl:mt-5">
              <div className="flex items-baseline gap-1.5 2xl:gap-2">
                <span className={`text-3xl sm:text-4xl 2xl:text-5xl font-black leading-none tracking-tight ${theme === 'light' ? 'text-[#0C5F9A]' : 'text-white'}`}>
                  {String(stats.gateAktif).padStart(2, '0')}
                </span>
                <span className={`text-sm 2xl:text-xl font-bold tracking-wide ${theme === 'light' ? 'text-slate-800' : 'text-slate-400'}`}>
                  / {String(stats.gateTotal || 1).padStart(2, '0')}
                </span>
              </div>
              <div className={`text-[7px] 2xl:text-[10px] font-bold tracking-wider uppercase mt-1.5 2xl:mt-2 ${theme === 'light' ? 'text-slate-800' : 'text-slate-400'}`}>
                {stats.gateTotal === 0
                  ? 'SYSTEMS UNKNOWN: NO GATES CONFIGURED'
                  : stats.gateAktif >= stats.gateTotal
                    ? 'SYSTEMS OPTIMAL: ALL GATES ACTIVE'
                    : `SYSTEMS DEGRADED: ${stats.gateTotal - stats.gateAktif} GATE${stats.gateTotal - stats.gateAktif === 1 ? '' : 'S'} OFFLINE`}
              </div>
            </div>
          </div>

          {/* Today Denied */}
          <div className={`border bg-[length:100%_100%] bg-no-repeat p-3 2xl:p-4 flex flex-col justify-between min-h-[86px] 2xl:min-h-[110px] ${theme === 'light' ? 'bg-[#FAFAFA] border-[#D8D8D8]' : 'bg-[#0F1115] border-[#444841]'}`} style={{ backgroundImage: `url("${theme === 'light' ? bgTodayDeniedLight : bgTodayDenied}")` }}>
            <div className="flex justify-between items-start">
              <img src={theme === 'light' ? deniedIconLight : deniedIcon} alt="Today Denied" className="w-5 h-5 2xl:w-8 2xl:h-8 object-contain" />
              <div className={`text-[8px] 2xl:text-[11px] font-bold tracking-widest uppercase mt-0.5 2xl:mt-1 ${theme === 'light' ? 'text-slate-800' : 'text-slate-300'}`}>
                TODAY DENIED ACCESS
              </div>
            </div>
            <div className="mt-3 2xl:mt-5">
              <div className={`text-3xl sm:text-4xl 2xl:text-5xl font-black leading-none tracking-tight ${theme === 'light' ? 'text-[#E53E3E]' : 'text-[#FFB4AB]'}`}>
                {String(stats.ditolakHariIni).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col xl:flex-row gap-2 sm:gap-3 items-start xl:items-end justify-between shrink-0">
          <div className="border border-[#444841] bg-[#1C2026] p-3 2xl:p-4 w-full xl:w-fit">
            <div className="flex flex-wrap gap-3 2xl:gap-4 items-end">
              {/* Date Range */}
              <div className="flex flex-col gap-1 z-50">
                <label className="text-[8px] 2xl:text-[11px] font-black tracking-[0.15em] text-[#C5C8BE] uppercase">DATE RANGE</label>
                <div>
                  <DateRangePicker theme={theme} value={pendingDateRange} onChange={setPendingDateRange} />
                </div>
              </div>
              {/* Vehicle Type */}
              <div className="flex flex-col gap-1 z-40">
                <label className="text-[8px] 2xl:text-[11px] font-black tracking-[0.15em] text-[#C5C8BE] uppercase">VEHICLE TYPE</label>
                <div>
                  <CustomSelect 
                    theme={theme}
                    options={[
                      { value: 'all', label: 'All Vehicles' },
                      { value: 'SUV', label: 'SUV' },
                      { value: 'MINIBUS', label: 'Minibus' },
                      { value: 'MOTORCYCLE', label: 'Motorcycle' },
                      { value: 'TRUCK', label: 'Truck' }
                    ]}
                    value={pendingVehicleType}
                    onChange={setPendingVehicleType}
                    placeholder="Select Vehicle"
                    widthClass="w-48"
                  />
                </div>
              </div>
              {/* Gate Selection */}
              <div className="flex flex-col gap-1 z-30">
                <label className="text-[8px] 2xl:text-[11px] font-black tracking-[0.15em] text-[#C5C8BE] uppercase">GATE SELECTION</label>
                <div>
                  <CheckboxSelect 
                    theme={theme}
                    options={[
                      { value: 'GATE 01', label: 'Gate 01' },
                      { value: 'GATE 02', label: 'Gate 02' },
                      { value: 'GATE 03', label: 'Gate 03' },
                      { value: 'GATE 04', label: 'Gate 04' },
                      { value: 'GATE 05', label: 'Gate 05' }
                    ]}
                    selectedValues={pendingGateSelection}
                    onChange={(next) => setPendingGateSelection(next.slice(-1))}
                    placeholder="Select Gate"
                    widthClass="w-48"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col gap-1 z-20">
                <label className="text-[8px] 2xl:text-[11px] font-black tracking-[0.15em] text-[#C5C8BE] uppercase">STATUS</label>
                <div>
                  <CustomSelect 
                    theme={theme}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'auto_authorized', label: 'Auto Authorized' },
                      { value: 'operator_override', label: 'Operator Override' }
                    ]}
                    value={pendingRfidStatus}
                    onChange={setPendingRfidStatus}
                    placeholder="Select Status"
                    widthClass="w-40"
                  />
                </div>
              </div>
              {/* Apply Filters */}
              <div className="flex items-center gap-2 2xl:gap-3 2xl:ml-4">
                <button 
                  onClick={handleApplyFilters}
                  className={`border border-[#444841] hover:border-[#2EAFF9] text-[10px] 2xl:text-[12px] font-black px-4 py-2 2xl:px-6 2xl:py-3 tracking-widest uppercase transition-colors ${theme === 'light' ? 'bg-[#0C5F9A]' : 'bg-[#32353A]'}`}
                  style={{ color: theme === 'light' ? '#DFE2EB' : '#cbd5e1' }}
                >
                  APPLY FILTERS
                </button>
                <button 
                  onClick={handleResetFilters}
                  className={`flex items-center justify-center px-3 py-2 2xl:px-4 2xl:py-3 border transition-colors ${theme === 'light' ? 'bg-[#313131] border-[#A9A9A9] hover:opacity-90' : 'bg-[#4A4E42] border-[#4A4E42] hover:text-white'}`}
                  style={{ color: theme === 'light' ? '#A9A9A9' : '#cbd5e1' }}
                >
                  <RotateCcw className="w-3.5 h-3.5 2xl:w-5 2xl:h-5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-auto">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder="Search plate, alternative number, driver, RFID..."
              className={`text-slate-300 text-[11px] 2xl:text-[14px] pl-3 pr-9 py-2 2xl:pl-4 2xl:pr-12 2xl:py-3 w-full lg:w-80 2xl:w-96 outline-none placeholder-slate-300 tracking-wider transition-colors ${theme === 'light' ? 'bg-[#FAFAFA] border border-[#D8D8D8] focus:border-[#D8D8D8]' : 'bg-[#1C2026] border border-[#444841] focus:border-[#2EAFF9]'}`}
            />
            <Search className={`absolute right-3 2xl:right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 2xl:w-5 2xl:h-5 pointer-events-none transition-colors ${theme === 'light' ? 'text-[#8A8F98]' : 'text-slate-400'}`} strokeWidth={1.5} />
          </div>
        </div>

        {/* Table & Pagination Container */}
        <div className={`border flex flex-col min-h-0 overflow-hidden flex-1 ${theme === 'light' ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
          <div className="flex-1 min-h-0 overflow-auto">
            <table className="w-full h-full table-auto text-center [&_th]:align-middle [&_td]:align-middle">
              <thead className={`z-10 sticky top-0 ${theme === 'light' ? 'bg-[#F3F4F6]' : 'bg-[#262A31]'}`}>

                <tr style={{ borderBottom: theme === 'light' ? '1.17px solid #D8D8D8' : '1.17px solid #444841' }}>
                  <th scope="col" className={`min-w-[96px] px-3 py-2.5 text-[9px] font-bold tracking-wide whitespace-nowrap 2xl:min-w-[118px] 2xl:px-3.5 2xl:text-[11px] ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Plate Number</th>
                  <th scope="col" className={`min-w-[96px] px-3 py-2.5 text-[9px] font-bold leading-[13px] tracking-wide 2xl:min-w-[118px] 2xl:px-3.5 2xl:text-[11px] 2xl:leading-[15px] ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Alternative<br />Number</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Entry Gate</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase text-center whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Entry Photo</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Entry Time</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase text-center whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Entry Status</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Exit Gate</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase text-center whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Exit Photo</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Exit Time</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase text-center whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Exit Status</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Date</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>RFID Status</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase text-center whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Actions</th>
                </tr>

              </thead>
              <tbody>
                {visibleLogs.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-8 text-center text-slate-500">
                      {logsLoading ? 'LOADING ACTIVITY LOGS...' : 'No activity logs match the current filters.'}
                    </td>
                  </tr>
                ) : (
                  visibleLogs.map((row, idx) => (
                    <tr key={row.id || idx} style={{ height: `${100 / PAGE_SIZE}%` }} className={`border-b border-[#444841]/60 transition-colors ${theme === 'light' ? (idx % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-[#F7F8FC]') : 'hover:bg-white/[0.02]'}`}>
                      {/* Plate Number */}
                      <td className="align-middle px-3 py-1.5 whitespace-nowrap 2xl:px-3.5 2xl:py-2">
                        {row.plate && <LogNumberBadge value={row.plate} status={row.statusMasuk ?? row.statusKeluar} theme={theme} />}
                      </td>
                      {/* Alternative Number */}
                      <td className="align-middle px-3 py-1.5 whitespace-nowrap 2xl:px-3.5 2xl:py-2">
                        <LogNumberBadge value={row.alternativeNumber} status={row.statusMasuk ?? row.statusKeluar} theme={theme} alternative />
                      </td>
                      {/* Entry Gate */}
                      <td className="align-middle px-2 py-1.5 2xl:px-3 2xl:py-2 text-[10px] 2xl:text-[12px] font-bold tracking-wider whitespace-nowrap" style={{ color: theme === 'light' ? '#475569' : '#C5C8BE' }}>{row.gateMasuk}</td>
                      {/* Entry Photo */}
                      <td className="align-middle px-2 py-1.5 2xl:px-3 2xl:py-2">
                        <div className="flex justify-center">
                          <div className="w-7 h-7 2xl:w-8 2xl:h-8 border border-[#444841] rounded-sm overflow-hidden flex items-center justify-center bg-[#1C2026]">
                            <AuthImage src={row.fotoMasuk} token={accessToken} alt="Entry photo" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </td>

                      {/* Entry Time */}
                      <td className="align-middle px-2 py-1.5 2xl:px-3 2xl:py-2 text-[10px] 2xl:text-[12px] text-slate-400 font-medium tracking-wide whitespace-nowrap">{row.waktuMasuk}</td>
                      {/* Entry Status */}
                      <td className="align-middle px-2 py-1.5 2xl:px-3 2xl:py-2 text-center whitespace-nowrap">
                        <div className="flex justify-center"><StatusBadge status={row.statusMasuk} theme={theme} /></div>
                      </td>
                      {/* Exit Gate */}
                      <td className="align-middle px-2 py-1.5 2xl:px-3 2xl:py-2 text-[10px] 2xl:text-[12px] font-bold tracking-wider whitespace-nowrap" style={{ color: theme === 'light' ? '#475569' : '#C5C8BE' }}>{row.gateKeluar}</td>

                      {/* Exit Photo */}
                      <td className="align-middle px-2 py-1.5 2xl:px-3 2xl:py-2">
                        <div className="flex justify-center">
                          <div className="w-7 h-7 2xl:w-8 2xl:h-8 border border-[#444841] rounded-sm overflow-hidden flex items-center justify-center bg-[#1C2026]">
                            <AuthImage src={row.fotoKeluar} token={accessToken} alt="Exit photo" className="w-full h-full object-cover" />
                          </div>
                        </div>
                      </td>

                      {/* Exit Time */}
                      <td className="align-middle px-2 py-1.5 2xl:px-3 2xl:py-2 text-[10px] 2xl:text-[12px] text-slate-400 font-medium tracking-wide whitespace-nowrap">{row.waktuKeluar}</td>
                      {/* Exit Status */}
                      <td className="align-middle px-2 py-1.5 2xl:px-3 2xl:py-2 text-center whitespace-nowrap">
                        <div className="flex justify-center"><StatusBadge status={row.statusKeluar} theme={theme} /></div>
                      </td>
                      {/* Date */}
                      <td className="align-middle px-2 py-1.5 2xl:px-3 2xl:py-2 text-[10px] 2xl:text-[12px] text-slate-400 font-medium tracking-wide whitespace-nowrap">{row.date}</td>
                      {/* RFID Status */}
                      <td className="align-middle px-2 py-1.5 2xl:px-3 2xl:py-2 whitespace-nowrap">
                        <span 
                          className="inline-flex items-center justify-center align-middle px-2 py-0.5 text-[9px] 2xl:text-[10px] font-bold tracking-wider uppercase rounded-sm"
                          style={{
                            backgroundColor: row.rfidOk 
                              ? (theme === 'light' ? '#DEF7EC' : '#2EAFF91A') 
                              : (theme === 'light' ? '#F7DEDE' : '#FFB4AB1A'),
                            borderColor: row.rfidOk 
                              ? (theme === 'light' ? '#31C48D' : '#2EAFF9') 
                              : (theme === 'light' ? '#EF4444' : '#FFB4AB'),
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            color: row.rfidOk 
                              ? (theme === 'light' ? '#03543F' : '#2EAFF9') 
                              : (theme === 'light' ? '#EF4444' : '#FFB4AB')
                          }}
                        >
                          {row.rfidStatus}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="align-middle px-2 py-1.5 2xl:px-3 2xl:py-2">
                        <div className="flex justify-center">
                          <button
                            onClick={() => onNavigate && onNavigate('detaillog', row)}
                            className="inline-flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors p-1"
                          >
                            <Eye className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {/* Absorbs leftover table height so data rows keep their normal height and stay top-aligned */}
                {visibleLogs.length > 0 && (
                  <tr aria-hidden="true"><td colSpan={13} className="h-full p-0" /></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 2xl:px-6 2xl:py-3 border-t border-[#444841] bg-[#1C2026] shrink-0">
            <div className="text-[9px] 2xl:text-[12px] font-bold tracking-widest text-slate-500 uppercase">
              SHOWING {visibleLogs.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0} TO {(currentPage - 1) * PAGE_SIZE + visibleLogs.length} OF {totalItems} LOGS
            </div>

            <div className="flex items-center gap-1 2xl:gap-2">
              <button 
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className="w-7 h-7 2xl:w-10 2xl:h-10 flex items-center justify-center text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-3 h-3 2xl:w-5 2xl:h-5" />
              </button>
              
              {(() => {
                const maxButtons = 5
                let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
                let endPage = Math.min(totalPages, startPage + maxButtons - 1)
                if (endPage - startPage + 1 < maxButtons) {
                  startPage = Math.max(1, endPage - maxButtons + 1)
                }
                const pageNumbers = []
                for (let i = startPage; i <= endPage; i++) {
                  pageNumbers.push(i)
                }

                return pageNumbers.map((pageNum) => {
                  const isActive = pageNum === currentPage
                  return (
                    <button 
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-7 h-7 2xl:w-10 2xl:h-10 flex items-center justify-center text-[10px] 2xl:text-[14px] font-black rounded-sm transition-colors ${
                        isActive 
                          ? (theme === 'light' ? 'bg-[#0C5F9A] text-[#FAFAFA]' : 'bg-[#2EAFF9] text-[#0a0d14]') 
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })
              })()}


              <button 
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                className="w-7 h-7 2xl:w-10 2xl:h-10 flex items-center justify-center text-slate-500 hover:text-slate-300 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-3 h-3 2xl:w-5 2xl:h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
