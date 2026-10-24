import React, { useState, useMemo } from 'react'
import Header from '../components/Header'
import DateRangePicker from '../components/DateRangePicker'
import CustomSelect from '../components/CustomSelect'
import CheckboxSelect from '../components/CheckboxSelect'
import { LayoutDashboard, History, HeadphonesIcon, Settings, Car, Grid3X3, ShieldAlert, Search, ChevronDown, ChevronLeft, ChevronRight, MoreVertical, FileText, FileSpreadsheet, RotateCcw, CameraOff } from 'lucide-react'

import logoImage from '../assets/logologindark.svg'
import fotdriver from '../assets/fotdriver.png'
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
import das1 from '../assets/das1.png'
import das2 from '../assets/das2.png'
import das3 from '../assets/das3.png'
import das5 from '../assets/das5.png'

const PAGE_SIZE = 4

const stats = {
  totalHariIni: 1248,
  ditolakHariIni: 3,
  gateAktif: 6,
  gateTotal: 6
}

const logData = [
  {
    id: 'LOG-0001',
    plate: '212-09',
    alternativeNumber: null,
    type: 'SUV',
    driver: 'Anton Ruman',
    gateMasuk: 'GATE 01',
    fotoMasuk: das1,
    waktuMasuk: '09:12:44',
    gateKeluar: 'GATE 01',
    fotoKeluar: das1,
    waktuKeluar: '17:00:00',
    date: '2023-10-24',
    rfidStatus: 'VERIFIED',
    rfidOk: true,
    status: 'AUTHORIZED'
  },
  {
    id: 'LOG-0002',
    plate: '112-90',
    alternativeNumber: '11-90',
    type: 'TRUCK',
    driver: 'Unknown',
    gateMasuk: 'GATE 01',
    fotoMasuk: das2,
    waktuMasuk: '09:08:12',
    gateKeluar: 'GATE 01',
    fotoKeluar: das2,
    waktuKeluar: '17:00:00',
    date: '2023-10-24',
    rfidStatus: 'NO RFID',
    rfidOk: false,
    status: 'DENIED'
  },
  {
    id: 'LOG-0003',
    plate: '223-09',
    alternativeNumber: '22-09',
    type: 'MINIBUS',
    driver: 'Rudi Burhan',
    gateMasuk: 'GATE 02',
    fotoMasuk: das3,
    waktuMasuk: '08:55:01',
    gateKeluar: 'GATE 02',
    fotoKeluar: das3,
    waktuKeluar: '17:00:00',
    date: '2023-10-24',
    rfidStatus: 'VERIFIED',
    rfidOk: true,
    status: 'AUTHORIZED'
  },
  {
    id: 'LOG-0004',
    plate: '909-18',
    alternativeNumber: null,
    type: 'SUV',
    driver: 'Sari Dewi',
    gateMasuk: 'GATE 03',
    fotoMasuk: das5,
    waktuMasuk: '09:15:23',
    gateKeluar: 'GATE 03',
    fotoKeluar: das5,
    waktuKeluar: '17:00:00',
    date: '2023-10-24',
    rfidStatus: 'VERIFIED',
    rfidOk: true,
    status: 'AUTHORIZED'
  },
]

const toDateString = (d) => {
  if (!d) return null
  const yr = d.getFullYear()
  const mo = String(d.getMonth() + 1).padStart(2, '0')
  const dy = String(d.getDate()).padStart(2, '0')
  return `${yr}-${mo}-${dy}`
}

function LogNumberBadge({ value, status, theme, alternative = false }) {
  return (
    <span className={`inline-flex h-[22px] items-center whitespace-nowrap rounded-sm border px-1.5 text-[12px] font-normal leading-none 2xl:h-[25px] 2xl:text-[15px] ${alternative ? 'min-w-[72px] 2xl:min-w-[82px]' : 'min-w-[58px] 2xl:min-w-[65px]'} ${
      theme === 'light'
        ? 'border-[#AECBFA] bg-[#E8F0FE] text-[#1A73E8]'
        : status === 'AUTHORIZED'
          ? 'border-[#444841] bg-[#24292C] text-[#2EAFF9]'
          : 'border-[#444841] bg-transparent text-[#DFE2EB]'
    }`}>
      {value || '-'}
    </span>
  )
}

export default function ActivityLogs({ onNavigate, theme, onToggleTheme, onLogout }) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  // Draft (pending) filter state
  const [pendingDateRange, setPendingDateRange] = useState({ startDate: null, endDate: null })
  const [pendingVehicleType, setPendingVehicleType] = useState('all')
  const [pendingGateSelection, setPendingGateSelection] = useState([])
  const [pendingRfidStatus, setPendingRfidStatus] = useState('all')

  // Applied state - used to actually filter the table
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null })
  const [vehicleType, setVehicleType] = useState('all')
  const [gateSelection, setGateSelection] = useState([])
  const [rfidStatus, setRfidStatus] = useState('all')

  const filteredData = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const startStr = toDateString(dateRange.startDate)
    const endStr = toDateString(dateRange.endDate) || startStr

    return logData.filter((row) => {
      if (vehicleType !== 'all' && row.type !== vehicleType) return false
      if (gateSelection.length > 0 && !gateSelection.includes(row.gateMasuk) && !gateSelection.includes(row.gateKeluar)) return false
      if (rfidStatus !== 'all' && row.status !== rfidStatus) return false
      if (startStr && (row.date < startStr || row.date > endStr)) return false
      if (query && ![row.plate, row.alternativeNumber, row.driver, row.rfidStatus].some((v) => (v || '').toLowerCase().includes(query))) return false
      return true
    })
  }, [searchQuery, dateRange, vehicleType, gateSelection, rfidStatus])

  const totalItems = filteredData.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const logs = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

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
              onClick={() => window.print()}
              className={`flex items-center gap-1.5 2xl:gap-2.5 text-[9px] 2xl:text-[12px] font-black px-3 py-2 2xl:px-5 2xl:py-3 rounded tracking-widest uppercase transition-colors ${theme === 'light' ? 'bg-[#0C5F9A] hover:bg-[#094d7d] text-[#FAFAFA]' : 'bg-[#2EAFF9] hover:bg-[#1f9beb] text-[#0a0d14]'}`}
            >
              <FileText className="w-3 h-3 2xl:w-4 2xl:h-4" strokeWidth={2.5} />
              Print PDF
            </button>
            <button 
              className={`flex items-center gap-1.5 2xl:gap-2.5 text-[9px] 2xl:text-[12px] font-black px-3 py-2 2xl:px-5 2xl:py-3 rounded tracking-widest uppercase transition-colors ${theme === 'light' ? 'bg-[#0C5F9A] hover:bg-[#094d7d] text-[#FAFAFA]' : 'bg-[#2EAFF9] hover:bg-[#1f9beb] text-[#0a0d14]'}`}
            >
              <FileSpreadsheet className="w-3 h-3 2xl:w-4 2xl:h-4" strokeWidth={2.5} />
              Print Excel
            </button>
          </div>
        </div>

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
                SYSTEMS OPTIMAL: ALL GATES ACTIVE
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
              <div className="flex flex-col gap-1.5 2xl:gap-2 z-50">
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
                      { value: 'GATE 05', label: 'Gate 05' },
                      { value: 'GATE 06', label: 'Gate 06' }
                    ]}
                    selectedValues={pendingGateSelection}
                    onChange={setPendingGateSelection}
                    placeholder="Select Gate"
                    widthClass="w-48"
                  />
                </div>
              </div>

              {/* RFID Status */}
              <div className="flex flex-col gap-1 z-20">
                <label className="text-[8px] 2xl:text-[11px] font-black tracking-[0.15em] text-[#C5C8BE] uppercase">RFID STATUS</label>
                <div>
                  <CustomSelect 
                    theme={theme}
                    options={[
                      { value: 'all', label: 'All Status' },
                      { value: 'AUTHORIZED', label: 'Authorized' },
                      { value: 'DENIED', label: 'Denied' }
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
            <table className="w-full h-full text-left table-auto">
              <thead className={`z-10 sticky top-0 ${theme === 'light' ? 'bg-[#F3F4F6]' : 'bg-[#262A31]'}`}>

                <tr style={{ borderBottom: theme === 'light' ? '1.17px solid #D8D8D8' : '1.17px solid #444841' }}>
                  <th scope="col" className={`min-w-[96px] px-3 py-2.5 text-[9px] font-bold tracking-wide whitespace-nowrap 2xl:min-w-[118px] 2xl:px-3.5 2xl:text-[11px] ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Plate Number</th>
                  <th scope="col" className={`min-w-[96px] px-3 py-2.5 text-[9px] font-bold leading-[13px] tracking-wide 2xl:min-w-[118px] 2xl:px-3.5 2xl:text-[11px] 2xl:leading-[15px] ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Alternative<br />Number</th>
                  <th scope="col" className={`px-3 py-2.5 text-[9px] font-bold tracking-wide whitespace-nowrap 2xl:px-3.5 2xl:text-[11px] ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Type</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Driver</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Entry Gate</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase text-center whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Entry Photo</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Entry Time</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Exit Gate</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase text-center whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Exit Photo</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Exit Time</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Date</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>RFID Status</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase text-center whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Status</th>
                  <th className={`px-2 py-2 2xl:px-3 2xl:py-3 text-[9px] 2xl:text-[11px] font-bold tracking-widest uppercase text-center whitespace-nowrap ${theme === 'light' ? 'text-[#475569]' : 'text-[#C5C8BE]'}`}>Actions</th>
                </tr>

              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="py-8 text-center text-slate-500">
                      No matching log entries.
                    </td>
                  </tr>
                ) : (
                  logs.map((row, idx) => (
                    <tr key={row.id || idx} className={`border-b border-[#444841]/60 transition-colors ${theme === 'light' ? (idx % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-[#F7F8FC]') : 'hover:bg-white/[0.02]'}`}>
                      {/* Plate Number */}
                      <td className="px-3 py-1.5 whitespace-nowrap 2xl:px-3.5 2xl:py-2">
                        <LogNumberBadge value={row.plate} status={row.status} theme={theme} />
                      </td>
                      {/* Alternative Number */}
                      <td className="px-3 py-1.5 whitespace-nowrap 2xl:px-3.5 2xl:py-2">
                        <LogNumberBadge value={row.alternativeNumber} status={row.status} theme={theme} alternative />
                      </td>
                      {/* Type */}
                      <td className={`px-3 py-1.5 text-[11px] font-normal whitespace-nowrap 2xl:px-3.5 2xl:py-2 2xl:text-[13px] ${theme === 'light' ? 'text-[#383735]' : 'text-[#DFE2EB]'}`}>{row.type}</td>
                      {/* Driver */}
                      <td className={`px-2 py-1.5 2xl:px-3 2xl:py-2 text-[10px] 2xl:text-[12px] font-medium tracking-wide whitespace-nowrap ${row.driver === 'Unknown' ? 'text-[#EF4444]' : (row.status === 'DENIED' ? 'text-[#FFB4AB]' : 'text-slate-400')}`}>{row.driver}</td>
                      {/* Entry Gate */}
                      <td className="px-2 py-1.5 2xl:px-3 2xl:py-2 text-[10px] 2xl:text-[12px] font-bold tracking-wider whitespace-nowrap" style={{ color: theme === 'light' ? '#475569' : '#C5C8BE' }}>{row.gateMasuk}</td>
                      {/* Entry Photo */}
                      <td className="px-2 py-1.5 2xl:px-3 2xl:py-2">
                        <div className="flex justify-center">
                          <div className="w-7 h-7 2xl:w-8 2xl:h-8 border border-[#444841] rounded-sm overflow-hidden flex items-center justify-center bg-[#1C2026]">
                            {row.fotoMasuk ? (
                              <img src={row.fotoMasuk} alt="Entry photo" className="w-full h-full object-cover" />
                            ) : (
                              <CameraOff size={14} className="text-slate-500" />
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Entry Time */}
                      <td className="px-2 py-1.5 2xl:px-3 2xl:py-2 text-[10px] 2xl:text-[12px] text-slate-400 font-medium tracking-wide whitespace-nowrap">{row.waktuMasuk}</td>
                      {/* Exit Gate */}
                      <td className="px-2 py-1.5 2xl:px-3 2xl:py-2 text-[10px] 2xl:text-[12px] font-bold tracking-wider whitespace-nowrap" style={{ color: theme === 'light' ? '#475569' : '#C5C8BE' }}>{row.gateKeluar}</td>

                      {/* Exit Photo */}
                      <td className="px-2 py-1.5 2xl:px-3 2xl:py-2">
                        <div className="flex justify-center">
                          <div className="w-7 h-7 2xl:w-8 2xl:h-8 border border-[#444841] rounded-sm overflow-hidden flex items-center justify-center bg-[#1C2026]">
                            {row.fotoKeluar ? (
                              <img src={row.fotoKeluar} alt="Exit photo" className="w-full h-full object-cover" />
                            ) : (
                              <CameraOff size={14} className="text-slate-500" />
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Exit Time */}
                      <td className="px-2 py-1.5 2xl:px-3 2xl:py-2 text-[10px] 2xl:text-[12px] text-slate-400 font-medium tracking-wide whitespace-nowrap">{row.waktuKeluar}</td>
                      {/* Date */}
                      <td className="px-2 py-1.5 2xl:px-3 2xl:py-2 text-[10px] 2xl:text-[12px] text-slate-400 font-medium tracking-wide whitespace-nowrap">{row.date}</td>
                      {/* RFID Status */}
                      <td className="px-2 py-1.5 2xl:px-3 2xl:py-2 whitespace-nowrap">
                        <span 
                          className="inline-block px-2 py-0.5 text-[9px] 2xl:text-[10px] font-bold tracking-wider uppercase rounded-sm"
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

                      {/* Status */}
                      <td className="px-2 py-1.5 2xl:px-3 2xl:py-2 text-center whitespace-nowrap">
                        <div className="flex justify-center">
                          <span 
                            className={`text-[8.5px] 2xl:text-[10px] font-black tracking-widest px-2 py-0.5 uppercase ${
                              row.status === 'DENIED' 
                                ? (theme === 'light' 
                                    ? 'bg-[#FF1B001A] text-[#EF4444] border-l-[4px] border-[#EF4444]' 
                                    : 'bg-[#FFB4AB1A] text-[#FFB4AB] border-l-[4px] border-[#FFB4AB]') 
                                : (theme === 'light'
                                    ? 'bg-[#E6F4EA] text-[#137333] border-l-[4px] border-[#34A853]'
                                    : 'bg-[#BCCBB11A] text-[#2EAFF9] border-l-[4px] border-[#2EAFF9]')
                            }`}
                          >

                            {row.status}
                          </span>
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="px-2 py-1.5 2xl:px-3 2xl:py-2">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => onNavigate && onNavigate('detaillog', row)}
                            className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                          >
                            <MoreVertical className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 2xl:px-6 2xl:py-3 border-t border-[#444841] bg-[#1C2026] shrink-0">
            <div className="text-[9px] 2xl:text-[12px] font-bold tracking-widest text-slate-500 uppercase">
              SHOWING {logs.length > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0} TO {(currentPage - 1) * PAGE_SIZE + logs.length} OF {totalItems} LOGS
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
