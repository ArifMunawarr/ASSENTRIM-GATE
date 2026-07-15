import React, { useState, useRef, useEffect } from 'react'
import Header from '../components/Header'
import { LayoutDashboard, History, HeadphonesIcon, Settings, ClipboardList, AlertCircle, ChevronDown, ChevronRight, ChevronsRight, ChevronLeft } from 'lucide-react'
import logoImage from '../assets/logologindark.svg'
import lconLive from '../assets/lconlive.svg'
import historymangate from '../assets/historymangate.svg'
import historymangateLight from '../assets/historymangate(1).svg'
import progressVisuals from '../assets/Progress_Visuals.svg'
import noteIcon from '../assets/note.svg'
import opnreason from '../assets/opnreason.svg'
import opnreasonLight from '../assets/opnreason(1).svg'
import activitiIcon from '../assets/activitiIcon.svg'
import activitiIconLight from '../assets/activitiIcon(1).svg'
import das1 from '../assets/das1.png'
import das2 from '../assets/das2.png'
import das3 from '../assets/das3.png'
import das5 from '../assets/das5.png'
import das6 from '../assets/das6.png'

const cameras = [
  { id: 1, name: 'GATE 01 - MAIN GATE', img: das1, camId: 'CAM-01 / NW-72', coords: '44.02°N 12.33°E', status: 'LIVE' },
  { id: 2, name: 'GATE 02 - VEHICLE EXIT', img: das2, camId: 'CAM-02 / SE-41', coords: 'HD-RECON-7', status: 'LIVE' },
  { id: 3, name: 'GATE 03 - GATE WEST', img: das3, camId: 'CAM-03 / W-09', coords: 'THERMAL-LINK', status: 'LIVE' },
  { id: 4, name: 'GATE 04 - GATE EAST', img: null, camId: 'CAM-04 / E-14', coords: 'THERMAL-LINK', status: 'LIVE' },
  { id: 5, name: 'GATE 05 - MAIN GATE', img: das5, camId: 'CAM-05 / INT-01', coords: '44.02°N 12.33°E', status: 'LIVE' },
  { id: 6, name: 'GATE 06 - LOGISTICS YARD', img: das6, camId: 'CAM-06 / E-14', coords: 'EXT-4A-REAR', status: 'LIVE' },
]

const activities = [
  { id: '229-87', gate: 'GATE 03', time: '14:45:10', rfid: '900779009', driver: 'ANTON RUMANTO', type: 'TRUCK / FUEL', status: 'AUTHORIZED' },
  { id: '222-30', gate: 'GATE 02', time: '14:52:18', rfid: '900909009', driver: 'ANTON RUMANTO', type: 'SEDAN / CIVILIAN', status: 'DENIED' },
  { id: '229-12', gate: 'GATE 01', time: '14:45:10', rfid: '88778799', driver: 'ANTON RUMANTO', type: 'TRUCK / FUEL', status: 'AUTHORIZED' },
  { id: '229-13', gate: 'GATE 05', time: '14:46:12', rfid: '88778799', driver: 'ANTON RUMANTO', type: 'TRUCK / FUEL', status: 'AUTHORIZED' },
  { id: '229-14', gate: 'GATE 06', time: '14:48:05', rfid: '88778799', driver: 'ANTON RUMANTO', type: 'TRUCK / FUEL', status: 'AUTHORIZED' },
  { id: '229-15', gate: 'GATE 04', time: '14:50:30', rfid: '88778799', driver: 'ANTON RUMANTO', type: 'TRUCK / FUEL', status: 'AUTHORIZED' },
  { id: '229-16', gate: 'GATE 01', time: '14:55:00', rfid: '88778799', driver: 'ANTON RUMANTO', type: 'TRUCK / FUEL', status: 'AUTHORIZED' },
]

export default function Dashboard({ onNavigate, theme, onToggleTheme, onLogout }) {
  const [showManualGate, setShowManualGate] = useState(false)
  const [gateStep, setGateStep] = useState('slider') // 'slider' | 'loading' | 'reason' | 'done'
  const [openingReason, setOpeningReason] = useState('')
  const [sliderPos, setSliderPos] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sliderTrackRef = useRef(null)
  const sliderThumbRef = useRef(null)
  const dragStartXRef = useRef(0)
  const dragStartPosRef = useRef(0)

  const [isGateDropdownOpen, setIsGateDropdownOpen] = useState(false)
  const [selectedGates, setSelectedGates] = useState(['Gate 02', 'Gate 04'])
  const gatesList = ['Gate 01', 'Gate 02', 'Gate 03', 'Gate 04', 'Gate 05', 'Gate 06']
  
  const historyData = [
    { date: '2023-10-24', time: '09:12:44', reason: 'Ada Tamu dari luar kota' },
    { date: '2023-10-24', time: '09:08:12', reason: 'Perintah atasan' },
    { date: '2023-10-24', time: '08:55:01', reason: 'Ada Teknisi service AC' },
  ]

  const toggleGateSelection = (gate) => {
    if (selectedGates.includes(gate)) {
      setSelectedGates(selectedGates.filter(g => g !== gate))
    } else {
      setSelectedGates([...selectedGates, gate])
    }
  }

  const openModal = () => {
    setGateStep('slider')
    setSliderPos(0)
    setOpeningReason('')
    setShowManualGate(true)
  }

  const closeModal = () => {
    setShowManualGate(false)
    setTimeout(() => {
      setGateStep('slider')
      setSliderPos(0)
      setOpeningReason('')
    }, 300)
  }

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDragging || !sliderTrackRef.current || !sliderThumbRef.current) return;
      const trackRect = sliderTrackRef.current.getBoundingClientRect();
      const thumbWidth = sliderThumbRef.current.offsetWidth;
      const maxPos = trackRect.width - thumbWidth;
      
      const delta = e.clientX - dragStartXRef.current;
      let newPos = dragStartPosRef.current + delta;
      if (newPos < 0) newPos = 0;
      if (newPos > maxPos) newPos = maxPos;
      
      setSliderPos(newPos);
      
      if (newPos >= maxPos) {
        setIsDragging(false);
        setGateStep('loading');
        setTimeout(() => {
          setSliderPos(0);
          setGateStep('reason');
        }, 2000);
      }
    };

    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setSliderPos(0);
      }
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging]);

  return (
    <div className="dashboard-page min-h-screen bg-[#121416] text-white flex flex-col font-display h-screen overflow-hidden">
      {/* Header */}
      <Header activePage="dashboard" onNavigate={onNavigate} theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-2 p-2 sm:p-3 min-h-0">

        {/* Left: Camera Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-rows-3 gap-2 sm:gap-3 min-h-0 overflow-y-auto lg:overflow-hidden no-scrollbar">
          {cameras.map((cam, idx) => (
            <div key={idx} className="relative bg-[#282A2C] flex items-center justify-center overflow-hidden min-h-[160px] md:min-h-0" style={{ border: `1px solid ${theme === 'light' ? '#D8D8D8' : '#47483C'}` }}>
              {cam.img ? (
                <img src={cam.img} alt={cam.name} className={`absolute inset-0 w-full h-full object-cover ${theme === 'light' ? 'opacity-100' : 'mix-blend-screen opacity-90'}`} />
              ) : (
                <div className="z-10 text-sm sm:text-lg lg:text-xl font-bold tracking-[0.25em] text-[#ff4b4b] drop-shadow-[0_0_8px_rgba(255,75,75,0.4)]">
                  OFFLINE - CAM-04
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d12] via-transparent to-[#0a0d12]/40 pointer-events-none" />

              {/* Top Left Status */}
              <img src={lconLive} alt="Live" className="absolute top-2 left-2 sm:top-3 sm:left-3 h-4 sm:h-[1.1rem] opacity-90" />

              {/* Top Right Cam ID */}
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[8px] sm:text-[9px] font-black tracking-[0.2em] uppercase" style={{ color: '#C3CC8CCC' }}>
                {cam.camId}
              </div>

              {/* Bottom Left Gate Name */}
              <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-[#0a0d12]/80 border-l-2 border-[#2EAFF9] px-2 py-1 sm:px-2.5 sm:py-1.5 backdrop-blur-md">
                <span className={`text-[9px] sm:text-[11px] font-bold tracking-wider ${theme === 'light' ? 'text-[#E2E2E5]' : 'text-slate-200'}`}>
                  {cam.name}
                </span>
              </div>

              {/* Bottom Right Coords */}
              <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 text-[8px] sm:text-[9px] font-bold tracking-[0.15em] text-slate-500 uppercase">
                {cam.coords}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Activity Report */}
        <div className={`w-full lg:w-[320px] xl:w-[360px] border ${theme === 'light' ? 'border-[#D8D8D8]' : 'border-[#47483C]'} bg-[#1E2022] flex flex-col shrink-0 min-h-[300px] lg:min-h-0 overflow-hidden`}>
          {/* Header */}
          <div className={`h-14 flex items-center justify-between px-4 border-b ${theme === 'light' ? 'border-[#D8D8D8]' : 'border-[#47483C]'} shrink-0 bg-transparent`}>
            <div className={`flex items-center gap-2.5 ${theme === 'light' ? 'text-[#0C5F9A]' : 'text-[#FFE2AB]'}`}>
              {theme === 'light' ? (
                <img src={activitiIconLight} alt="Activity" className="w-[18px] h-[18px]" />
              ) : (
                <img src={activitiIcon} alt="Activity" className="w-[18px] h-[18px]" />
              )}
              <h2 className="text-[13px] font-medium tracking-[0.15em] uppercase">
                ACTIVITY REPORT
              </h2>
            </div>
            <button 
              onClick={openModal}
              className={`bg-[#2EAFF9] hover:bg-[#1f9beb] ${theme === 'light' ? 'text-[#FAFAFA]' : 'text-[#0a0d14]'} text-[10px] font-black px-3 py-1.5 rounded tracking-widest uppercase transition-colors`}
            >
              MANUAL GATE
            </button>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            {activities.map((act, idx) => (
              <div key={idx} className={`px-1.5 py-0.5 sm:px-2 sm:py-1 ${theme === 'light' ? 'bg-[#f1f1f1]' : 'bg-[#1E2022]'}`}>
                <div className={`p-2 sm:p-2.5 border transition-colors ${act.status === 'DENIED' ? (theme === 'light' ? 'bg-[#93000A] border-[#FFB4AB]' : 'bg-[#93000A33] border-[#FFB4AB]') : theme === 'light' ? 'bg-[#FAFAFA] border-[#D8D8D8]' : 'bg-[#282A2C] border-[#47483C]'}`}>
                  <div className="flex justify-between items-start mb-1.5">
                    <div className={`px-1.5 py-0.5 text-[8px] font-bold tracking-widest rounded-sm border ${act.status === 'DENIED' ? 'bg-[#FFB4AB1A] border-[#FFB4AB33] text-[#FFB4AB]' : theme === 'light' ? 'bg-[#BCCBB11A] border-[#BCCBB133] text-[#0C5F9A]' : 'bg-[#BCCBB11A] border-[#BCCBB133] text-[#2EAFF9]'}`}>
                      {act.gate}
                    </div>
                    <div className={`text-[9px] font-medium tracking-wider ${act.status === 'DENIED' ? 'text-[#FFB4AB]' : 'text-slate-400'}`}>
                      {act.time}
                    </div>
                  </div>

                  <div className={`text-[18px] sm:text-[20px] font-black leading-none mb-1.5 tracking-tight ${act.status === 'DENIED' ? 'text-[#FFB4AB]' : theme === 'light' ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                    {act.id}
                  </div>

                  <div className={`text-[9px] font-bold tracking-wide mb-0.5 uppercase ${act.status !== 'DENIED' ? 'text-slate-100' : ''}`} style={act.status === 'DENIED' ? { color: '#DFE2EB' } : {}}>
                    RFID: {act.rfid} <span className={`font-black px-1 ${act.status !== 'DENIED' ? 'text-slate-400' : ''}`} style={act.status === 'DENIED' ? { color: 'rgba(223, 226, 235, 0.6)' } : {}}>•</span> DRIVER: {act.driver}
                  </div>
                  
                  <div className={`text-[8px] font-medium tracking-wider mb-2.5 uppercase ${act.status !== 'DENIED' ? 'text-slate-400' : ''}`} style={act.status === 'DENIED' ? { color: '#C5C8BE' } : {}}>
                    TYPE: {act.type}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className={`text-[9px] sm:text-[10px] font-black tracking-wider uppercase ${act.status === 'DENIED' ? 'text-[#FFB4AB]' : theme === 'light' ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                      {act.status}
                    </div>
                    {act.status === 'DENIED' && (
                      <div className="flex items-center gap-1.5 text-[8px] font-black text-[#FFB4AB] tracking-wider uppercase">
                        WARNING <AlertCircle size={10} strokeWidth={2} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Manual Gate Modal */}
      {showManualGate && (
        <div className="fixed inset-0 bg-[#0a0d12]/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`w-full max-w-[480px] 2xl:max-w-[560px] min-h-[360px] 2xl:min-h-[415px] h-auto flex flex-col shadow-2xl overflow-hidden ${theme === 'light' ? (gateStep === 'history' ? 'bg-[#F7F8FC]' : 'bg-[#FFFFFF]') : 'bg-[#222426]'}`}>
            {/* Modal Header */}
            <div className={`flex justify-between items-center px-6 py-5 2xl:px-8 2xl:py-6 shrink-0 ${theme === 'light' ? 'bg-[#FFFFFF]' : ''}`}>
              <h2 className={`text-[15px] 2xl:text-[17px] font-medium tracking-[0.25em] uppercase ${theme === 'light' ? 'text-[#383735]' : 'text-[#D4AF37]'}`}>
                MANUAL GATE CONTROL
              </h2>
              <img 
                src={theme === 'light' ? historymangateLight : historymangate} 
                alt="History" 
                onClick={() => setGateStep('history')}
                className="w-5 h-5 2xl:w-6 2xl:h-6 cursor-pointer hover:opacity-80 transition-opacity" 
              />
            </div>
            <div className={`w-full ${theme === 'light' ? 'h-[1.96px] bg-[#D8D8D8]' : 'h-px bg-[#D4AF37]/30'}`} />

            {/* STEP: SLIDER */}
            {gateStep === 'slider' && (
              <div className="flex-1 flex flex-col px-6 py-6 2xl:px-8 2xl:py-8 justify-between">
                <div>
                  {/* Choose Gate */}
                  <div className="flex flex-col gap-2 mb-6 relative">
                  <label className={`text-[10px] 2xl:text-[11px] font-bold tracking-widest uppercase ${theme === 'light' ? 'text-[#383735]' : 'text-[#D4AF37]'}`}>
                    CHOOSE GATE
                  </label>
                  <div 
                    className={`flex justify-between items-center border-b pb-2 cursor-pointer group ${theme === 'light' ? 'border-[#D8D8D8]' : 'border-[#444841]'}`}
                    onClick={() => setIsGateDropdownOpen(!isGateDropdownOpen)}
                  >
                    <span className="text-[#2EAFF9] text-[13px] 2xl:text-[14px] font-medium tracking-wide">
                      {selectedGates.length > 0 ? selectedGates.join(', ') : 'Select Gate'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 group-hover:text-slate-300 transition-colors ${isGateDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Dropdown Menu */}
                  {isGateDropdownOpen && (
                    <div className={`absolute top-full left-0 w-full mt-1 border shadow-2xl z-50 flex flex-col ${theme === 'light' ? 'bg-white border-[#D8D8D8]' : 'bg-[#1b2027] border-[#444841]'}`}>
                      {gatesList.map((gate) => (
                        <div 
                          key={gate}
                          onClick={() => toggleGateSelection(gate)}
                          className="flex justify-between items-center px-4 py-1.5 hover:bg-white/5 cursor-pointer transition-colors shrink-0"
                        >
                          <span className={`text-[12px] 2xl:text-[13px] ${theme === 'light' ? 'text-[#383735]' : 'text-white'}`}>{gate}</span>
                          <div className={`w-[18px] h-[18px] 2xl:w-[20px] 2xl:h-[20px] rounded-[3px] flex items-center justify-center transition-colors shrink-0 ${selectedGates.includes(gate) ? 'bg-[#2EAFF9]' : 'border-[2px] border-[#5c6068]'}`}>
                            {selectedGates.includes(gate) && (
                              <svg className="w-3 h-3 2xl:w-3.5 2xl:h-3.5 text-[#0a0d14]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Slider */}
                <div
                  style={{
                    background: theme === 'light' ? '#FFFFFF' : '#0B1326CC',
                    border: theme === 'light' ? '6px solid #D8D8D8' : '1.96px solid #98CBFF33',
                    boxShadow: theme === 'light' ? 'none' : '0px 0px 98.16px 0px #005D9433',
                    backdropFilter: theme === 'light' ? 'none' : 'blur(47.115478515625px)',
                    WebkitBackdropFilter: theme === 'light' ? 'none' : 'blur(47.115478515625px)',
                  }}
                  className={`mb-6 ${theme === 'light' ? 'p-0' : 'p-3 2xl:p-3.5'}`}
                >
                  <div ref={sliderTrackRef} className={`relative flex items-center overflow-hidden ${theme === 'light' ? 'bg-white h-[108px] 2xl:h-[124px]' : 'bg-[#070d1a] h-[84px] 2xl:h-[96px]'}`}>
                    <div
                      ref={sliderThumbRef}
                      onPointerDown={(e) => { 
                        e.preventDefault();
                        dragStartXRef.current = e.clientX;
                        dragStartPosRef.current = sliderPos;
                        setIsDragging(true); 
                      }}
                      style={{ transform: `translateX(${sliderPos}px)` }}
                      className={`h-full flex items-center justify-center shrink-0 z-20 cursor-grab active:cursor-grabbing absolute left-0 ${theme === 'light' ? 'bg-[#0C5F9A] w-[124px] 2xl:w-[156px]' : 'bg-[#2EAFF9] w-[96px] 2xl:w-[120px]'}`}
                    >
                      {theme === 'light' ? (
                        <ChevronsRight className="w-5 h-5 2xl:w-6 2xl:h-6" color="white" strokeWidth={2.5} />
                      ) : (
                        <ChevronRight className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#0a0d14]" strokeWidth={2.5} />
                      )}
                    </div>
                    <div className={`absolute inset-y-0 flex items-center justify-center pointer-events-none z-10 ${theme === 'light' ? 'left-[124px] 2xl:left-[156px] right-[60px] 2xl:right-[80px]' : 'inset-x-0'}`}>
                      <span className={`text-[10px] 2xl:text-[11px] font-medium tracking-[0.2em] uppercase ${theme === 'light' ? 'text-[#383735]' : 'text-[#2d3f5a] pl-20 2xl:pl-24'}`}>
                        {theme === 'light' ? 'UNTUK MEMBUKA GERBANG' : 'GESER UNTUK MEMBUKA GERBANG'}
                      </span>
                    </div>
                    <div className={`absolute flex items-center z-10 ${theme === 'light' ? 'right-6 2xl:right-8' : 'right-4 2xl:right-5'}`}>
                      <img src={progressVisuals} alt="progress" className={`h-5 2xl:h-6 ${theme === 'light' ? 'opacity-40 grayscale' : 'opacity-60'}`} />
                    </div>
                  </div>
                </div>
                </div>

                <button onClick={closeModal} className={`text-[10px] 2xl:text-[11px] font-bold tracking-widest uppercase transition-colors self-center mt-auto mb-2 2xl:mb-4 ${theme === 'light' ? 'text-[#383735] hover:opacity-70' : 'text-white hover:text-slate-300'}`}>
                  CLOSE
                </button>
              </div>
            )}

            {/* STEP: LOADING */}
            {gateStep === 'loading' && (
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 2xl:px-8 2xl:py-10">
                {/* Spinner */}
                <div className="mb-12 2xl:mb-16">
                  <div className={`w-12 h-12 2xl:w-14 2xl:h-14 border-[4px] rounded-full animate-spin ${theme === 'light' ? 'border-[#E5E7EB] border-t-[#0C5F9A] border-l-[#0C5F9A]' : 'border-white/10 border-t-[#2EAFF9] border-l-[#2EAFF9]'}`} />
                </div>

                {/* Slider fully blue */}
                <div
                  style={{
                    background: theme === 'light' ? '#FFFFFF' : '#0B1326CC',
                    border: theme === 'light' ? '6px solid #D8D8D8' : '1.96px solid #98CBFF33',
                    boxShadow: theme === 'light' ? 'none' : '0px 0px 98.16px 0px #005D9433',
                    backdropFilter: theme === 'light' ? 'none' : 'blur(47.115478515625px)',
                    WebkitBackdropFilter: theme === 'light' ? 'none' : 'blur(47.115478515625px)',
                  }}
                  className={`w-full ${theme === 'light' ? 'p-0' : 'p-3 2xl:p-3.5'}`}
                >
                  <div className={`relative flex items-center overflow-hidden w-full ${theme === 'light' ? 'h-[108px] 2xl:h-[124px] bg-[#0C5F9A]' : 'h-[84px] 2xl:h-[96px] bg-[#2EAFF9]'}`}>
                    <div className="absolute inset-0 flex items-center justify-start pl-8 2xl:pl-10 pointer-events-none z-10">
                    </div>
                    <div className="absolute right-5 2xl:right-6 flex items-center pointer-events-none z-10">
                      {theme === 'light' ? (
                        <ChevronsRight className="w-5 h-5 2xl:w-6 2xl:h-6" color="white" strokeWidth={2.5} />
                      ) : (
                        <ChevronRight className="w-5 h-5 2xl:w-6 2xl:h-6 text-[#0a0d14]" strokeWidth={2.5} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP: REASON FORM */}
            {gateStep === 'reason' && (
              <div className="flex-1 flex flex-col items-center px-6 py-4 2xl:px-8 2xl:py-5">
                {/* Checkmark */}
                <svg className={`w-10 h-10 2xl:w-12 2xl:h-12 mb-2 ${theme === 'light' ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className={`text-[13px] 2xl:text-[15px] font-black tracking-wide mb-4 uppercase ${theme === 'light' ? 'text-[#383735]' : 'text-white'}`}>
                  THE GATE IS OPEN
                </p>

                {/* Opening Reason Box */}
                <div
                  style={{
                    background: theme === 'light' ? '#FAFAFA' : '#2D344999',
                    border: theme === 'light' ? '1.96px solid #D8D8D8' : '1.96px solid #41475033',
                    boxShadow: theme === 'light' ? 'none' : '0px 0px 98.16px 0px #005D9433',
                    backdropFilter: theme === 'light' ? 'blur(23.5577392578125px)' : 'blur(23.5577392578125px)',
                    WebkitBackdropFilter: theme === 'light' ? 'blur(23.5577392578125px)' : 'blur(23.5577392578125px)',
                  }}
                  className="w-full p-3 mb-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-[9px] 2xl:text-[10px] font-bold tracking-[0.25em] uppercase ${theme === 'light' ? 'text-[#F59E0B]' : 'text-[#2EAFF9]'}`}>OPENING REASON</span>
                    {theme === 'light' ? (
                      <img src={opnreasonLight} alt="note" className="w-3 h-3 2xl:w-4 2xl:h-4" />
                    ) : (
                      <img src={opnreason} alt="note" className="w-3 h-3 2xl:w-4 2xl:h-4 opacity-80" />
                    )}
                  </div>
                  <textarea
                    value={openingReason}
                    onChange={(e) => setOpeningReason(e.target.value)}
                    placeholder="Enter reason"
                    rows={2}
                    style={theme === 'light' ? { border: '1px solid #D8D8D8' } : {}}
                    className={`w-full text-[12px] 2xl:text-[13px] font-medium placeholder:italic resize-none outline-none px-3 py-2.5 ${theme === 'light' ? 'bg-[#FFFFFF] text-[#383735] placeholder:text-slate-400' : 'bg-[#0B1326] text-white placeholder:text-slate-600'}`}
                  />
                </div>

                {/* Save button */}
                <button
                  onClick={() => setGateStep('done')}
                  style={{ color: theme === 'light' ? '#FFFFFF' : '#0a0d14' }}
                  className={`font-black text-[12px] 2xl:text-[13px] tracking-widest uppercase py-3 2xl:py-4 px-14 2xl:px-16 flex items-center justify-center gap-2.5 transition-colors rounded-[2px] ${theme === 'light' ? 'bg-[#0C5F9A] hover:bg-[#0a4d7a]' : 'bg-[#2EAFF9] hover:bg-[#1f9beb]'}`}
                >
                  <svg className="w-4 h-4 2xl:w-5 2xl:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  SAVE
                </button>
              </div>
            )}

            {/* STEP: DONE */}
            {gateStep === 'done' && (
              <div className="flex flex-col items-center px-6 py-10 2xl:px-8 2xl:py-14">
                {/* Checkmark */}
                <svg className={`w-14 h-14 2xl:w-16 2xl:h-16 mb-4 ${theme === 'light' ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <p className={`text-[15px] 2xl:text-[17px] font-black tracking-wide mb-8 uppercase ${theme === 'light' ? 'text-[#383735]' : 'text-white'}`}>
                  THE GATE IS OPEN
                </p>
                <button
                  onClick={closeModal}
                  className={`text-[10px] 2xl:text-[11px] font-bold tracking-widest uppercase px-10 py-3 transition-colors ${theme === 'light' ? 'border border-[#D8D8D8] text-[#383735] hover:bg-slate-50' : 'border border-white/30 text-white hover:bg-white/5'}`}
                >
                  CLOSE
                </button>
              </div>
            )}

            {/* STEP: HISTORY */}
            {gateStep === 'history' && (
              <div className="flex-1 flex flex-col px-6 2xl:px-8 pb-3 2xl:pb-4">
                <div className="py-1.5 2xl:py-2 shrink-0">
                  <h3 className={`text-[15px] 2xl:text-[16px] font-bold tracking-wide ${theme === 'light' ? 'text-[#383735]' : 'text-white'}`}>History</h3>
                </div>

                <div className={`flex flex-col w-full flex-1 ${theme === 'light' ? 'bg-[#FFFFFF] border border-[#D8D8D8]' : 'bg-[#2a2d37]'}`}>
                  <div className={`flex px-4 py-2.5 2xl:px-5 2xl:py-3 border-b shrink-0 ${theme === 'light' ? 'border-[#D8D8D8]' : 'border-[#D4AF37]/20'}`}>
                    <div className={`w-[45%] font-bold text-[11px] 2xl:text-[12px] tracking-wide ${theme === 'light' ? 'text-[#383735]' : 'text-slate-200'}`}>Date / Time</div>
                    <div className={`w-[55%] font-bold text-[11px] 2xl:text-[12px] tracking-wide ${theme === 'light' ? 'text-[#383735]' : 'text-slate-200'}`}>Alasan</div>
                  </div>
                  
                  <div className="flex flex-col flex-1 pt-1 pb-3 2xl:pb-4">
                    {historyData.map((item, idx) => (
                      <div key={idx} className="flex px-4 py-2.5 2xl:py-3.5 2xl:px-5 border-b-0">
                        <div className="w-[45%] flex flex-col gap-0.5">
                          <span className={`text-[12px] 2xl:text-[13px] ${theme === 'light' ? 'text-[#383735]' : 'text-white/90'}`}>{item.date}</span>
                          <span className={`text-[10px] 2xl:text-[11px] ${theme === 'light' ? 'text-[#383735]' : 'text-slate-400'}`}>{item.time}</span>
                        </div>
                        <div className="w-[55%] flex items-start pt-0.5">
                          <span className={`text-[12px] 2xl:text-[13px] ${theme === 'light' ? 'text-[#383735]' : 'text-white/90'}`}>{item.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 2xl:pt-5 flex justify-between items-center shrink-0">
                  <div className={`flex items-center gap-2.5 2xl:gap-3 text-[12px] 2xl:text-[13px] font-bold ${theme === 'light' ? 'text-[#737373]' : 'text-white'}`}>
                    <div className="w-6 h-6 2xl:w-[26px] 2xl:h-[26px] flex items-center justify-center cursor-pointer">
                      <ChevronLeft className={`w-4 h-4 2xl:w-[18px] 2xl:h-[18px] ${theme === 'light' ? 'text-[#D8D8D8]' : 'text-slate-500'}`} strokeWidth={2.5} />
                    </div>
                    <div className={`w-7 h-7 2xl:w-8 2xl:h-8 flex items-center justify-center rounded-[4px] cursor-pointer ${theme === 'light' ? 'bg-[#0C5F9A]' : 'bg-[#2EAFF9]'}`} style={{ color: theme === 'light' ? '#FFFFFF' : '#0a0d14' }}>1</div>
                    <div className={`w-7 h-7 2xl:w-8 2xl:h-8 flex items-center justify-center cursor-pointer transition-colors ${theme === 'light' ? 'hover:text-[#0C5F9A]' : 'hover:text-[#2EAFF9]'}`}>2</div>
                    <div className={`w-7 h-7 2xl:w-8 2xl:h-8 flex items-center justify-center cursor-pointer transition-colors ${theme === 'light' ? 'hover:text-[#0C5F9A]' : 'hover:text-[#2EAFF9]'}`}>3</div>
                    <div className="w-7 h-7 2xl:w-8 2xl:h-8 flex items-center justify-center cursor-pointer">
                      <ChevronRight className={`w-4 h-4 2xl:w-[18px] 2xl:h-[18px] ${theme === 'light' ? 'text-[#0C5F9A]' : 'text-white'}`} strokeWidth={2.5} />
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className={`border text-[9px] 2xl:text-[10px] font-bold tracking-widest uppercase px-5 py-1.5 2xl:px-6 2xl:py-2 rounded-[2px] transition-colors ${theme === 'light' ? 'border-[#D8D8D8] text-[#383735] bg-white hover:bg-slate-50' : 'border-[#444841] text-white/90 hover:bg-white/5'}`}
                  >
                    CLOSE
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  )
}
