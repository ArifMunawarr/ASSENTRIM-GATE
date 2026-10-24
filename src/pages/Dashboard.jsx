import React, { useState, useRef, useEffect } from 'react'
import Header from '../components/Header'
import { getVisualRect } from '../utils/viewport'
import { AlertTriangle, ChevronDown, ChevronRight, ChevronsRight, ChevronLeft, X } from 'lucide-react'
import lconLive from '../assets/lconlive.svg'
import historymangate from '../assets/historymangate.svg'
import historymangateLight from '../assets/historymangate(1).svg'
import progressVisuals from '../assets/Progress_Visuals.svg'
import opnreason from '../assets/opnreason.svg'
import opnreasonLight from '../assets/opnreason(1).svg'
import activitiIcon from '../assets/activitiIcon.svg'
import activitiIconLight from '../assets/activitiIcon(1).svg'
import mainGateImage from '../assets/das1.png'
import vehicleExitImage from '../assets/das2.png'
import westGateImage from '../assets/das3.png'
import fifthGateImage from '../assets/das5.png'
import WebRtcPlayer from '../components/WebRtcPlayer'

const gates = [
  {
    id: 1,
    name: 'GATE 01 - MAIN GATE',
    camera: { id: 1, img: mainGateImage, streamUrl: import.meta.env.VITE_CAM1_WEBRTC_URL || 'http://10.70.10.10:8889/gate-cam/whep', camId: 'CAM-01', location: 'MN-72', coords: '44.02°N 12.33°E' },
  },
  {
    id: 2,
    name: 'GATE 02 - VEHICLE EXIT',
    camera: { id: 2, img: vehicleExitImage, streamUrl: import.meta.env.VITE_CAM2_WEBRTC_URL || null, camId: 'CAM-02', location: 'SE-41', coords: 'HD-RECON-7' },
  },
  {
    id: 3,
    name: 'GATE 03 - GATE WEST',
    camera: { id: 3, img: westGateImage, streamUrl: import.meta.env.VITE_CAM3_WEBRTC_URL || null, camId: 'CAM-03', location: 'W-09', coords: 'THERMAL-LINK' },
  },
  {
    id: 4,
    name: 'GATE 04 - GATE EAST',
    camera: { id: 4, streamUrl: import.meta.env.VITE_CAM4_WEBRTC_URL || null, camId: 'CAM-04', location: 'W-09', coords: 'THERMAL-LINK' },
  },
  {
    id: 5,
    name: 'GATE 05 - MAIN GATE',
    camera: { id: 5, img: fifthGateImage, streamUrl: import.meta.env.VITE_CAM5_WEBRTC_URL || null, camId: 'CAM-05', location: 'INT-01', coords: '44.02°N 12.33°E' },
  },
]

function CameraStatus({ status, className = '', compact = false }) {
  if (status === 'live') {
    return <img src={lconLive} alt="LIVE" className={`${compact ? 'block h-[calc(15*var(--dashboard-unit))] w-[calc(40*var(--dashboard-unit))]' : ''} ${className}`} />
  }

  return (
    <span className={`inline-flex items-center border border-[#C3CC8C]/40 bg-black/80 font-mono font-bold tracking-[0.12em] ${compact ? 'gap-[calc(4*var(--dashboard-unit))] px-[calc(4*var(--dashboard-unit))] py-[calc(2*var(--dashboard-unit))] text-[length:calc(6*var(--dashboard-unit))] leading-[calc(10*var(--dashboard-unit))]' : 'gap-1.5 px-2 py-1 text-[9px] sm:text-[10px]'} ${status === 'offline' ? 'text-[#FF9A9A]' : 'text-[#C3CC8C]'} ${className}`}>
      <span className={`rounded-full ${compact ? 'h-[calc(4*var(--dashboard-unit))] w-[calc(4*var(--dashboard-unit))]' : 'h-1.5 w-1.5'} ${status === 'offline' ? 'bg-[#FF9A9A]' : 'bg-[#C3CC8C]'}`} />
      {status === 'offline' ? 'OFFLINE' : 'CONNECTING'}
    </span>
  )
}

function CameraFeed({ camera, gateName, theme, onExpand, onStream, onStatusChange, status }) {
  const isOffline = camera.offline || (!camera.streamUrl && !camera.img)
  const expandedCamera = { ...camera, name: gateName }
  const liveStreamRef = useRef(null)

  const handleStream = (stream) => {
    liveStreamRef.current = stream
    onStream(camera.id, stream)
  }

  return (
    <button
      type="button"
      onClick={() => onExpand({ ...expandedCamera, mediaStream: status === 'live' ? liveStreamRef.current : null })}
      aria-label={`Open ${camera.camId} - ${gateName}`}
      className="group relative block min-h-0 min-w-0 overflow-hidden border border-[color:var(--dashboard-border)] bg-black text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-[#2EAFF9] [&_video]:object-cover max-[541px]:aspect-[2.2]"
    >
      {!isOffline && (
        <WebRtcPlayer
          streamUrl={camera.streamUrl}
          fallbackImg={camera.img}
          alt={`${gateName} ${camera.camId}`}
          theme={theme}
          onStream={handleStream}
          onStatusChange={(nextStatus) => onStatusChange(camera.id, nextStatus)}
          className="absolute inset-0 h-full w-full object-fill"
        />
      )}

      {(isOffline || (status === 'offline' && !camera.img)) && (
        <div className="absolute inset-0 z-[1] flex items-center justify-center text-[length:calc(16*var(--dashboard-unit))] font-bold tracking-[calc(1.5*var(--dashboard-unit))] text-[#ff9a9a]">
          OFFLINE - {camera.camId}
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0_/_35%),rgb(0_0_0_/_30%)_70%,rgb(0_0_0_/_60%))]" />

      <div className="pointer-events-none absolute left-[calc(10*var(--dashboard-unit))] top-[calc(9*var(--dashboard-unit))]">
        <CameraStatus status={status} compact />
      </div>

      <div className="pointer-events-none absolute right-[calc(10*var(--dashboard-unit))] top-[calc(10*var(--dashboard-unit))] bg-black/65 px-[calc(4*var(--dashboard-unit))] py-[calc(1*var(--dashboard-unit))] text-[length:calc(6*var(--dashboard-unit))] leading-[1.2] text-[#a4a96c]">
        {camera.camId} / {camera.location}
      </div>
      <h2 className="pointer-events-none absolute bottom-[calc(10*var(--dashboard-unit))] left-[calc(10*var(--dashboard-unit))] max-w-[calc(100%-20*var(--dashboard-unit))] truncate border-l border-[color:var(--dashboard-accent)] bg-black/80 px-[calc(5*var(--dashboard-unit))] py-[calc(2*var(--dashboard-unit))] [font-family:Arial,sans-serif] text-[length:calc(10*var(--dashboard-unit))] font-normal leading-[1.2] text-[#e2e2e5]">{gateName}</h2>
      {camera.coords && <div className="pointer-events-none absolute bottom-[calc(11*var(--dashboard-unit))] right-[calc(10*var(--dashboard-unit))] text-[length:calc(6*var(--dashboard-unit))] leading-[1.2] text-[color:var(--dashboard-muted)] max-md:hidden">{camera.coords}</div>}
    </button>
  )
}

const activities = [
  { id: '229-87', gate: 'GATE 01', time: '14:55:02', rfid: '900779009', driver: 'ANTON RUMANTO', type: 'MINIBUS', status: 'AUTHORIZED' },
  { id: '222-30', gate: 'GATE 02', time: '14:52:18', rfid: '900909009', driver: 'MARCUS VANCE', type: 'SEDAN', status: 'DENIED' },
  { id: '229-12', gate: 'GATE 03', time: '14:48:44', rfid: '88778799', driver: 'ANTON RUMANTO', type: 'TRUCK', status: 'AUTHORIZED' },
  { id: '229-12', gate: 'GATE 05', time: '14:45:10', rfid: '88778799', driver: 'ANTON RUMANTO', type: 'TRUCK', status: 'AUTHORIZED' },
  { id: '229-12', gate: 'GATE 01', time: '14:41:25', rfid: '88778799', driver: 'ANTON RUMANTO', type: 'TRUCK / FUEL', status: 'AUTHORIZED' },
  { id: '221-08', gate: 'GATE 04', time: '14:38:19', rfid: '100998871', driver: 'STEVE HARVEY', type: 'VAN', status: 'AUTHORIZED' },
  { id: '222-30', gate: 'GATE 02', time: '14:35:00', rfid: '900909009', driver: 'MARCUS VANCE', type: 'SEDAN', status: 'DENIED' },
]


export default function Dashboard({ onNavigate, theme, onToggleTheme, onLogout }) {
  const [expandedCam, setExpandedCam] = useState(null)
  const [cameraStatuses, setCameraStatuses] = useState({})
  const [showManualGate, setShowManualGate] = useState(false)
  const [gateStep, setGateStep] = useState('slider') // 'slider' | 'loading' | 'reason' | 'done'
  const [openingReason, setOpeningReason] = useState('')
  const [sliderPos, setSliderPos] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const sliderTrackRef = useRef(null)
  const sliderThumbRef = useRef(null)
  const expandedViewRef = useRef(null)
  const dragStartXRef = useRef(0)
  const dragStartPosRef = useRef(0)

  const handleCameraStream = (cameraId, stream) => {
    setExpandedCam((current) => {
      if (!current || current.id !== cameraId || current.mediaStream === stream) return current
      return { ...current, mediaStream: stream }
    })
  }

  const handleCameraStatus = (cameraId, status) => {
    setCameraStatuses((current) => current[cameraId] === status ? current : { ...current, [cameraId]: status })
    if (status === 'offline') {
      setExpandedCam((current) => current?.id === cameraId && current.mediaStream ? { ...current, mediaStream: null } : current)
    }
  }

  const [isGateDropdownOpen, setIsGateDropdownOpen] = useState(false)
  const [selectedGates, setSelectedGates] = useState(['Gate 02', 'Gate 04'])
  const gatesList = gates.map((gate) => `Gate ${String(gate.id).padStart(2, '0')}`)
  
  const historyData = [
    { date: '2023-10-24', time: '09:12:44', reason: 'Guest visit from out of town' },
    { date: '2023-10-24', time: '09:08:12', reason: 'Order from superior' },
    { date: '2023-10-24', time: '08:55:01', reason: 'AC service technician on site' },
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
      const trackRect = getVisualRect(sliderTrackRef.current);
      const thumbRect = getVisualRect(sliderThumbRef.current);
      // Pointer coordinates are visual pixels; translateX uses local CSS pixels.
      const visualScale = thumbRect.width / sliderThumbRef.current.offsetWidth || 1;
      const maxPos = Math.max(0, (trackRect.width - thumbRect.width) / visualScale);
      
      const delta = (e.clientX - dragStartXRef.current) / visualScale;
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

  // Close camera preview with the Escape key
  useEffect(() => {
    if (!expandedCam) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) setExpandedCam(null)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [expandedCam])

  return (
    <div className={`
      flex h-[var(--layout-height)] min-h-[var(--layout-height)] flex-col overflow-hidden
      bg-[var(--dashboard-bg)] [font-family:'Courier_New',monospace] text-white
      [--dashboard-unit:calc(var(--layout-width)/1024)]
      max-md:h-auto max-md:min-h-[100dvh] max-md:overflow-visible max-md:[--dashboard-unit:1px]
      ${theme === 'light'
        ? '[--dashboard-bg:#f4f7fb] [--dashboard-border:#cbd5e1] [--dashboard-accent:#0c5f9a] [--dashboard-muted:#64748b] [--activity-bg:#fff] [--activity-denied-bg:#fff0ef] [--activity-text:#172033] [--activity-warning:#a3262e]'
        : '[--dashboard-bg:#121416] [--dashboard-border:#47483c] [--dashboard-accent:#2eaff9] [--dashboard-muted:#888a86] [--activity-bg:#282a2c] [--activity-denied-bg:#391c1e] [--activity-text:#dfe2eb] [--activity-warning:#ffb4ab]'}
    `}>
      {/* Header */}
      <Header activePage="dashboard" onNavigate={onNavigate} theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout} />

      {/* Main Content */}
      <main className="flex min-h-0 flex-1 gap-[calc(9*var(--dashboard-unit))] py-[calc(13*var(--dashboard-unit))] pl-[calc(19*var(--dashboard-unit))] pr-[calc(11*var(--dashboard-unit))] max-md:flex-col max-md:gap-3 max-md:p-3">
        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-2 grid-rows-3 gap-[calc(5*var(--dashboard-unit))] max-md:flex-none max-md:grid-rows-[repeat(3,170px)] max-md:gap-1.5 max-[541px]:grid-cols-1 max-[541px]:grid-rows-[repeat(5,auto)]" aria-label="5 gate cameras">
          {gates.map((gate) => (
            <CameraFeed
              key={gate.id}
              camera={gate.camera}
              gateName={gate.name}
              theme={theme}
              onExpand={setExpandedCam}
              onStream={handleCameraStream}
              onStatusChange={handleCameraStatus}
              status={gate.camera.streamUrl ? (cameraStatuses[gate.camera.id] || 'connecting') : (gate.camera.img ? 'live' : 'offline')}
            />
          ))}
        </div>

        <aside className="flex min-h-0 w-[calc(234*var(--dashboard-unit))] shrink-0 flex-col overflow-hidden border border-[color:var(--dashboard-border)] bg-[var(--activity-bg)] max-md:max-h-[510px] max-md:w-full" aria-labelledby="activity-report-title">
          <div className={`flex h-[calc(32*var(--dashboard-unit))] shrink-0 items-center justify-between px-[calc(8*var(--dashboard-unit))] max-md:h-11 max-md:px-3 ${theme === 'light' ? 'bg-[#edf2f7]' : 'bg-[#1e2022]'}`}>
            <div className={`flex items-center gap-[calc(5*var(--dashboard-unit))] ${theme === 'light' ? 'text-[color:var(--dashboard-accent)]' : 'text-[#ffe2ab]'}`}>
              <img src={theme === 'light' ? activitiIconLight : activitiIcon} alt="" className="h-[calc(10*var(--dashboard-unit))] w-[calc(8*var(--dashboard-unit))] max-md:h-3.5 max-md:w-3" />
              <h2 id="activity-report-title" className="whitespace-nowrap text-[length:calc(9*var(--dashboard-unit))] font-bold tracking-[calc(0.7*var(--dashboard-unit))] max-md:text-[12px]">ACTIVITY REPORT</h2>
            </div>
            <button type="button" onClick={openModal} className={`h-[calc(16*var(--dashboard-unit))] whitespace-nowrap bg-[var(--dashboard-accent)] px-[calc(8*var(--dashboard-unit))] text-[length:calc(6*var(--dashboard-unit))] font-bold tracking-[calc(0.3*var(--dashboard-unit))] hover:brightness-[1.15] max-md:h-[26px] max-md:text-[9px] ${theme === 'light' ? 'text-[#fff]' : 'text-[#08141d]'}`}>MANUAL GATE</button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {activities.map((act, idx) => (
              <article key={idx} className={`h-[calc(79.5*var(--dashboard-unit))] border-b border-[color:var(--dashboard-border)] p-[calc(8*var(--dashboard-unit))] text-[color:var(--activity-text)] max-md:h-[104px] max-md:px-3 max-md:py-2.5 ${act.status === 'DENIED' ? 'bg-[var(--activity-denied-bg)] [--entry-accent:var(--activity-warning)] [--entry-badge-bg:rgb(255_180_171_/_10%)]' : 'bg-[var(--activity-bg)] [--entry-accent:var(--dashboard-accent)] [--entry-badge-bg:rgb(46_175_249_/_10%)]'}`}>
                <div className="flex items-center justify-between">
                  <span className="bg-[var(--entry-badge-bg)] px-[calc(3*var(--dashboard-unit))] py-[calc(1*var(--dashboard-unit))] text-[length:calc(6*var(--dashboard-unit))] font-bold leading-[calc(8*var(--dashboard-unit))] text-[color:var(--entry-accent)] max-md:text-[9px]">{act.gate}</span>
                  <time className="text-[length:calc(6.5*var(--dashboard-unit))] text-[color:var(--dashboard-muted)] max-md:text-[9px]">{act.time}</time>
                </div>
                <div className="mb-[calc(3*var(--dashboard-unit))] mt-[calc(4*var(--dashboard-unit))] text-[length:calc(13*var(--dashboard-unit))] font-bold leading-none text-[color:var(--entry-accent)] max-md:my-1.5 max-md:text-[18px]">{act.id}</div>
                <div className="whitespace-nowrap text-[length:calc(6.5*var(--dashboard-unit))] font-bold leading-[calc(10*var(--dashboard-unit))] max-md:text-[9px] max-md:leading-[14px]">RFID: {act.rfid} <span className="text-[color:var(--dashboard-muted)]">&bull;</span> DRIVER: {act.driver}</div>
                <div className="whitespace-nowrap text-[length:calc(6.5*var(--dashboard-unit))] font-normal leading-[calc(10*var(--dashboard-unit))] text-[#c5c8be] max-md:text-[9px] max-md:leading-[14px]">TYPE: {act.type}</div>
                <div className="mt-[calc(1*var(--dashboard-unit))] flex items-center justify-between text-[length:calc(6.5*var(--dashboard-unit))] font-bold leading-[calc(9*var(--dashboard-unit))] text-[color:var(--entry-accent)] max-md:mt-1 max-md:text-[9px]">
                  <span>{act.status}</span>
                  {act.status === 'DENIED' && (
                    <span className="flex items-center gap-[calc(2*var(--dashboard-unit))]">WARNING <AlertTriangle aria-hidden="true" className="h-[calc(7*var(--dashboard-unit))] w-[calc(7*var(--dashboard-unit))]" /></span>
                  )}
                </div>
              </article>
            ))}
          </div>
        </aside>
      </main>

      {/* Manual Gate Modal */}
      {showManualGate && (
        <div className="fixed inset-0 bg-[#0a0d12]/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className={`w-full max-w-[480px] 2xl:max-w-[560px] min-h-[min(360px,calc(var(--layout-height)-2rem))] 2xl:min-h-[min(415px,calc(var(--layout-height)-2rem))] max-h-[calc(var(--layout-height)-2rem)] h-auto flex flex-col shadow-2xl overflow-x-hidden overflow-y-auto ${theme === 'light' ? (gateStep === 'history' ? 'bg-[#F7F8FC]' : 'bg-[#FFFFFF]') : 'bg-[#222426]'}`}>
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
                        {theme === 'light' ? 'TO OPEN THE GATE' : 'SLIDE TO OPEN THE GATE'}
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
                    <div className={`w-[55%] font-bold text-[11px] 2xl:text-[12px] tracking-wide ${theme === 'light' ? 'text-[#383735]' : 'text-slate-200'}`}>Reason</div>
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

      {/* Expanded Camera View - Fullscreen */}
      {expandedCam && (
        <div ref={expandedViewRef} className="fixed inset-0 z-[110] bg-black flex items-center justify-center overflow-hidden">
          {!expandedCam.offline && expandedCam.streamUrl ? (
            <WebRtcPlayer
              streamUrl={expandedCam.streamUrl}
              fallbackImg={expandedCam.img}
              mediaStream={expandedCam.mediaStream}
              alt={expandedCam.name}
              theme={theme}
              showControls
              fullscreenTargetRef={expandedViewRef}
              onStream={(stream) => handleCameraStream(expandedCam.id, stream)}
              onStatusChange={(status) => handleCameraStatus(expandedCam.id, status)}
              className="absolute inset-0 w-full h-full object-contain landscape:object-cover"
            />
          ) : expandedCam.img ? (
            <img src={expandedCam.img} alt={expandedCam.name} className="absolute inset-0 w-full h-full object-contain" />
          ) : (
            <div className="z-10 px-4 text-center text-base sm:text-2xl lg:text-4xl font-bold tracking-[0.25em] text-[#ff4b4b] drop-shadow-[0_0_8px_rgba(255,75,75,0.4)]">
              OFFLINE - {expandedCam.camId}
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d12] via-transparent to-[#0a0d12]/40 pointer-events-none" />

          {/* Top Left Status */}
          <CameraStatus
            status={expandedCam.streamUrl ? (cameraStatuses[expandedCam.id] || 'connecting') : (expandedCam.img ? 'live' : 'offline')}
            className="absolute top-3 left-3 sm:top-5 sm:left-6 lg:top-7 lg:left-9 h-5 sm:h-7 lg:h-9 opacity-90"
          />

          {/* Top Right Cam ID + Close */}
          <div className="absolute top-3 right-3 sm:top-5 sm:right-6 lg:top-7 lg:right-9 flex items-center gap-2.5 sm:gap-4 lg:gap-5 max-w-[calc(var(--layout-width)*0.7)]">
            <span
              className="text-[8px] sm:text-[11px] lg:text-[14px] font-black tracking-[0.2em] uppercase truncate"
              style={{ color: '#C3CC8CCC' }}
            >
              {expandedCam.camId}
            </span>
            <button
              onClick={() => setExpandedCam(null)}
              aria-label="Close camera preview"
              className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-[#EF4444] hover:bg-[#dc2626] text-white flex items-center justify-center transition-colors shrink-0"
            >
              <X className="w-4 h-4 lg:w-5 lg:h-5" strokeWidth={3} />
            </button>
          </div>

          {/* Bottom Left Gate Name */}
          <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 lg:bottom-9 lg:left-9 max-w-[calc(var(--layout-width)-1.5rem)] sm:max-w-[calc(var(--layout-width)*0.6)] bg-[#0a0d12]/80 border-l-[3px] border-[#2EAFF9] px-2.5 py-1.5 sm:px-4 sm:py-2.5 backdrop-blur-md">
            <span className={`block truncate text-[11px] sm:text-[16px] lg:text-[22px] xl:text-[26px] font-bold tracking-wider ${theme === 'light' ? 'text-[#E2E2E5]' : 'text-slate-200'}`}>
              {expandedCam.name}
            </span>
          </div>

          {/* Bottom Right Coords */}
          {expandedCam.coords && (
            <div className="hidden sm:block absolute bottom-6 right-6 lg:bottom-9 lg:right-9 text-[11px] lg:text-[13px] font-bold tracking-[0.15em] text-slate-500 uppercase">
              {expandedCam.coords}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
