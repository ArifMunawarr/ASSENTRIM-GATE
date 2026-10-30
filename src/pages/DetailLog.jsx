import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { Car, Shield, FileEdit, History, ChevronRight, CameraOff, Pencil, Check, X, ArrowLeft } from 'lucide-react'

import { getLogDetail, updateLogNotes } from '../services/api'
import { evidencePhotoUrl } from '../utils/evidence'
import AuthImage from '../components/AuthImage'

const formatDetailTime = (value) => {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return String(value)
  return `${parsed.toISOString().slice(0, 10)} ${parsed.toLocaleTimeString('en-GB', { hour12: false })}`
}

const formatDuration = (seconds) => {
  const total = Number(seconds)
  if (!Number.isFinite(total) || total < 0) return null
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  if (hours === 0) return `${minutes} minutes`
  return `${hours} hours ${minutes} minutes`
}

const durationBetween = (start, end) => {
  const a = new Date(start).getTime()
  const b = new Date(end).getTime()
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return null
  return formatDuration((b - a) / 1000)
}

const normGate = (value) => String(value || '').replace(/-/g, ' ').toUpperCase() || '—'

const mapAccessStatus = (raw) => {
  const value = String(raw || '').toLowerCase()
  if (value === 'denied' || value === 'violation' || value === 'unreadable') return 'DENIED'
  if (value === 'pending') return 'PENDING'
  return 'AUTHORIZED'
}

const mapHistoryItem = (item) => ({
  waktu: item.waktu ?? formatDetailTime(item.occurred_at ?? item.time ?? item.created_at),
  gate: normGate(item.gate ?? item.gate_code ?? item.gate_label),
  status: String(item.status ?? item.access_status ?? '—').toUpperCase(),
})

// Keeps fetched details per event so reopening a log renders instantly.
const detailCache = { token: null, byId: {} }

export default function DetailLog({ logData, onNavigate, theme, onToggleTheme, onLogout, accessToken }) {
  const isLight = theme === 'light'
  const [detail, setDetail] = useState(() => (
    detailCache.token === accessToken ? (detailCache.byId[logData?.id] ?? null) : null
  ))
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesDraft, setNotesDraft] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    if (!accessToken || !logData?.id) return
    let cancelled = false
    detailCache.token = accessToken
    getLogDetail(accessToken, logData.id)
      .then((data) => {
        if (cancelled) return
        detailCache.byId[logData.id] = data
        setDetail(data)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [accessToken, logData?.id])

  const entryTime = detail?.entry_time ?? detail?.entered_at ?? detail?.occurred_at ?? null
  const exitTime = detail?.exit_time ?? detail?.exited_at ?? null

  const data = {
    id: detail?.event_id ?? logData?.id ?? '—',
    status: mapAccessStatus(detail?.access_status ?? detail?.verification_status ?? logData?.status),
    plate: detail?.plate_number ?? logData?.plate ?? '—',
    type: String(detail?.vehicle_type ?? logData?.type ?? '—').toUpperCase(),
    color: detail?.color ?? '—',
    brand: detail?.brand ?? detail?.model ?? '—',
    year: detail?.year ?? '—',
    rfidTag: detail?.rfid_tag ?? '—',
    rfidStatus: detail?.rfid_status ?? logData?.rfidStatus ?? '—',
    rfidOk: detail?.rfid_ok ?? logData?.rfidOk ?? String(detail?.rfid_status ?? 'VERIFIED').toUpperCase() === 'VERIFIED',
    driver: detail?.driver_name ?? logData?.driver ?? 'Unknown',
    gateMasuk: normGate(detail?.entry_gate ?? detail?.entry_gate_code ?? detail?.gate_code ?? logData?.gateMasuk),
    gateKeluar: normGate(detail?.exit_gate ?? detail?.exit_gate_code ?? logData?.gateKeluar),
    waktuMasuk: entryTime ? formatDetailTime(entryTime) : (logData?.waktuMasuk && logData?.date ? `${logData.date} ${logData.waktuMasuk}` : logData?.waktuMasuk || '—'),
    waktuKeluar: exitTime ? formatDetailTime(exitTime) : (logData?.waktuKeluar && logData?.date ? `${logData.date} ${logData.waktuKeluar}` : logData?.waktuKeluar || '—'),
    durasi: formatDuration(detail?.duration_seconds ?? detail?.duration) ?? durationBetween(entryTime, exitTime) ?? '—',
    operator: detail?.operator_name ?? detail?.operator ?? '—',
    fotoMasuk: (detail?.direction === 'exit' ? null : evidencePhotoUrl(detail)) ?? logData?.fotoMasuk ?? null,
    fotoKeluar: (detail?.direction === 'exit' ? evidencePhotoUrl(detail) : null) ?? logData?.fotoKeluar ?? null,
    catatan: detail?.notes ?? detail?.operator_notes ?? 'No operator notes.',
    riwayat: (detail?.access_history ?? detail?.recent_events ?? logData?.riwayat ?? []).map(mapHistoryItem)
  }

  const handleSaveNotes = async () => {
    if (!accessToken || !logData?.id) return
    setSavingNotes(true)
    try {
      const updated = await updateLogNotes(accessToken, logData.id, notesDraft.trim())
      const merged = { ...(detailCache.byId[logData.id] || {}), notes: updated?.notes ?? notesDraft.trim() }
      detailCache.byId[logData.id] = merged
      setDetail((prev) => ({ ...(prev || merged), notes: merged.notes }))
      setEditingNotes(false)
    } catch {
      // Keep edit mode open so the operator can retry
    } finally {
      setSavingNotes(false)
    }
  }

  return (
    <div className={`detail-root min-h-screen flex flex-col font-display ${isLight ? 'bg-[#FAFAFA] text-[#1F2937]' : 'bg-[#0B1326] text-white'}`}>
      <style>{`
        /*
         * Keep the approved Full HD sizes (including the original calibration).
         * Desktop/laptop screens scale the same composition proportionally.
         * Global large-display zoom uses this same Full HD unit in index.css.
         */
        .detail-root {
          --detail-baseline-unit: min(calc(1920px / 1827.3), calc(1080px / 1032.38));
          --u: clamp(0.7px, min(calc(100vw / 1827.3), calc(100vh / 1082)), var(--detail-baseline-unit));
        }

        /*
         * Only narrow windows stack. Laptop viewports keep both vehicle photos
         * and the driver card on one row, as in the Full HD design.
         */
        @media (max-width: 1099px) {
          .detail-root { --u: 1px; }
        }

        /* ===== Page shell / title ===== */
        .dl-shell { padding: calc(15 * var(--u)) calc(20 * var(--u)); gap: calc(15 * var(--u)); }
        .dl-back { align-self: flex-start; gap: calc(7.5 * var(--u)); padding: calc(9 * var(--u)) calc(15 * var(--u)); font-size: calc(13 * var(--u)); border-width: 1px; border-radius: calc(4 * var(--u)); margin-bottom: calc(10 * var(--u)); }
        .dl-back-icon { width: calc(15 * var(--u)); height: calc(15 * var(--u)); }
        .dl-title-block { gap: calc(2.5 * var(--u)); }
        .dl-crumb { font-size: calc(11.5 * var(--u)); gap: calc(7.5 * var(--u)); }
        .dl-crumb-icon { width: calc(15 * var(--u)); height: calc(15 * var(--u)); }
        .dl-title { font-size: calc(23 * var(--u)); line-height: calc(35.5 * var(--u)); }
        .dl-logid { font-size: calc(15 * var(--u)); }

        /* ===== Top row: photo cards ===== */
        .dl-top-grid { gap: calc(15 * var(--u)); }
        .dl-photo-card { height: calc(223.5 * var(--u)); }
        .dl-cam-icon { width: calc(30.5 * var(--u)); height: calc(30.5 * var(--u)); }
        .dl-cam-text { font-size: calc(12.5 * var(--u)); }
        .dl-ov-tl { top: calc(10 * var(--u)); left: calc(10 * var(--u)); padding: calc(5 * var(--u)) calc(12.5 * var(--u)); }
        .dl-ov-br { bottom: calc(10 * var(--u)); right: calc(10 * var(--u)); padding: calc(5 * var(--u)) calc(15 * var(--u)); }
        .dl-ov-text { font-size: calc(11 * var(--u)); }

        /* ===== Bottom cards ===== */
        .dl-bottom-grid, .dl-col { gap: calc(15 * var(--u)); }
        .dl-card { padding: calc(15 * var(--u)); }
        .dl-card-head { gap: calc(10 * var(--u)); margin-bottom: calc(7.5 * var(--u)); }
        .dl-card-head--lg { margin-bottom: calc(10 * var(--u)); }
        .dl-card-icon { width: calc(20 * var(--u)); height: calc(20 * var(--u)); }
        .dl-card-title { font-size: calc(12.5 * var(--u)); }
        .dl-row { padding-top: calc(7.5 * var(--u)); padding-bottom: calc(7.5 * var(--u)); font-size: calc(12.5 * var(--u)); }
        .dl-badge { padding: calc(2.5 * var(--u)) calc(12.5 * var(--u)); font-size: calc(12 * var(--u)); }
        .dl-status-badge { padding: calc(2.5 * var(--u)) calc(12.5 * var(--u)); font-size: calc(11.5 * var(--u)); border-left-width: calc(5 * var(--u)); }
        .dl-note { padding: calc(12.5 * var(--u)); font-size: calc(12.5 * var(--u)); }

        /* ===== Riwayat table =====
         * Box height is locked to exactly the header row + 3 data rows, so the card keeps
         * the same size whether the list is empty, has 3 entries, or many (then it scrolls).
         * row = 7.5u padding-top + 7.5u padding-bottom + 18u line-height = 33u; 3 x 1px rules.
         */
        .dl-riwayat-box { height: calc(132 * var(--u) + 3px); }
        .dl-table { font-size: calc(12 * var(--u)); }
        .dl-th, .dl-td { padding: calc(7.5 * var(--u)) calc(10 * var(--u)); line-height: calc(18 * var(--u)); }
        .dl-td-empty { padding: calc(20 * var(--u)) calc(10 * var(--u)); line-height: calc(18 * var(--u)); }
      `}</style>
      {/* Header */}
      <Header activePage="activitylogs" onNavigate={onNavigate} theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout} />

      {/* Page Content */}
      <div className="dl-shell flex-1 flex flex-col">
        
        {/* Title & Breadcrumb Header */}
        <div className="dl-title-block flex flex-col shrink-0">
          <button
            onClick={() => onNavigate && onNavigate('activitylogs')}
            className={`dl-back inline-flex items-center font-bold tracking-widest uppercase transition-colors ${isLight ? 'border-[#D8D8D8] bg-white text-[#1F2937] hover:bg-[#F3F4F6]' : 'border-[#444841] bg-[#14161B] text-white hover:bg-[#1C2026]'}`}
          >
            <ArrowLeft className="dl-back-icon" />
            Back to Log
          </button>
          <div className="dl-crumb flex items-center font-black tracking-widest text-slate-400 uppercase">
            <button 
              onClick={() => onNavigate && onNavigate('activitylogs')} 
              className={`hover:text-[#2EAFF9] transition-colors ${isLight ? 'text-[#0C5F9A]' : 'text-slate-400'}`}
            >
              ACTIVITY LOGS & REPORTS
            </button>
            <ChevronRight className="dl-crumb-icon text-slate-500" />
            <span className={isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}>DETAIL LOG</span>
          </div>
          <h2 className={`dl-title font-bold tracking-wide ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
            Detail Log
          </h2>
          <div className={`dl-logid font-bold ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
            #{data.id}
          </div>
        </div>

        {/* Top Section - Vehicle Photos and Responsible Person */}
        <div className="dl-top-grid grid grid-cols-1 min-[1100px]:grid-cols-[1fr_1fr_22.5%] shrink-0">


          
          {/* Card 1: Vehicle Entry Photo */}
          <div className={`dl-photo-card relative border rounded-sm overflow-hidden group bg-[#000000] ${isLight ? 'border-[#D8D8D8]' : 'border-[#444841]'}`}>
            {data.fotoMasuk ? (
              <AuthImage src={data.fotoMasuk} token={accessToken} alt="Vehicle entry photo" className="w-full h-full object-cover" fallbackSize={40} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1 bg-[#121416]">
                <CameraOff className="dl-cam-icon" />
                <span className="dl-cam-text font-bold tracking-wider uppercase">NO ENTRY PHOTO</span>
              </div>
            )}
            {/* Top-Left Overlay */}
            <div className="dl-ov-tl absolute bg-[#00000066] rounded-sm flex flex-col backdrop-blur-xs">
              <span className={`dl-ov-text font-black tracking-wider uppercase ${isLight ? 'text-[#FFFFFF]' : 'text-[#2EAFF9]'}`}>CAMERA ENTRY CAPTURE</span>
              <span className={`dl-ov-text font-medium ${isLight ? 'text-[#FFFFFF]' : 'text-slate-200'}`}>{data.waktuMasuk} - {(data.gateMasuk || '-').split(' - ')[0]}</span>
            </div>
            {/* Bottom-Right Overlay */}
            <div className={`dl-ov-br absolute rounded-sm backdrop-blur-xs ${isLight ? 'bg-[#FFFFFFE5] border border-[#0066CC]' : 'bg-[#0B1326E6] border border-[#2EAFF9]'}`}>
              <span className={`dl-ov-text font-black tracking-widest uppercase ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>VEHICLE ENTRY PHOTO</span>
            </div>
          </div>

          {/* Card 2: Vehicle Exit Photo */}
          <div className={`dl-photo-card relative border rounded-sm overflow-hidden group bg-[#000000] ${isLight ? 'border-[#D8D8D8]' : 'border-[#444841]'}`}>
            {data.fotoKeluar ? (
              <AuthImage src={data.fotoKeluar} token={accessToken} alt="Vehicle exit photo" className="w-full h-full object-cover" fallbackSize={40} />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1 bg-[#121416]">
                <CameraOff className="dl-cam-icon" />
                <span className="dl-cam-text font-bold tracking-wider uppercase">NO EXIT PHOTO</span>
              </div>
            )}
            {/* Top-Left Overlay */}
            <div className="dl-ov-tl absolute bg-[#00000066] rounded-sm flex flex-col backdrop-blur-xs">
              <span className={`dl-ov-text font-black tracking-wider uppercase ${isLight ? 'text-[#FFFFFF]' : 'text-[#2EAFF9]'}`}>CAMERA EXIT CAPTURE</span>
              <span className={`dl-ov-text font-medium ${isLight ? 'text-[#FFFFFF]' : 'text-slate-200'}`}>{data.waktuKeluar} - {(data.gateKeluar || '-').split(' - ')[0]}</span>

            </div>

            {/* Bottom-Right Overlay */}
            <div className={`dl-ov-br absolute rounded-sm backdrop-blur-xs ${isLight ? 'bg-[#FFFFFFE5] border border-[#0066CC]' : 'bg-[#0B1326E6] border border-[#2EAFF9]'}`}>
              <span className={`dl-ov-text font-black tracking-widest uppercase ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>VEHICLE EXIT PHOTO</span>
            </div>
          </div>


          {/* Card 3: Responsible Person */}
          <div className={`flex h-[calc(223.5*var(--u))] min-w-0 items-center justify-center rounded-sm border p-[calc(20*var(--u))] ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#121416] border-[#444841]'}`}>
            <div className="flex min-w-0 max-w-full items-center gap-[calc(20*var(--u))]">
              <svg
                viewBox="0 0 20 28"
                fill="none"
                aria-hidden="true"
                className={`h-[calc(35*var(--u))] w-[calc(25*var(--u))] shrink-0 ${isLight ? 'text-[#1F2937]' : 'text-white'}`}
              >
                <rect x="1" y="1" width="18" height="26" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="11" r="4.5" fill="currentColor" />
                <path d="M2 24a8 8 0 0 1 16 0v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1Z" fill="currentColor" />
              </svg>
              <div className="flex min-w-0 flex-col text-left">
                <div className={`mb-[calc(2.5*var(--u))] text-[length:calc(10*var(--u))] font-bold tracking-widest uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>RESPONSIBLE PERSON</div>
                <div title={data.driver} className={`truncate text-[length:calc(20*var(--u))] font-medium leading-[calc(30.5*var(--u))] ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>{data.driver}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Section - 2 Columns Layout */}
        <div className="dl-bottom-grid grid grid-cols-1 min-[1100px]:grid-cols-2">
          
          {/* Left Column: Vehicle Data & Operator Notes */}
          <div className="dl-col flex flex-col">
            
            {/* Vehicle Data - #1C2026 border #444841 */}
            <div className={`dl-card border rounded-sm flex flex-col ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
              <div className="dl-card-head flex items-center shrink-0">
                <Car className={`dl-card-icon ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                <h3 className={`dl-card-title font-black tracking-wider uppercase ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                  VEHICLE DATA
                </h3>
              </div>
              <div className="flex flex-col divide-y divide-[#444841]/50">
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>PLATE NUMBER</span>
                  <span className={`font-bold tracking-wide ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>{data.plate}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>VEHICLE TYPE</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.type}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>COLOR</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.color}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>BRAND</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.brand}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>YEAR</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.year}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>RFID TAG</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.rfidTag}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>RFID STATUS</span>
                  <span 
                    className="dl-badge inline-block font-bold tracking-wider uppercase rounded-sm"
                    style={{
                      backgroundColor: data.rfidOk 
                        ? (isLight ? '#DEF7EC' : '#2EAFF91A') 
                        : (isLight ? '#F7DEDE' : '#FFB4AB1A'),
                      borderColor: data.rfidOk 
                        ? (isLight ? '#31C48D' : '#2EAFF9') 
                        : (isLight ? '#EF4444' : '#FFB4AB'),
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      color: data.rfidOk 
                        ? (isLight ? '#03543F' : '#2EAFF9') 
                        : (isLight ? '#EF4444' : '#FFB4AB')
                    }}
                  >
                    {data.rfidStatus}
                  </span>



                </div>
              </div>
            </div>

            {/* Operator Notes - outer #1C2026 border #444841, inner #181C22 border #444841 */}
            <div className={`dl-card border rounded-sm ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
              <div className="dl-card-head dl-card-head--lg flex items-center shrink-0">
                <FileEdit className={`dl-card-icon ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                <h3 className={`dl-card-title font-black tracking-wider uppercase ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                  OPERATOR NOTES
                </h3>
                {accessToken && logData?.id && !editingNotes && (
                  <button
                    onClick={() => { setNotesDraft(data.catatan === 'No operator notes.' ? '' : data.catatan); setEditingNotes(true) }}
                    className={`ml-auto p-1 transition-colors ${isLight ? 'text-[#0C5F9A] hover:text-[#094d7d]' : 'text-[#2EAFF9] hover:text-white'}`}
                    aria-label="Edit notes"
                  >
                    <Pencil className="dl-card-icon" />
                  </button>
                )}
                {editingNotes && (
                  <div className="ml-auto flex items-center gap-1">
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className={`p-1 transition-colors ${isLight ? 'text-[#0C5F9A] hover:text-[#094d7d]' : 'text-[#2EAFF9] hover:text-white'} disabled:opacity-40`}
                      aria-label="Save notes"
                    >
                      <Check className="dl-card-icon" />
                    </button>
                    <button
                      onClick={() => setEditingNotes(false)}
                      disabled={savingNotes}
                      className="p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-40"
                      aria-label="Cancel editing"
                    >
                      <X className="dl-card-icon" />
                    </button>
                  </div>
                )}
              </div>
              {editingNotes ? (
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  maxLength={4000}
                  rows={4}
                  placeholder="Write operator notes..."
                  className={`dl-note rounded-sm border leading-relaxed w-full resize-y outline-none ${isLight ? 'bg-[#F7F8FC] border-[#D8D8D8] text-slate-700 focus:border-[#0C5F9A]' : 'bg-[#181C22] border-[#444841] text-slate-300 focus:border-[#2EAFF9]'}`}
                />
              ) : (
                <div className={`dl-note rounded-sm border leading-relaxed ${isLight ? 'bg-[#F7F8FC] border-[#D8D8D8] text-slate-700' : 'bg-[#181C22] border-[#444841] text-slate-300'}`}>
                  {data.catatan}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Gate Access Data & Recent Access History */}
          <div className="dl-col flex flex-col">
            
            {/* Gate Access Data - #1C2026 border #444841 */}
            <div className={`dl-card border rounded-sm flex flex-col ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
              <div className="dl-card-head flex items-center shrink-0">
                <Shield className={`dl-card-icon ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                <h3 className={`dl-card-title font-black tracking-wider uppercase ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                  GATE ACCESS DATA
                </h3>
              </div>
              <div className="flex flex-col divide-y divide-[#444841]/50">
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>LOG ID</span>
                  <span className={`font-bold tracking-wide ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>{data.id}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>ENTRY GATE</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.gateMasuk}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>EXIT GATE</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.gateKeluar}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>ENTRY TIME</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.waktuMasuk}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>EXIT TIME</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.waktuKeluar}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>DURATION</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.durasi}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>STATUS</span>
                  <span className={`dl-status-badge font-black tracking-widest uppercase ${
                    data.status === 'DENIED' 
                      ? (isLight ? 'bg-[#FF1B001A] text-[#EF4444] border-[#EF4444]' : 'bg-[#FFB4AB1A] text-[#FFB4AB] border-[#FFB4AB]')
                      : (isLight ? 'bg-[#E6F4EA] text-[#137333] border-[#34A853]' : 'bg-[#BCCBB11A] text-[#2EAFF9] border-[#2EAFF9]')
                  }`}>
                    {data.status}
                  </span>
                </div>

                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>OPERATOR</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.operator}</span>
                </div>
              </div>
            </div>

            {/* Recent Vehicle Access History - #1C2026 border #444841 */}
            <div className={`dl-card border rounded-sm ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
              <div className="dl-card-head dl-card-head--lg flex items-center shrink-0">
                <History className={`dl-card-icon ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                <h3 className={`dl-card-title font-black tracking-wider uppercase ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                  RECENT VEHICLE ACCESS HISTORY
                </h3>
              </div>
              <div className="dl-riwayat-box overflow-y-auto overflow-x-auto no-scrollbar">
                <table className="dl-table w-full text-left">
                  <thead className="sticky top-0 z-10">
                    <tr className={`border-b ${isLight ? 'bg-[#F3F4F6] border-slate-200 detail-log-tr' : 'bg-[#1C2026] border-[#444841]/60'}`}>
                      <th className={`dl-th font-bold tracking-wider uppercase ${isLight ? 'text-[#4B5563] detail-log-th' : 'text-[#C5C8BE]'}`}>TIME</th>
                      <th className={`dl-th font-bold tracking-wider uppercase ${isLight ? 'text-[#4B5563] detail-log-th' : 'text-[#C5C8BE]'}`}>GATE</th>
                      <th className={`dl-th font-bold tracking-wider uppercase text-right ${isLight ? 'text-[#4B5563] detail-log-th' : 'text-[#C5C8BE]'}`}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#444841]/40">
                    {data.riwayat.length === 0 ? (
                      <tr>
                        <td colSpan={3} className={`dl-td-empty text-center font-medium ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                          NO ACCESS HISTORY
                        </td>
                      </tr>
                    ) : (
                      data.riwayat.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className={`dl-td font-medium whitespace-nowrap ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{item.waktu}</td>
                          <td className={`dl-td font-medium whitespace-nowrap ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{item.gate}</td>
                          <td className="dl-td font-bold text-right whitespace-nowrap">
                            <span className={isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}>{item.status}</span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
