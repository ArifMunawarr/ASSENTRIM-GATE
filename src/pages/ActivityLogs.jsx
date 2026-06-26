import React, { useState } from 'react'
import Header from '../components/Header'
import DateRangePicker from '../components/DateRangePicker'
import CustomSelect from '../components/CustomSelect'
import CheckboxSelect from '../components/CheckboxSelect'
import { LayoutDashboard, History, HeadphonesIcon, Settings, Car, Grid3X3, ShieldAlert, Search, ChevronDown, ChevronLeft, ChevronRight, MoreVertical, FileText, FileSpreadsheet, RotateCcw } from 'lucide-react'
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

const logData = [
  { id: '22323232323', type: 'SUV', driver: 'Anton Ruman', date: '2023-10-24', time: '09:12:44', gate: 'GATE 01', plate: 'B 1234 TNI', plateColor: '#2EAFF9', rfidStatus: 'Verified', rfidOk: true, operator: 'Sgt. Pratama', status: 'DITERIMA' },
  { id: '22323232323', type: 'TRUCK', driver: 'Tidak Dikenal', date: '2023-10-24', time: '09:08:12', gate: 'GATE 01', plate: 'AD 7749 AA', plateColor: '#2EAFF9', rfidStatus: 'No RFID', rfidOk: false, operator: 'Sgt. Pratama', status: 'DITOLAK' },
  { id: '22323232323', type: 'MINIBUS', driver: 'Rudi Burhan', date: '2023-10-24', time: '08:55:01', gate: 'GATE 02', plate: 'L 9901 AB', plateColor: '#4ade80', rfidStatus: 'Verified', rfidOk: true, operator: 'Cpl. Santoso', status: 'DITERIMA' },
  { id: '22323232324', type: 'SUV', driver: 'Sari Dewi', date: '2023-10-24', time: '09:15:23', gate: 'GATE 03', plate: 'B 1234 CD', plateColor: '#4ade80', rfidStatus: 'Verified', rfidOk: true, operator: 'Sgt. Hadi', status: 'DITERIMA' },
  { id: '22323232324', type: 'SUV', driver: 'Sari Dewi', date: '2023-10-24', time: '09:15:23', gate: 'GATE 03', plate: 'B 1234 CD', plateColor: '#2EAFF9', rfidStatus: 'Verified', rfidOk: true, operator: 'Sgt. Hadi', status: 'DITERIMA' },
]

export default function ActivityLogs({ onNavigate, theme, onToggleTheme, onLogout }) {
  const [currentPage, setCurrentPage] = useState(1)

  // Draft (pending) state - controlled by dropdowns
  const [pendingVehicleType, setPendingVehicleType] = useState('all')
  const [pendingGateSelection, setPendingGateSelection] = useState([])
  const [pendingRfidStatus, setPendingRfidStatus] = useState('all')

  // Applied state - used to actually filter the table
  const [vehicleType, setVehicleType] = useState('all')
  const [gateSelection, setGateSelection] = useState([])
  const [rfidStatus, setRfidStatus] = useState('all')

  const handleApplyFilters = () => {
    setVehicleType(pendingVehicleType)
    setGateSelection(pendingGateSelection)
    setRfidStatus(pendingRfidStatus)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setPendingVehicleType('all')
    setPendingGateSelection([])
    setPendingRfidStatus('all')
    setVehicleType('all')
    setGateSelection([])
    setRfidStatus('all')
    setCurrentPage(1)
  }

  const filteredData = logData.filter(row => {
    if (vehicleType !== 'all' && row.type !== vehicleType) return false
    if (gateSelection.length > 0 && !gateSelection.includes(row.gate)) return false
    if (rfidStatus !== 'all' && row.status !== rfidStatus) return false
    return true
  })

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
            <button className={`flex items-center gap-1.5 2xl:gap-2.5 text-[9px] 2xl:text-[12px] font-black px-3 py-2 2xl:px-5 2xl:py-3 rounded tracking-widest uppercase transition-colors ${theme === 'light' ? 'bg-[#0C5F9A] hover:bg-[#094d7d] text-[#FAFAFA]' : 'bg-[#2EAFF9] hover:bg-[#1f9beb] text-[#0a0d14]'}`}>
              <FileText className="w-3 h-3 2xl:w-4 2xl:h-4" strokeWidth={2.5} />
              Print PDF
            </button>
            <button className={`flex items-center gap-1.5 2xl:gap-2.5 text-[9px] 2xl:text-[12px] font-black px-3 py-2 2xl:px-5 2xl:py-3 rounded tracking-widest uppercase transition-colors ${theme === 'light' ? 'bg-[#0C5F9A] hover:bg-[#094d7d] text-[#FAFAFA]' : 'bg-[#2EAFF9] hover:bg-[#1f9beb] text-[#0a0d14]'}`}>
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
                1,248
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
                <span className={`text-3xl sm:text-4xl 2xl:text-5xl font-black leading-none tracking-tight ${theme === 'light' ? 'text-[#0C5F9A]' : 'text-white'}`}>06</span>
                <span className={`text-sm 2xl:text-xl font-bold tracking-wide ${theme === 'light' ? 'text-slate-800' : 'text-slate-400'}`}>/ 06</span>
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
                03
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
                  <DateRangePicker theme={theme} />
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
                      { value: 'DITERIMA', label: 'Diterima' },
                      { value: 'DITOLAK', label: 'Ditolak' }
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
            <input type="text" placeholder="Search" className={`text-slate-300 text-[11px] 2xl:text-[14px] pl-3 pr-9 py-2 2xl:pl-4 2xl:pr-12 2xl:py-3 w-full lg:w-64 2xl:w-80 outline-none placeholder-slate-300 tracking-wider transition-colors ${theme === 'light' ? 'bg-[#FAFAFA] border border-[#D8D8D8] focus:border-[#D8D8D8]' : 'bg-[#1C2026] border border-[#444841] focus:border-[#2EAFF9]'}`} />
            <Search className={`absolute right-3 2xl:right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 2xl:w-5 2xl:h-5 pointer-events-none transition-colors ${theme === 'light' ? 'text-[#8A8F98]' : 'text-slate-400'}`} strokeWidth={1.5} />
          </div>
        </div>

        {/* Table & Pagination Container */}
        <div className="border border-[#444841] bg-[#1C2026] flex flex-col min-h-0 overflow-hidden flex-1">
          <div className="flex-1 min-h-0 overflow-x-auto no-scrollbar">
            <table className="w-full h-full text-left min-w-[1000px] 2xl:min-w-[1400px]">
              <thead className={`z-10 sticky top-0 ${theme === 'light' ? 'bg-[#0C5F9A]' : 'bg-[#262A31]'}`}>
                <tr style={{ borderBottom: '1.17px solid #444841' }}>
                  <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-[10px] 2xl:text-[13px] font-bold tracking-widest text-[#C5C8BE] uppercase">ID</th>
                  <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-[10px] 2xl:text-[13px] font-bold tracking-widest text-[#C5C8BE] uppercase">Type</th>
                  <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-[10px] 2xl:text-[13px] font-bold tracking-widest text-[#C5C8BE] uppercase">Driver</th>
                  <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-[10px] 2xl:text-[13px] font-bold tracking-widest text-[#C5C8BE] uppercase">Date / Time</th>
                  <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-[10px] 2xl:text-[13px] font-bold tracking-widest text-[#C5C8BE] uppercase text-center">Foto Driver</th>
                  <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-[10px] 2xl:text-[13px] font-bold tracking-widest text-[#C5C8BE] uppercase text-center">Gate</th>
                  <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-[10px] 2xl:text-[13px] font-bold tracking-widest text-[#C5C8BE] uppercase text-center">License Plate</th>
                  <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-[10px] 2xl:text-[13px] font-bold tracking-widest text-[#C5C8BE] uppercase">RFID Status</th>
                  <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-[10px] 2xl:text-[13px] font-bold tracking-widest text-[#C5C8BE] uppercase">Operator Name</th>
                  <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-[10px] 2xl:text-[13px] font-bold tracking-widest text-[#C5C8BE] uppercase text-center">Status</th>
                  <th className="px-4 py-3 2xl:px-6 2xl:py-4 text-[10px] 2xl:text-[13px] font-bold tracking-widest text-[#C5C8BE] uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.slice(0, 5).map((row, idx) => (
                  <tr key={idx} className={`border-b border-[#444841]/60 transition-colors ${theme === 'light' ? (idx % 2 === 0 ? 'bg-[#FAFAFA]' : 'bg-[#F7F8FC]') : 'hover:bg-white/[0.02]'}`}>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-[11px] text-[11px] 2xl:text-[13px] text-slate-400 font-medium tracking-wide">{row.id}</td>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-[11px] text-[11px] 2xl:text-[13px] text-slate-400 font-medium tracking-wide">{row.type}</td>
                    <td className={`px-4 py-3 2xl:px-6 2xl:py-[11px] text-[11px] 2xl:text-[13px] font-medium tracking-wide ${row.driver === 'Tidak Dikenal' ? 'text-[#EF4444]' : (row.status === 'DITOLAK' ? 'text-[#FFB4AB]' : 'text-slate-400')}`}>{row.driver}</td>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-[11px]">
                      <div className="text-[11px] 2xl:text-[13px] text-slate-400 font-medium tracking-wide">{row.date}</div>
                      <div className="text-[9px] 2xl:text-[11px] font-medium tracking-wider mt-0.5" style={{ color: '#C5C8BE' }}>{row.time}</div>
                    </td>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-[11px]">
                      <div className="flex justify-center">
                        <div className="w-10 h-10 2xl:w-[40px] 2xl:h-[40px] border border-[#444841] rounded-sm overflow-hidden flex items-center justify-center bg-[#1C2026]">
                          <img src={fotdriver} alt="Driver" className="w-full h-full object-cover grayscale opacity-90" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-[11px] text-[11px] 2xl:text-[13px] font-bold tracking-wider text-center" style={{ color: '#C5C8BE' }}>{row.gate}</td>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-[11px] text-center">
                      <span 
                        className="inline-block text-[11px] 2xl:text-[13px] font-medium px-3 py-1 2xl:px-4 2xl:py-1 rounded-sm tracking-wide" 
                        style={{ 
                          backgroundColor: row.status === 'DITERIMA' ? '#BCCBB10D' : '#1C2026',
                          border: row.status === 'DITERIMA' ? '1.17px solid #BCCBB133' : '1.17px solid #444841',
                          color: row.status === 'DITERIMA' ? (theme === 'light' ? '#0C5F9A' : '#2EAFF9') : (theme === 'light' ? '#FAFAFA' : '#DFE2EB'),
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        {row.plate}
                      </span>
                    </td>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-[11px]">
                      <div className="flex items-center gap-1.5 2xl:gap-2.5">
                        <div className={`w-1.5 h-1.5 2xl:w-2 2xl:h-2 rounded-full ${row.rfidOk ? 'bg-[#2EAFF9]' : (theme === 'light' ? 'bg-[#EF4444]' : 'bg-[#FFB4AB]')}`} />
                        <span className={`text-[11px] 2xl:text-[13px] font-medium tracking-wide ${row.rfidOk ? 'text-slate-200' : (theme === 'light' ? 'text-[#EF4444]' : 'text-[#FFB4AB]')}`}>{row.rfidStatus}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-[11px] text-[11px] 2xl:text-[13px] text-slate-400 font-medium tracking-wide">{row.operator}</td>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-[11px] text-center">
                      <div className="flex justify-center">
                        <span 
                          className={`text-[9px] 2xl:text-[11px] font-black tracking-widest px-2 py-1 2xl:px-3 2xl:py-1 uppercase ${
                            row.status === 'DITOLAK' 
                              ? (theme === 'light' 
                                  ? 'bg-[#FF1B001A] text-[#EF4444] border-l-[4.66px] border-[#EF4444]' 
                                  : 'bg-[#FFB4AB1A] text-[#FFB4AB] border-l-[4.66px] border-[#FFB4AB]') 
                              : (theme === 'light'
                                  ? 'bg-[#0000001A] text-[#0C5F9A] border-l-[4.66px] border-[#0C5F9A]'
                                  : 'bg-[#BCCBB11A] text-[#2EAFF9] border-l-[4.66px] border-[#2EAFF9]')
                          }`}
                        >
                          {row.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 2xl:px-6 2xl:py-[11px]">
                      <div className="flex justify-center">
                        <button className="text-slate-500 hover:text-slate-300 transition-colors">
                          <MoreVertical className="w-4 h-4 2xl:w-5 2xl:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 2xl:px-6 2xl:py-5 border-t border-[#444841] bg-[#1C2026] shrink-0">
            <div className="text-[9px] 2xl:text-[12px] font-bold tracking-widest text-slate-500 uppercase">
              SHOWING 1 TO 3 OF 124 LOGS
            </div>
            <div className="flex items-center gap-1 2xl:gap-2">
              <button className="w-7 h-7 2xl:w-10 2xl:h-10 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">
                <ChevronLeft className="w-3 h-3 2xl:w-5 2xl:h-5" />
              </button>
              <button className={`w-7 h-7 2xl:w-10 2xl:h-10 flex items-center justify-center text-[10px] 2xl:text-[14px] font-black rounded-sm ${theme === 'light' ? 'bg-[#0C5F9A] text-[#FAFAFA]' : 'bg-[#2EAFF9] text-[#0a0d14]'}`}>
                1
              </button>
              <button className="w-7 h-7 2xl:w-10 2xl:h-10 flex items-center justify-center text-slate-400 hover:text-white text-[10px] 2xl:text-[14px] font-bold transition-colors">
                2
              </button>
              <button className="w-7 h-7 2xl:w-10 2xl:h-10 flex items-center justify-center text-slate-400 hover:text-white text-[10px] 2xl:text-[14px] font-bold transition-colors">
                3
              </button>
              <button className="w-7 h-7 2xl:w-10 2xl:h-10 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors">
                <ChevronRight className="w-3 h-3 2xl:w-5 2xl:h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
