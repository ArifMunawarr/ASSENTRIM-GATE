import React, { useState } from 'react'
import Header from '../components/Header'
import { Mic, Camera, X, XCircle, CheckCircle2, AlertTriangle, Square, CheckSquare } from 'lucide-react'
import carImage from '../assets/mobil1.png'
import carImage2 from '../assets/mobil2.png'
import driverImage from '../assets/fotdriver.png'
import warningIcon from '../assets/noto_warning.svg'
import tagIcon from '../assets/tagicon.svg'
import delIcon from '../assets/delicon.svg'

export default function OperatorHelpDesk({ onNavigate, theme, onToggleTheme, onLogout }) {
  const [isChecked, setIsChecked] = useState(false)
  const [activeRequestCount, setActiveRequestCount] = useState(5)
  const [selectedGate, setSelectedGate] = useState(1)

  const renderDualManualAuth = () => {
    const isCompact = activeRequestCount >= 3;
    const isExtraCompact = false;
    return (
      <div className={`helpdesk-manual-panel flex-1 bg-[#282A2C] border border-[#444841] flex flex-col shrink-0 rounded-sm min-w-0 min-h-0 overflow-hidden ${isExtraCompact ? 'p-1.5 2xl:p-2' : isCompact ? 'p-2 2xl:p-3' : 'p-2.5 2xl:p-3'}`}>
        <div className={`helpdesk-manual-header border-b border-[#444841]/60 shrink-0 ${isCompact ? 'pb-1 mb-1' : 'pb-1.5 2xl:pb-2 mb-1.5 2xl:mb-2'}`}>
          <h3 className={`helpdesk-manual-title font-black text-[#2EAFF9] tracking-widest uppercase ${isCompact ? 'text-[8px] 2xl:text-[10px]' : 'text-[10px] 2xl:text-[12px]'}`}>MANUAL AUTHORIZATION</h3>
        </div>
        <div className={`helpdesk-manual-content flex flex-col flex-1 min-h-0 ${isCompact ? 'gap-0.5 2xl:gap-1' : 'gap-1 2xl:gap-1.5'}`}>
          <div className={`helpdesk-field-stack flex flex-col ${isCompact ? 'gap-0.5' : 'gap-1 2xl:gap-1.5'}`}>
            <label className={`helpdesk-field-label font-bold text-[#C5C8BE] tracking-widest uppercase ${isCompact ? 'text-[7px] 2xl:text-[8px]' : 'text-[8px] 2xl:text-[10px]'}`}>ALASAN VERIFIKASI MANUAL</label>
            <input type="text" readOnly value="KETIDAKSESUAIAN DATA (PLAT BERBEDA)"
              className={`helpdesk-manual-input w-full bg-[#181C22] border border-[#444841] px-2 text-slate-300 tracking-wide outline-none cursor-default rounded-sm ${isCompact ? 'py-1 text-[8px] 2xl:text-[9px]' : 'py-1.5 2xl:py-2 text-[9px] 2xl:text-[11px]'}`} />
          </div>
          <div className={`helpdesk-field-stack flex flex-col ${isCompact ? 'gap-0.5' : 'gap-1 2xl:gap-1.5'}`}>
            <label className={`helpdesk-field-label font-bold text-[#C5C8BE] tracking-widest uppercase ${isCompact ? 'text-[7px] 2xl:text-[8px]' : 'text-[8px] 2xl:text-[10px]'}`}>BUKTI FOTO DRIVER</label>
            <div className={`helpdesk-photo-row border border-[#444841] px-1.5 py-[2px] 2xl:px-2 2xl:py-[3px] flex items-center gap-1.5 2xl:gap-2 rounded-sm bg-[#262A31] ${isExtraCompact ? 'h-[34px] 2xl:h-[44px]' : isCompact ? 'h-[44px] 2xl:h-[56px]' : 'h-[60px] 2xl:h-[76px]'}`}>
              <button className="helpdesk-photo-thumb w-[74px] 2xl:w-[94px] h-full border-[1.5px] 2xl:border-[2px] border-dashed border-[#444841] bg-[#2E3340]/40 flex items-center justify-center hover:bg-white/5 transition-colors rounded-sm">
                <Camera className="w-[14px] h-[14px] 2xl:w-[16px] 2xl:h-[16px] text-slate-400" strokeWidth={1.5} />
              </button>
              <div className="helpdesk-photo-thumb w-[74px] 2xl:w-[94px] h-full relative border border-[#444841] bg-black rounded-sm">
                <img src={driverImage} alt="Driver" className="w-full h-full object-cover grayscale opacity-90 rounded-sm" />
                <button className={`absolute ${isExtraCompact ? 'top-[1px] right-[1px] w-[8px] h-[8px] 2xl:top-[2px] 2xl:right-[2px] 2xl:w-[10px] 2xl:h-[10px]' : isCompact ? 'top-[2px] right-[2px] w-[10px] h-[10px] 2xl:top-[2px] 2xl:right-[2px] 2xl:w-[12px] 2xl:h-[12px]' : 'top-[2px] right-[2px] w-[12px] h-[12px] 2xl:top-[3px] 2xl:right-[3px] 2xl:w-[14px] 2xl:h-[14px]'} flex items-center justify-center hover:scale-110 transition-transform`}>
                  <img src={delIcon} alt="Delete" className="w-full h-full object-contain" />
                </button>
              </div>
            </div>
          </div>
          <div className={`helpdesk-field-stack flex flex-col ${isCompact ? 'gap-0.5' : 'gap-1 2xl:gap-1.5'}`}>
            <label className={`helpdesk-field-label font-bold text-[#C5C8BE] tracking-widest uppercase ${isCompact ? 'text-[7px] 2xl:text-[8px]' : 'text-[8px] 2xl:text-[10px]'}`}>OPERATOR NOTES</label>
            <textarea placeholder="Input detail pemeriksaan fisik..."
              className={`helpdesk-notes w-full bg-[#181C22] border border-[#444841] px-2 text-slate-300 tracking-wide outline-none resize-none placeholder:text-[#444841] rounded-sm ${isCompact ? 'py-1 h-[28px] 2xl:h-[36px] text-[8px] 2xl:text-[9px]' : 'py-1.5 2xl:py-2 h-[36px] 2xl:h-[48px] text-[9px] 2xl:text-[11px]'}`} />
          </div>
          <div className={`helpdesk-check-row flex items-center gap-1.5 2xl:gap-2 cursor-pointer group shrink-0 px-2 rounded-sm transition-colors ${isExtraCompact ? 'mt-0.5 py-0.5' : isCompact ? 'mt-0.5 py-1' : 'mt-0.5 2xl:mt-1 py-1.5 2xl:py-2'} bg-[#262A31]`}
            style={theme === 'light' ? { border: '1.11px solid #D8D8D8' } : {}}
            onClick={() => setIsChecked(!isChecked)}>
            <div className={`w-3.5 h-3.5 2xl:w-4.5 2xl:h-4.5 flex items-center justify-center transition-colors rounded-[2px] shrink-0 ${isChecked ? (theme === 'light' ? 'bg-white border-[#0C5F9A]' : 'bg-[#181C22] border border-[#2EAFF9]') : (theme === 'light' ? 'bg-white group-hover:border-[#0C5F9A]' : 'bg-[#181C22] border border-[#444841] group-hover:border-[#2EAFF9]')}`}
              style={theme === 'light' ? { border: isChecked ? '1.11px solid #0C5F9A' : '1.11px solid #D8D8D8' } : {}}>
              {isChecked && <CheckSquare className={`w-3 h-3 2xl:w-4 2xl:h-4 ${theme === 'light' ? 'text-[#0C5F9A] bg-white' : 'text-[#2EAFF9] bg-[#181C22]'}`} strokeWidth={2} />}
            </div>
            <span className={`tracking-wide font-normal leading-none pt-[1px] ${isCompact ? 'text-[7px] 2xl:text-[8px]' : 'text-[8px] 2xl:text-[10px]'} ${theme === 'light' ? 'text-[#172033]' : 'text-slate-300'}`}>Sudah dilakukan pengecekan kendaraan</span>
          </div>
        </div>
        <div className={`helpdesk-actions mt-auto shrink-0 bg-[#282A2C] z-10 ${isCompact ? 'pt-1.5' : 'pt-2'}`}>
          <div className="helpdesk-actions-row flex items-center gap-2 2xl:gap-2.5">
            <button className={`helpdesk-action-button flex-1 border-[2.22px] border-[#EF4444] bg-[#262A31] text-[#EF4444] font-bold tracking-wider flex items-center justify-center gap-1.5 2xl:gap-2 uppercase hover:bg-[#EF4444]/10 transition-colors rounded-sm whitespace-nowrap px-2 ${isExtraCompact ? 'h-[22px] 2xl:h-[28px] text-[7px] 2xl:text-[8px]' : isCompact ? 'h-[28px] 2xl:h-[34px] text-[8px] 2xl:text-[10px]' : 'h-[32px] 2xl:h-[40px] text-[8px] 2xl:text-[10px]'}`}>
              <XCircle className="w-3.5 h-3.5 2xl:w-4.5 2xl:h-4.5" strokeWidth={2} />
              TOLAK AKSES
            </button>
            <button className={`helpdesk-action-button flex-1 bg-[#3B82F6] text-[#FAFAFA] font-black tracking-wider flex items-center justify-center gap-1.5 2xl:gap-2 uppercase hover:bg-[#3B82F6]/90 transition-colors shadow-lg shadow-[#3B82F6]/20 rounded-sm whitespace-nowrap px-2 ${isExtraCompact ? 'h-[22px] 2xl:h-[28px] text-[7px] 2xl:text-[8px]' : isCompact ? 'h-[28px] 2xl:h-[34px] text-[8px] 2xl:text-[10px]' : 'h-[32px] 2xl:h-[40px] text-[8px] 2xl:text-[10px]'}`}>
              <CheckCircle2 className="w-3.5 h-3.5 2xl:w-4.5 2xl:h-4.5" strokeWidth={2.5} />
              DIPERSILAHKAN MASUK
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderDualDatabaseRFID = () => {
    const isCompact = activeRequestCount >= 3;
    const isExtraCompact = false;
    return (
      <div className={`flex-1 bg-[#282A2C] border border-[#444841] flex flex-col shrink-0 rounded-sm min-w-0 min-h-0 overflow-hidden ${isExtraCompact ? 'p-1.5 2xl:p-2 pb-[48px] 2xl:pb-[60px]' : isCompact ? 'p-2 2xl:p-3 pb-[56px] 2xl:pb-[72px]' : 'p-3 2xl:p-4 pb-[70px] 2xl:pb-[90px]'}`}>
        <div className={`border-b border-[#444841]/60 shrink-0 ${isCompact ? 'pb-1' : 'pb-1.5 2xl:pb-2'}`}>
          <h3 className={`font-bold text-[#DFE2EB] tracking-widest uppercase ${isCompact ? 'text-[8px] 2xl:text-[10px]' : 'text-[10px] 2xl:text-[12px]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>DATABASE RFID DATA</h3>
        </div>
        <div className="flex flex-col flex-1 min-h-0 relative">
          <div className={`flex flex-col relative bg-[#0A0E14] border-b border-[#444841] flex-1 min-h-0 ${isCompact ? '-mx-2 2xl:-mx-3 px-5 2xl:px-7 pt-2' : '-mx-3 2xl:-mx-4 px-6 2xl:px-8 pt-3.5'}`}>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[inherit]">
              <img src={tagIcon} alt="" className="w-10 h-10 2xl:w-12 2xl:h-12 opacity-20" />
            </div>
            <div className="flex justify-between items-start relative z-10 w-full shrink-0">
              <div className="flex flex-col gap-0.5 2xl:gap-1">
                <span className="text-[7px] 2xl:text-[9px] font-medium text-[#C5C8BE] tracking-widest uppercase">RFID TAG</span>
                <span className={`text-[9px] 2xl:text-[11px] font-medium tracking-wider ${theme === 'light' ? 'text-[#0C5F9A]' : 'text-slate-300'}`}>E280-1105-2000-7451</span>
              </div>
              <div className={`px-2 py-0.5 2xl:px-2.5 2xl:py-1 rounded-sm flex items-center justify-center ${theme === 'light' ? 'bg-[#B1BECB33] border border-transparent' : 'bg-[#2EAFF9]/10 border border-[#2EAFF9]/30'}`}>
                <span className={`text-[7px] 2xl:text-[9px] font-black tracking-wider uppercase ${theme === 'light' ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>MEMBER</span>
              </div>
            </div>
          </div>
          <div className="shrink-0 flex flex-col">
            <div className={`flex justify-between items-center z-10 ${isCompact ? 'py-1' : 'py-1.5 2xl:py-2'}`}>
              <span className={`font-bold text-[#C5C8BE] tracking-widest uppercase ${isCompact ? 'text-[7px] 2xl:text-[8px]' : 'text-[8px] 2xl:text-[10px]'}`}>NOMOR PLAT TERDAFTAR</span>
              <span className={`font-bold text-[#EF4444] tracking-wide uppercase ${isCompact ? 'text-[9px] 2xl:text-[10px]' : 'text-[10px] 2xl:text-[12px]'}`}>B 9999 MIL</span>
            </div>
            <div className="w-full" style={{ borderBottom: theme === 'light' ? '0.64px solid #D8D8D8' : '0.64px solid rgba(68, 72, 65, 0.6)' }}></div>
            <div className={`flex justify-between items-center z-10 ${isCompact ? 'py-1' : 'py-1.5 2xl:py-2'}`}>
              <span className={`font-bold text-[#C5C8BE] tracking-widest uppercase w-1/3 ${isCompact ? 'text-[7px] 2xl:text-[8px]' : 'text-[8px] 2xl:text-[10px]'}`}>JENIS KENDARAAN</span>
              <div className={`font-medium text-slate-300 text-right flex flex-col leading-tight gap-0.5 ${isCompact ? 'text-[9px] 2xl:text-[10px]' : 'text-[10px] 2xl:text-[12px]'}`}>
                <span>Armored SUV - Anoa</span>
                <span>V2</span>
              </div>
            </div>
            <div className="w-full" style={{ borderBottom: theme === 'light' ? '0.64px solid #D8D8D8' : '0.64px solid rgba(68, 72, 65, 0.6)' }}></div>
            <div className={`flex justify-between items-center z-10 ${isCompact ? 'py-1' : 'py-1.5 2xl:py-2'}`}>
              <span className={`font-bold text-[#C5C8BE] tracking-widest uppercase ${isCompact ? 'text-[7px] 2xl:text-[8px]' : 'text-[8px] 2xl:text-[10px]'}`}>STATUS PERSONEL</span>
              <span className={`font-medium text-[#3B82F6] ${isCompact ? 'text-[9px] 2xl:text-[10px]' : 'text-[10px] 2xl:text-[12px]'}`}>Active Duty</span>
            </div>
            <div className="w-full" style={{ borderBottom: theme === 'light' ? '0.64px solid #D8D8D8' : '0.64px solid rgba(68, 72, 65, 0.6)' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-[#121416] text-white flex flex-col font-display h-screen overflow-hidden ${activeRequestCount >= 3 ? 'helpdesk-request-count-3' : ''}`}>
      <style>{`
        .border-light-blue { border-color: #2EAFF9 !important; }

        /* Mac resolutions (viewport height < 1080px) */
        @media (max-height: 1079px) {
          .helpdesk-request-count-3 .helpdesk-actions {
            padding-top: 2px;
          }
        }

        @media (width: 1920px) and (height: 1080px) {
          .helpdesk-request-count-3 .helpdesk-page-shell {
            padding: 16px 28px 18px;
          }

          .helpdesk-request-count-3 .helpdesk-title-block {
            margin-bottom: 16px;
          }

          .helpdesk-request-count-3 .helpdesk-multi-grid {
            gap: 18px;
            padding-bottom: 0;
          }

          .helpdesk-request-count-3 .helpdesk-request-card {
            padding: 20px;
          }

          .helpdesk-request-count-3 .helpdesk-card-body {
            gap: 18px;
          }

          .helpdesk-request-count-3 .helpdesk-live-header,
          .helpdesk-request-count-3 .helpdesk-plate-footer {
            padding: 12px 20px;
          }

          .helpdesk-request-count-3 .helpdesk-plate-number {
            font-size: 32px;
          }

          .helpdesk-request-count-3 .helpdesk-manual-panel {
            padding: 12px;
          }

          .helpdesk-request-count-3 .helpdesk-manual-header {
            padding-bottom: 5px;
            margin-bottom: 6px;
          }

          .helpdesk-request-count-3 .helpdesk-manual-title {
            font-size: 11px;
          }

          .helpdesk-request-count-3 .helpdesk-manual-content {
            gap: 5px;
            justify-content: flex-start;
          }

          .helpdesk-request-count-3 .helpdesk-field-stack {
            gap: 3px;
          }

          .helpdesk-request-count-3 .helpdesk-field-label {
            font-size: 9px;
          }

          .helpdesk-request-count-3 .helpdesk-manual-input {
            padding: 5px 10px;
            font-size: 10px;
          }

          .helpdesk-request-count-3 .helpdesk-photo-row {
            height: 58px;
            padding: 4px 8px;
            gap: 8px;
          }

          .helpdesk-request-count-3 .helpdesk-photo-thumb {
            width: 108px;
          }

          .helpdesk-request-count-3 .helpdesk-notes {
            height: 36px;
            padding: 5px 10px;
            font-size: 10px;
          }

          .helpdesk-request-count-3 .helpdesk-check-row {
            margin-top: 2px;
            min-height: 26px;
            padding: 6px 10px;
            gap: 8px;
          }

          .helpdesk-request-count-3 .helpdesk-actions {
            padding-top: 8px;
          }

          .helpdesk-request-count-3 .helpdesk-actions-row {
            gap: 10px;
          }

          .helpdesk-request-count-3 .helpdesk-action-button {
            height: 40px;
            font-size: 10px;
            gap: 8px;
          }

          .helpdesk-request-count-3 .helpdesk-alert {
            height: 58px;
            margin-top: 14px;
            padding-left: 22px;
            padding-right: 22px;
          }

          .helpdesk-request-count-3 .helpdesk-alert-icon {
            width: 30px;
            height: 30px;
          }

          .helpdesk-request-count-3 .helpdesk-alert-title {
            font-size: 13px;
          }

          .helpdesk-request-count-3 .helpdesk-alert-description {
            font-size: 10px;
          }
        }
      `}</style>
      <Header activePage="helpdesk" onNavigate={onNavigate} theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout} />
      <div className="helpdesk-page-shell flex-1 px-6 py-3 flex flex-col min-h-0 overflow-hidden no-scrollbar relative">

        <div className="helpdesk-title-block shrink-0 mb-3 2xl:mb-5">
          <div className="text-[9px] 2xl:text-[11px] font-black tracking-[0.2em] text-[#2EAFF9] uppercase mb-1">OPERATIONAL GATE SERVICE</div>
          <h2 className="text-xl 2xl:text-[28px] font-bold text-white tracking-wide">Operator help desk</h2>
        </div>

        {/* STATE 1: Single Request */}
        {activeRequestCount === 1 && (
          <div className="flex flex-col border-[5px] 2xl:border-[6px] border-light-blue p-5 2xl:p-7 bg-[#1E2022] w-full max-w-[1160px] 2xl:max-w-[1450px] h-[560px] 2xl:h-[700px] mx-auto mt-5 2xl:mt-8 overflow-hidden transition-all duration-300">
            <div className="flex flex-row gap-4 2xl:gap-6 flex-1 min-h-0">
              <div className="flex-1 bg-[#181C22] border border-[#444841] flex flex-col rounded-[3px] overflow-hidden min-h-0">
                <div className="flex items-center justify-between px-3.5 2xl:px-5 py-2 2xl:py-3 bg-[#323846]/80 border-b border-[#444841] shrink-0">
                  <div className="flex items-center gap-2.5 2xl:gap-3.5">
                    <div className="w-1.5 h-1.5 2xl:w-2 2xl:h-2 rounded-full bg-[#EF4444]"></div>
                    <span className="text-[9px] 2xl:text-[11px] font-bold text-white tracking-widest uppercase">LIVE CAPTURE - GATE 01</span>
                  </div>
                  <span className={`text-[8px] 2xl:text-[10px] font-bold tracking-widest ${theme === 'light' ? 'text-[#F59E0B]' : 'text-[#FFB4AB]'}`}>60 FPS / 4K</span>
                </div>
                <div className="flex-1 relative bg-black min-h-0">
                  <img src={carImage} alt="Car" className="w-full h-full object-cover" />
                </div>
                <div className="bg-[#1C2026] border-t border-[#444841] px-3 py-2 2xl:px-5 2xl:py-3 flex items-center justify-between shrink-0">
                  <div className="flex flex-col">
                    <span className="text-[8px] 2xl:text-[10px] font-bold tracking-widest text-[#C5C8BE] uppercase mb-1">DETEKSI PLAT</span>
                    <span className="text-[40px] 2xl:text-[50px] font-black text-[#2EAFF9] tracking-wide leading-none">B 1234 TNI</span>
                  </div>
                  <button className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-full border-[2px] 2xl:border-[3px] border-[#0C5F9A] flex items-center justify-center hover:bg-[#0C5F9A]/10 transition-colors bg-transparent shadow-sm">
                    <Mic className="w-[18px] h-[18px] 2xl:w-[22px] 2xl:h-[22px] text-[#0C5F9A]" strokeWidth={2} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-[#282A2C] border border-[#444841] p-4 2xl:p-6 flex flex-col shrink-0 rounded-sm min-w-0 min-h-0 overflow-hidden">
                <div className="border-b border-[#444841]/60 pb-2 2xl:pb-3 mb-3 2xl:mb-4 shrink-0">
                  <h3 className="text-[10px] 2xl:text-[12px] font-black text-[#2EAFF9] tracking-widest uppercase">MANUAL AUTHORIZATION</h3>
                </div>
                <div className="flex flex-col gap-2 2xl:gap-3 flex-1 min-h-0">
                  <div className="flex flex-col gap-2 2xl:gap-2.5">
                    <label className="text-[8px] 2xl:text-[10px] font-bold text-[#C5C8BE] tracking-widest uppercase">ALASAN VERIFIKASI MANUAL</label>
                    <input type="text" readOnly value="KETIDAKSESUAIAN DATA (PLAT BERBEDA)"
                      className="w-full bg-[#181C22] border border-[#444841] px-3 py-2 2xl:px-4 2xl:py-3 text-[9px] 2xl:text-[11px] text-slate-300 tracking-wide outline-none cursor-default rounded-sm" />
                  </div>
                  <div className="flex flex-col gap-2 2xl:gap-2.5">
                    <label className="text-[8px] 2xl:text-[10px] font-bold text-[#C5C8BE] tracking-widest uppercase">BUKTI FOTO DRIVER</label>
                    <div className="px-2.5 py-2 2xl:px-3.5 2xl:py-2.5 flex items-center gap-2.5 2xl:gap-3.5 h-[92px] 2xl:h-[115px] rounded-sm"
                      style={theme === 'light'
                        ? { background: '#FFFFFF', border: '1.16px solid #D8D8D8' }
                        : { background: '#282A2C', border: '1.16px solid #444841' }}>
                      <button className="w-[110px] 2xl:w-[138px] h-full flex items-center justify-center hover:opacity-80 transition-opacity rounded-sm"
                        style={theme === 'light'
                          ? { background: 'transparent', border: '2px dashed #3B82F6' }
                          : { background: '#2D3449', border: '3.46px dashed #414750' }}>
                        <Camera className="w-[15px] h-[15px] 2xl:w-[18px] 2xl:h-[18px] text-slate-400" strokeWidth={1.5} />
                      </button>
                      <div className="w-[110px] 2xl:w-[138px] h-full relative border border-[#444841] bg-black rounded-sm">
                        <img src={driverImage} alt="Driver" className="w-full h-full object-cover grayscale opacity-90 rounded-sm" />
                        <button className="absolute top-[3px] right-[3px] 2xl:top-[4px] 2xl:right-[4px] w-[14px] h-[14px] 2xl:w-[18px] 2xl:h-[18px] flex items-center justify-center hover:scale-110 transition-transform">
                          <img src={delIcon} alt="Delete" className="w-full h-full object-contain" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 2xl:gap-2.5">
                    <label className="text-[8px] 2xl:text-[10px] font-bold text-[#C5C8BE] tracking-widest uppercase">OPERATOR NOTES</label>
                    <textarea placeholder="Input detail pemeriksaan fisik..."
                      className="w-full bg-[#181C22] border border-[#444841] px-3 py-2 2xl:px-4 2xl:py-3 text-[9px] 2xl:text-[11px] text-slate-300 tracking-wide outline-none resize-none h-[40px] 2xl:h-[58px] placeholder:text-[#444841] rounded-sm" />
                  </div>
                  <div className={`flex items-center gap-2.5 2xl:gap-3.5 cursor-pointer group px-3 py-2 2xl:px-4 2xl:py-3 rounded-sm bg-[#262A31] mb-2 2xl:mb-5`}
                    style={theme === 'light' ? { border: '1.11px solid #D8D8D8' } : {}}
                    onClick={() => setIsChecked(!isChecked)}>
                    <div className={`w-4 h-4 2xl:w-5 2xl:h-5 flex items-center justify-center transition-colors rounded-[2px] shrink-0 ${isChecked ? (theme === 'light' ? 'bg-white border-[#0C5F9A]' : 'bg-[#181C22] border border-[#2EAFF9]') : (theme === 'light' ? 'bg-white group-hover:border-[#0C5F9A]' : 'bg-[#181C22] border border-[#444841] group-hover:border-[#2EAFF9]')}`}
                      style={theme === 'light' ? { border: isChecked ? '1.11px solid #0C5F9A' : '1.11px solid #D8D8D8' } : {}}>
                      {isChecked && <CheckSquare className={`w-4 h-4 2xl:w-5 2xl:h-5 ${theme === 'light' ? 'text-[#0C5F9A] bg-white' : 'text-[#2EAFF9] bg-[#181C22]'}`} strokeWidth={2.5} />}
                    </div>
                    <span className={`text-[9px] 2xl:text-[11px] tracking-wide font-normal ${theme === 'light' ? 'text-[#172033]' : 'text-slate-300'}`}>Sudah dilakukan pengecekan kendaraan</span>
                  </div>
                </div>
                <div className="mt-auto pt-3 2xl:pt-4 shrink-0">
                  <div className="flex items-center gap-2.5 2xl:gap-3.5">
                    <button className={`flex-1 h-[38px] 2xl:h-[48px] border-[2.22px] bg-[#262A31] text-[9px] 2xl:text-[11px] font-bold tracking-wider flex items-center justify-center gap-1.5 2xl:gap-2 uppercase transition-colors rounded-sm whitespace-nowrap px-2 ${theme === 'light' ? 'border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10' : 'border-[#FFB4AB] text-[#FFB4AB] hover:bg-[#FFB4AB]/10'}`}>
                      <XCircle className="w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={2.5} />
                      TOLAK AKSES
                    </button>
                    <button className={`flex-1 h-[38px] 2xl:h-[48px] text-[9px] 2xl:text-[11px] font-black tracking-wider flex items-center justify-center gap-1.5 2xl:gap-2 uppercase transition-colors shadow-lg rounded-sm whitespace-nowrap px-2 ${theme === 'light' ? 'bg-[#3B82F6] text-[#FAFAFA] hover:bg-[#3B82F6]/90 shadow-[#3B82F6]/20' : 'bg-[#2EAFF9] text-[#273421] hover:bg-[#2EAFF9]/90 shadow-[#2EAFF9]/20'}`}>
                      <CheckCircle2 className="w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={3} />
                      DIPERSILAHKAN MASUK
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-[64px] 2xl:h-[80px] bg-[#93000A] border-l-[8.8px] border-[#FFB4AB] flex items-center px-4 2xl:px-6 shrink-0 mt-4 2xl:mt-6 shadow-lg shadow-[#93000A]/10">
              <AlertTriangle className="w-[32px] h-[32px] 2xl:w-[40px] 2xl:h-[40px] text-[#FFB4AB] shrink-0" strokeWidth={1.5} />
              <div className="ml-4 2xl:ml-5 flex flex-col justify-center">
                <span className="text-[12px] 2xl:text-[15px] font-black text-[#FFB4AB] tracking-wide uppercase leading-tight mb-0.5">PLAT BERBEDA</span>
                <span className="text-[8px] 2xl:text-[10px] font-medium text-[#FFDAD6] tracking-wide">Sistem mendeteksi ketidaksesuaian antara PLAT dan Data RFID terdaftar.</span>
              </div>
              <div className="ml-auto flex flex-col items-end justify-center">
                <span className="text-[7px] 2xl:text-[9px] font-black text-[#FFDAD6] tracking-[0.15em] uppercase mb-0.5">TIMESTAMPS</span>
                <span className="text-[10px] 2xl:text-[12px] font-medium text-[#FFDAD6] tracking-widest">07:49:33:156</span>
              </div>
            </div>
          </div>
        )}

        {/* STATE >= 2: Multi Request */}
        {activeRequestCount >= 2 && (
          <div className={`helpdesk-multi-grid grid grid-cols-2 gap-3 2xl:gap-4 w-full max-w-[1800px] 2xl:max-w-[2400px] mx-auto transition-all duration-300 ${activeRequestCount >= 3 ? 'flex-1 min-h-0 overflow-y-auto no-scrollbar pb-2' : 'my-auto overflow-y-auto no-scrollbar pb-10'}`} style={activeRequestCount >= 3 ? { gridAutoRows: 'calc(50% - 6px)' } : {}}>
            {Array.from({ length: activeRequestCount }).map((_, idx) => {
              const gateId = idx + 1;
              const gateNumStr = gateId.toString().padStart(2, '0');
              const imageSrc = gateId % 2 === 0 ? carImage2 : carImage;

              return (
                <div
                  key={gateId}
                  className={`helpdesk-request-card flex flex-col p-3.5 2xl:p-5 bg-[#1E2022] overflow-hidden min-w-0 transition-all duration-300 cursor-pointer ${activeRequestCount >= 3 ? 'h-full min-h-0' : 'h-[420px] 2xl:h-[520px]'} ${selectedGate === gateId ? 'border-[4px] 2xl:border-[5px] border-light-blue' : 'border border-[#444841]'}`}
                  onClick={() => setSelectedGate(gateId)}
                >
                  <div className="helpdesk-card-body flex flex-row gap-3 2xl:gap-4 flex-1 min-h-0">
                    <div className="flex-1 bg-[#181C22] border border-[#444841] flex flex-col rounded-[3px] overflow-hidden min-h-0">
                      <div className="helpdesk-live-header flex items-center justify-between px-3.5 2xl:px-5 py-2 2xl:py-3 bg-[#323846]/80 border-b border-[#444841] shrink-0">
                        <div className="flex items-center gap-2.5 2xl:gap-3.5">
                          <div className="w-1.5 h-1.5 2xl:w-2 2xl:h-2 rounded-full bg-[#EF4444]"></div>
                          <span className={`font-bold text-white tracking-widest uppercase ${activeRequestCount >= 3 ? 'text-[7px] 2xl:text-[9px]' : 'text-[9px] 2xl:text-[11px]'}`}>LIVE CAPTURE - GATE {gateNumStr}</span>
                        </div>
                        <span className={`text-[8px] 2xl:text-[10px] font-bold tracking-widest ${theme === 'light' ? 'text-[#F59E0B]' : 'text-[#FFB4AB]'}`}>60 FPS / 4K</span>
                      </div>
                      <div className="flex-1 relative bg-black min-h-0">
                        <img src={imageSrc} alt={`Car ${gateId}`} className="w-full h-full object-cover" />
                      </div>
                      <div className="helpdesk-plate-footer bg-[#1C2026] border-t border-[#444841] px-3 py-2 2xl:px-5 2xl:py-3 flex items-center justify-between shrink-0">
                        <div className="flex flex-col">
                          <span className="text-[8px] 2xl:text-[10px] font-bold tracking-widest text-[#C5C8BE] uppercase mb-1">DETEKSI PLAT</span>
                          <span className={`helpdesk-plate-number font-black text-[#2EAFF9] tracking-wide leading-none ${activeRequestCount >= 3 ? 'text-[22px] 2xl:text-[30px]' : 'text-[40px] 2xl:text-[50px]'}`}>B 1234 TNI</span>
                        </div>
                        {selectedGate === gateId && (
                          <button className="w-8 h-8 2xl:w-10 2xl:h-10 rounded-full border-[2px] 2xl:border-[3px] border-[#0C5F9A] flex items-center justify-center hover:bg-[#0C5F9A]/10 transition-colors bg-transparent shadow-sm">
                            <Mic className="w-[18px] h-[18px] 2xl:w-[22px] 2xl:h-[22px] text-[#0C5F9A]" strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    </div>
                    {selectedGate === gateId ? renderDualManualAuth() : renderDualDatabaseRFID()}
                  </div>
                  <div className={`helpdesk-alert bg-[#93000A] border-l-[8.8px] border-[#FFB4AB] flex items-center px-4 2xl:px-6 shrink-0 shadow-lg shadow-[#93000A]/10 ${activeRequestCount >= 3 ? 'h-[42px] 2xl:h-[52px] mt-2 2xl:mt-3' : 'h-[52px] 2xl:h-[64px] mt-3 2xl:mt-4'}`}>
                    <AlertTriangle className={`helpdesk-alert-icon text-[#FFB4AB] shrink-0 ${activeRequestCount >= 3 ? 'w-[24px] h-[24px] 2xl:w-[28px] 2xl:h-[28px]' : 'w-[28px] h-[28px] 2xl:w-[32px] 2xl:h-[32px]'}`} strokeWidth={1.5} />
                    <div className="ml-4 2xl:ml-5 flex flex-col justify-center">
                      <span className={`helpdesk-alert-title font-black text-[#FFB4AB] tracking-wide uppercase leading-tight mb-0.5 ${activeRequestCount >= 3 ? 'text-[10px] 2xl:text-[12px]' : 'text-[11px] 2xl:text-[13px]'}`}>PLAT BERBEDA</span>
                      <span className="helpdesk-alert-description text-[8px] 2xl:text-[10px] font-medium text-[#FFDAD6] tracking-wide">Sistem mendeteksi ketidaksesuaian antara PLAT dan Data RFID terdaftar.</span>
                    </div>
                    <div className="ml-auto flex flex-col items-end justify-center">
                      <span className="text-[7px] 2xl:text-[9px] font-black text-[#FFDAD6] tracking-[0.15em] uppercase mb-0.5">TIMESTAMPS</span>
                      <span className="text-[10px] 2xl:text-[12px] font-medium text-[#FFDAD6] tracking-widest">07:49:33:156</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STATE 0: Empty */}
        {activeRequestCount === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full mb-10 2xl:mb-16">
            <img src={warningIcon} alt="Warning" className={`w-20 h-20 2xl:w-28 2xl:h-28 mb-6 2xl:mb-8 object-contain ${theme === 'light' ? 'mix-blend-multiply' : 'drop-shadow-2xl'}`} />
            <h3 className="text-[22px] 2xl:text-[28px] font-medium text-white tracking-wide">Belum ada permintaan bantuan</h3>
          </div>
        )}

      </div>
    </div>
  )
}
