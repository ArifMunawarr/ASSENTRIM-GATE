import React, { useState } from 'react'
import Header from '../components/Header'
import { Mic, X, XCircle, CheckCircle2, AlertTriangle, Square, CheckSquare, ShieldCheck, Info, List, Check } from 'lucide-react'
import carImage from '../assets/mobil1.png'
import carImage2 from '../assets/mobil2.png'
import warningIcon from '../assets/noto_warning.svg'
import tagIcon from '../assets/tagicon.svg'

export default function OperatorHelpDesk({ onNavigate, theme, onToggleTheme, onLogout }) {
  const [isChecked, setIsChecked] = useState(false)
  const [activeRequestCount, setActiveRequestCount] = useState(8)
  const [selectedGate, setSelectedGate] = useState(1)
  const [showAccessGranted, setShowAccessGranted] = useState(false)
  const [showAccessDenied, setShowAccessDenied] = useState(false)

  // Scale the desktop composition from the 1920x1080 design unit.
  const u = (n) => `calc(${n} * var(--u))`

  const renderDualManualAuth = () => {
    return (
      <div className="helpdesk-manual-panel flex-1 bg-[#282A2C] border border-[#444841] flex flex-col shrink-0 rounded-sm min-w-0 min-h-0 overflow-hidden">
        <div className="helpdesk-manual-header border-b border-[#444841]/60 shrink-0">
          <h3 className="helpdesk-manual-title font-black text-[#2EAFF9] tracking-widest uppercase">MANUAL AUTHORIZATION</h3>
        </div>
        <div className="helpdesk-manual-content flex flex-col">
          <div className="helpdesk-field-stack flex flex-col shrink-0">
            <label className="helpdesk-field-label font-bold text-[#C5C8BE] tracking-widest uppercase">ALASAN VERIFIKASI MANUAL</label>
            <input type="text" readOnly value="KETIDAKSESUAIAN DATA (PLAT BERBEDA)"
              className="helpdesk-manual-input w-full bg-[#181C22] border border-[#444841] text-slate-300 tracking-wide outline-none cursor-default rounded-sm" />
          </div>
          <div className="helpdesk-field-stack helpdesk-notes-stack flex flex-col shrink-0">
            <label className="helpdesk-field-label font-bold text-[#C5C8BE] tracking-widest uppercase">OPERATOR NOTES</label>
            <textarea placeholder="Input detail pemeriksaan fisik..."
              className="helpdesk-notes w-full bg-[#181C22] border border-[#444841] text-slate-300 tracking-wide outline-none resize-none placeholder:text-[#444841] rounded-sm" />
          </div>
          <div className="helpdesk-check-row flex items-center cursor-pointer group shrink-0 rounded-sm transition-colors bg-[#262A31]"
            style={theme === 'light' ? { border: '1.11px solid #D8D8D8' } : {}}
            onClick={() => setIsChecked(!isChecked)}>
            <div className={`helpdesk-check-box flex items-center justify-center transition-colors rounded-[2px] shrink-0 ${isChecked ? (theme === 'light' ? 'bg-white border-[#0C5F9A]' : 'bg-[#181C22] border border-[#2EAFF9]') : (theme === 'light' ? 'bg-white group-hover:border-[#0C5F9A]' : 'bg-[#181C22] border border-[#444841] group-hover:border-[#2EAFF9]')}`}
              style={theme === 'light' ? { border: isChecked ? '1.11px solid #0C5F9A' : '1.11px solid #D8D8D8' } : {}}>
              {isChecked && <CheckSquare className={`helpdesk-check-icon ${theme === 'light' ? 'text-[#0C5F9A] bg-white' : 'text-[#2EAFF9] bg-[#181C22]'}`} strokeWidth={2} />}
            </div>
            <span className={`helpdesk-check-label tracking-wide font-normal leading-none ${theme === 'light' ? 'text-[#172033]' : 'text-slate-300'}`}>Sudah dilakukan pengecekan kendaraan</span>
          </div>
        </div>
        <div className="helpdesk-actions shrink-0 bg-[#282A2C] z-10">
          <div className="helpdesk-actions-row flex items-center">
            <button onClick={() => setShowAccessDenied(true)} className="helpdesk-action-button flex-1 border-[2.22px] border-[#EF4444] bg-[#262A31] text-[#EF4444] font-bold tracking-wider flex items-center justify-center uppercase hover:bg-[#EF4444]/10 transition-colors rounded-sm whitespace-nowrap">
              <XCircle className="helpdesk-action-icon" strokeWidth={2} />
              TOLAK AKSES
            </button>
            <button 
              onClick={() => setShowAccessGranted(true)}
              className="helpdesk-action-button flex-1 bg-[#3B82F6] text-[#FAFAFA] font-black tracking-wider flex items-center justify-center uppercase hover:bg-[#3B82F6]/90 transition-colors shadow-lg shadow-[#3B82F6]/20 rounded-sm whitespace-nowrap">
              <CheckCircle2 className="helpdesk-action-icon" strokeWidth={2.5} />
              DIPERSILAHKAN MASUK
            </button>
          </div>
        </div>
      </div>
    )
  }

  const renderDualDatabaseRFID = () => {
    return (
      <div className="helpdesk-db-panel flex-1 bg-[#282A2C] border border-[#444841] flex flex-col shrink-0 rounded-sm min-w-0 min-h-0 overflow-hidden">
        <div className="helpdesk-db-header border-b border-[#444841]/60 shrink-0">
          <h3 className="helpdesk-db-title font-bold text-[#DFE2EB] tracking-widest uppercase" style={{ fontFamily: 'Inter, sans-serif' }}>DATABASE RFID DATA</h3>
        </div>
        <div className="flex flex-col flex-1 min-h-0 relative">
          <div className="helpdesk-db-tagbox flex flex-col relative bg-[#0A0E14] border-b border-[#444841] flex-1 min-h-0">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[inherit]">
              <img src={tagIcon} alt="" className="helpdesk-db-tagicon opacity-20" />
            </div>
            <div className="flex justify-between items-start relative z-10 w-full shrink-0">
              <div className="flex flex-col gap-0.5">
                <span className="helpdesk-db-label-sm font-medium text-[#C5C8BE] tracking-widest uppercase">RFID TAG</span>
                <span className={`helpdesk-db-value font-medium tracking-wider ${theme === 'light' ? 'text-[#0C5F9A]' : 'text-slate-300'}`}>E280-1105-2000-7451</span>
              </div>
              <div className={`helpdesk-db-badge rounded-sm flex items-center justify-center ${theme === 'light' ? 'bg-[#B1BECB33] border border-transparent' : 'bg-[#2EAFF9]/10 border border-[#2EAFF9]/30'}`}>
                <span className={`helpdesk-db-badge-text font-black tracking-wider uppercase ${theme === 'light' ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>MEMBER</span>
              </div>
            </div>
          </div>
          <div className="shrink-0 flex flex-col">
            <div className="helpdesk-db-row flex justify-between items-center z-10">
              <span className="helpdesk-db-row-label font-bold text-[#C5C8BE] tracking-widest uppercase">NOMOR PLAT TERDAFTAR</span>
              <span className="helpdesk-db-row-value font-bold text-[#EF4444] tracking-wide uppercase">B 9999 MIL</span>
            </div>
            <div className="w-full" style={{ borderBottom: theme === 'light' ? '0.64px solid #D8D8D8' : '0.64px solid rgba(68, 72, 65, 0.6)' }}></div>
            <div className="helpdesk-db-row flex justify-between items-center z-10">
              <span className="helpdesk-db-row-label font-bold text-[#C5C8BE] tracking-widest uppercase w-1/3">JENIS KENDARAAN</span>
              <div className="helpdesk-db-row-value font-medium text-slate-300 text-right flex flex-col leading-tight gap-0.5">
                <span>Armored SUV - Anoa</span>
                <span>V2</span>
              </div>
            </div>
            <div className="w-full" style={{ borderBottom: theme === 'light' ? '0.64px solid #D8D8D8' : '0.64px solid rgba(68, 72, 65, 0.6)' }}></div>
            <div className="helpdesk-db-row flex justify-between items-center z-10">
              <span className="helpdesk-db-row-label font-bold text-[#C5C8BE] tracking-widest uppercase">STATUS PERSONEL</span>
              <span className="helpdesk-db-row-value font-medium text-[#3B82F6]">Active Duty</span>
            </div>
            <div className="w-full" style={{ borderBottom: theme === 'light' ? '0.64px solid #D8D8D8' : '0.64px solid rgba(68, 72, 65, 0.6)' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`helpdesk-root min-h-screen bg-[#121416] text-white flex flex-col font-display h-screen overflow-hidden ${activeRequestCount >= 3 ? 'hd-fill' : 'hd-fixed'} ${activeRequestCount === 1 ? 'hd-single' : ''}`}>
      <style>{`
        /*
         * Keep the desktop composition proportional to the 1920x1080 baseline.
         * The tighter viewport axis determines the scale below that baseline;
         * the app's global zoom handles larger displays.
         */
        .helpdesk-root { --u: max(0.5px, min(100vw / 1920, (100vh - 72px) / 1008)); }
        .border-light-blue { border-color: #2EAFF9 !important; }

        /* ===== Page shell / title ===== */
        .helpdesk-page-shell { padding: calc(16 * var(--u)) calc(28 * var(--u)) calc(18 * var(--u)); }
        .helpdesk-title-block { margin-bottom: calc(16 * var(--u)); }
        .helpdesk-eyebrow { font-size: calc(11 * var(--u)); margin-bottom: calc(4 * var(--u)); }
        .helpdesk-title { font-size: calc(28 * var(--u)); }

        /* ===== Multi-request grid ===== */
        .helpdesk-multi-grid { gap: calc(18 * var(--u)); }
        .hd-fill .helpdesk-multi-grid { flex: 1 1 0%; min-height: 0; }

        /* ===== Request card ===== */
        .helpdesk-request-card { padding: calc(20 * var(--u)); }
        .hd-fill .helpdesk-request-card { height: 100%; min-height: 0; }
        /* 1-2 card layout: height follows content so the panel packs tightly
           (no dead space under the checkbox). Cards are centered via my-auto. */
        .helpdesk-card-body { gap: calc(18 * var(--u)); }

        /* ===== Live capture column ===== */
        .helpdesk-live-header, .helpdesk-plate-footer { padding: calc(12 * var(--u)) calc(20 * var(--u)); }
        .helpdesk-live-dot { width: calc(8 * var(--u)); height: calc(8 * var(--u)); }
        .helpdesk-live-label { font-size: calc(9 * var(--u)); }
        .hd-fixed .helpdesk-live-label { font-size: calc(11 * var(--u)); }
        .helpdesk-live-meta { font-size: calc(10 * var(--u)); }
        .helpdesk-plate-caption { font-size: calc(10 * var(--u)); margin-bottom: calc(4 * var(--u)); }
        .helpdesk-plate-number { font-size: calc(32 * var(--u)); }
        .hd-fixed .helpdesk-plate-number { font-size: calc(50 * var(--u)); }
        .helpdesk-mic-btn { width: calc(40 * var(--u)); height: calc(40 * var(--u)); border-width: calc(3 * var(--u)); }
        .helpdesk-mic-btn svg { width: calc(22 * var(--u)); height: calc(22 * var(--u)); }

        /* ===== Manual Authorization ===== */
        .helpdesk-manual-panel { padding: calc(12 * var(--u)); }
        .helpdesk-manual-header { padding-bottom: calc(5 * var(--u)); margin-bottom: calc(6 * var(--u)); }
        .helpdesk-manual-title { font-size: calc(11 * var(--u)); }
        .helpdesk-manual-content { gap: calc(6 * var(--u)); }
        .helpdesk-field-stack { gap: calc(4 * var(--u)); }
        .helpdesk-field-label { font-size: calc(9 * var(--u)); }
        .helpdesk-manual-input { padding: calc(5 * var(--u)) calc(10 * var(--u)); font-size: calc(10 * var(--u)); }
        .helpdesk-notes { padding: calc(5 * var(--u)) calc(10 * var(--u)); font-size: calc(10 * var(--u)); height: calc(30 * var(--u)); }
        /* 1-2 card layout: comfortable fixed notes height. */
        .hd-fixed .helpdesk-notes { height: calc(58 * var(--u)); }
        .helpdesk-check-row { padding: calc(6 * var(--u)) calc(10 * var(--u)); gap: calc(8 * var(--u)); margin-top: calc(2 * var(--u)); }
        .helpdesk-check-box { width: calc(16 * var(--u)); height: calc(16 * var(--u)); }
        .helpdesk-check-icon { width: calc(14 * var(--u)); height: calc(14 * var(--u)); }
        .helpdesk-check-label { font-size: calc(9 * var(--u)); }
        .helpdesk-actions { padding-top: calc(8 * var(--u)); }
        .helpdesk-actions-row { gap: calc(10 * var(--u)); }
        .helpdesk-action-button { height: calc(40 * var(--u)); font-size: calc(10 * var(--u)); gap: calc(8 * var(--u)); padding-left: calc(8 * var(--u)); padding-right: calc(8 * var(--u)); }
        .helpdesk-action-icon { width: calc(16 * var(--u)); height: calc(16 * var(--u)); }

        /* ===== Database RFID panel ===== */
        .helpdesk-db-panel { padding: calc(12 * var(--u)); padding-bottom: calc(56 * var(--u)); }
        .helpdesk-db-header { padding-bottom: calc(5 * var(--u)); margin-bottom: calc(6 * var(--u)); }
        .helpdesk-db-title { font-size: calc(10 * var(--u)); }
        .helpdesk-db-tagbox { margin-left: calc(-12 * var(--u)); margin-right: calc(-12 * var(--u)); padding-left: calc(28 * var(--u)); padding-right: calc(28 * var(--u)); padding-top: calc(8 * var(--u)); }
        .helpdesk-db-tagicon { width: calc(48 * var(--u)); height: calc(48 * var(--u)); }
        .helpdesk-db-label-sm { font-size: calc(9 * var(--u)); }
        .helpdesk-db-value { font-size: calc(11 * var(--u)); }
        .helpdesk-db-badge { padding: calc(4 * var(--u)) calc(10 * var(--u)); }
        .helpdesk-db-badge-text { font-size: calc(9 * var(--u)); }
        .helpdesk-db-row { padding-top: calc(8 * var(--u)); padding-bottom: calc(8 * var(--u)); }
        .helpdesk-db-row-label { font-size: calc(8 * var(--u)); }
        .helpdesk-db-row-value { font-size: calc(10 * var(--u)); }

        /* ===== Alert ===== */
        .helpdesk-alert { height: calc(58 * var(--u)); margin-top: calc(14 * var(--u)); padding-left: calc(22 * var(--u)); padding-right: calc(22 * var(--u)); border-left-width: calc(8 * var(--u)); }
        .hd-fixed .helpdesk-alert { height: calc(64 * var(--u)); margin-top: calc(16 * var(--u)); }
        .helpdesk-alert-icon { width: calc(30 * var(--u)); height: calc(30 * var(--u)); }
        .helpdesk-alert-body { margin-left: calc(18 * var(--u)); }
        .helpdesk-alert-title { font-size: calc(13 * var(--u)); margin-bottom: calc(2 * var(--u)); }
        .helpdesk-alert-description { font-size: calc(10 * var(--u)); }
        .helpdesk-alert-ts-label { font-size: calc(9 * var(--u)); margin-bottom: calc(2 * var(--u)); }
        .helpdesk-alert-ts { font-size: calc(12 * var(--u)); }

        /* Constrain result dialogs without changing the desktop card composition. */
        @media (max-height: 1079px) {
          .helpdesk-result-dialog {
            max-height: calc(var(--layout-height) - 3rem);
            overflow-y: auto;
          }
          .helpdesk-result-dialog > * { flex-shrink: 0; }
        }
        /* Narrow windows use a readable stacked layout; laptops keep two columns. */
        @media (max-width: 1099px) {
          .helpdesk-root { --u: 1px; }
          .hd-fixed .helpdesk-multi-grid { align-content: start; }
          .hd-single .helpdesk-page-shell { overflow-y: auto; }
          .helpdesk-single-request { height: 700px !important; flex-shrink: 0; }
          .helpdesk-page-shell { padding: calc(16 * var(--u)) calc(14 * var(--u)); }
          .helpdesk-multi-grid { grid-template-columns: 1fr !important; grid-auto-rows: 470px !important; max-width: 980px !important; }
          .hd-fill .helpdesk-request-card, .hd-fixed .helpdesk-request-card { height: calc(470 * var(--u)) !important; }
        }
        @media (max-width: 899px) {
          .helpdesk-multi-grid { grid-auto-rows: max-content !important; align-content: start; }
          .hd-fill .helpdesk-request-card, .hd-fixed .helpdesk-request-card { height: auto !important; }
          .helpdesk-card-body, .helpdesk-single-body { flex-direction: column; flex: none; }
          .helpdesk-card-body > div, .helpdesk-single-body > div { flex: none; min-height: 300px; }
          .helpdesk-card-body > div:first-child, .helpdesk-single-body > div:first-child { height: 320px; }
          .helpdesk-single-request { height: auto !important; }
          .helpdesk-alert, .hd-fixed .helpdesk-alert, .helpdesk-single-alert { height: auto !important; min-height: 80px; padding: 12px; flex-wrap: wrap; gap: 10px; }
          .helpdesk-alert-body { flex: 1; margin-left: 0; }
        }
      `}</style>
      <Header activePage="helpdesk" onNavigate={onNavigate} theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout} />
      <div className="helpdesk-page-shell flex-1 flex flex-col min-h-0 overflow-hidden no-scrollbar relative">

        <div className="helpdesk-title-block shrink-0">
          <div className="helpdesk-eyebrow font-black tracking-[0.2em] text-[#2EAFF9] uppercase">OPERATIONAL GATE SERVICE</div>
          <h2 className="helpdesk-title font-bold text-white tracking-wide">Operator help desk</h2>
        </div>

        {/* STATE 1: Single Request */}
        {activeRequestCount === 1 && (
          <div className="helpdesk-single-request flex flex-col border-[6px] border-light-blue bg-[#1E2022] w-full mx-auto overflow-hidden" style={{ maxWidth: u(1450), height: 'min(calc(700 * var(--u)), 100%)', marginTop: u(32), padding: u(28) }}>
            <div className="helpdesk-single-body flex flex-row flex-1 min-h-0" style={{ gap: u(24) }}>
              <div className="flex-1 bg-[#181C22] border border-[#444841] flex flex-col rounded-[3px] overflow-hidden min-h-0">
                <div className="flex items-center justify-between bg-[#323846]/80 border-b border-[#444841] shrink-0" style={{ padding: `${u(12)} ${u(20)}` }}>
                  <div className="flex items-center" style={{ gap: u(14) }}>
                    <div className="rounded-full bg-[#EF4444]" style={{ width: u(8), height: u(8) }}></div>
                    <span className="font-bold text-white tracking-widest uppercase" style={{ fontSize: u(11) }}>LIVE CAPTURE - GATE 01</span>
                  </div>
                  <span className={`font-bold tracking-widest ${theme === 'light' ? 'text-[#F59E0B]' : 'text-[#FFB4AB]'}`} style={{ fontSize: u(10) }}>60 FPS / 4K</span>
                </div>
                <div className="flex-1 relative bg-black min-h-0">
                  <img src={carImage} alt="Car" className="absolute inset-0 w-full h-full object-cover" />
                </div>
                <div className="bg-[#1C2026] border-t border-[#444841] flex items-center justify-between shrink-0" style={{ padding: `${u(12)} ${u(20)}` }}>
                  <div className="flex flex-col">
                    <span className="font-bold tracking-widest text-[#C5C8BE] uppercase" style={{ fontSize: u(10), marginBottom: u(4) }}>DETEKSI PLAT</span>
                    <span className="font-black text-[#2EAFF9] tracking-wide leading-none" style={{ fontSize: u(50) }}>B 1234 TNI</span>
                  </div>
                  <button className="rounded-full border-[3px] border-[#0C5F9A] flex items-center justify-center hover:bg-[#0C5F9A]/10 transition-colors bg-transparent shadow-sm" style={{ width: u(40), height: u(40) }}>
                    <Mic className="text-[#0C5F9A]" strokeWidth={2} style={{ width: u(22), height: u(22) }} />
                  </button>
                </div>
              </div>
              <div className="flex-1 bg-[#282A2C] border border-[#444841] flex flex-col shrink-0 rounded-sm min-w-0 min-h-0 overflow-hidden" style={{ padding: u(24) }}>
                <div className="border-b border-[#444841]/60 shrink-0" style={{ paddingBottom: u(12), marginBottom: u(16) }}>
                  <h3 className="font-black text-[#2EAFF9] tracking-widest uppercase" style={{ fontSize: u(12) }}>MANUAL AUTHORIZATION</h3>
                </div>
                <div className="flex flex-col" style={{ gap: u(12) }}>
                  <div className="flex flex-col shrink-0" style={{ gap: u(10) }}>
                    <label className="font-bold text-[#C5C8BE] tracking-widest uppercase" style={{ fontSize: u(10) }}>ALASAN VERIFIKASI MANUAL</label>
                    <input type="text" readOnly value="KETIDAKSESUAIAN DATA (PLAT BERBEDA)"
                      className="w-full bg-[#181C22] border border-[#444841] text-slate-300 tracking-wide outline-none cursor-default rounded-sm" style={{ padding: `${u(10)} ${u(16)}`, fontSize: u(11) }} />
                  </div>
                  <div className="flex flex-col shrink-0" style={{ gap: u(10) }}>
                    <label className="font-bold text-[#C5C8BE] tracking-widest uppercase" style={{ fontSize: u(10) }}>OPERATOR NOTES</label>
                    <textarea placeholder="Input detail pemeriksaan fisik..."
                      className="w-full bg-[#181C22] border border-[#444841] text-slate-300 tracking-wide outline-none resize-none placeholder:text-[#444841] rounded-sm" style={{ padding: `${u(10)} ${u(16)}`, fontSize: u(11), height: u(44) }} />
                  </div>
                  <div className="flex items-center cursor-pointer group rounded-sm bg-[#262A31] shrink-0"
                    style={theme === 'light' ? { border: '1.11px solid #D8D8D8', padding: `${u(10)} ${u(16)}`, gap: u(14) } : { padding: `${u(10)} ${u(16)}`, gap: u(14) }}
                    onClick={() => setIsChecked(!isChecked)}>
                    <div className={`flex items-center justify-center transition-colors rounded-[2px] shrink-0 ${isChecked ? (theme === 'light' ? 'bg-white border-[#0C5F9A]' : 'bg-[#181C22] border border-[#2EAFF9]') : (theme === 'light' ? 'bg-white group-hover:border-[#0C5F9A]' : 'bg-[#181C22] border border-[#444841] group-hover:border-[#2EAFF9]')}`}
                      style={theme === 'light' ? { border: isChecked ? '1.11px solid #0C5F9A' : '1.11px solid #D8D8D8', width: u(20), height: u(20) } : { width: u(20), height: u(20) }}>
                      {isChecked && <CheckSquare className={`${theme === 'light' ? 'text-[#0C5F9A] bg-white' : 'text-[#2EAFF9] bg-[#181C22]'}`} strokeWidth={2.5} style={{ width: u(20), height: u(20) }} />}
                    </div>
                    <span className={`tracking-wide font-normal ${theme === 'light' ? 'text-[#172033]' : 'text-slate-300'}`} style={{ fontSize: u(11) }}>Sudah dilakukan pengecekan kendaraan</span>
                  </div>
                </div>
                <div className="shrink-0" style={{ paddingTop: u(16) }}>
                  <div className="flex items-center" style={{ gap: u(14) }}>
                    <button onClick={() => setShowAccessDenied(true)} className={`flex-1 border-[2.22px] bg-[#262A31] font-bold tracking-wider flex items-center justify-center uppercase transition-colors rounded-sm whitespace-nowrap ${theme === 'light' ? 'border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10' : 'border-[#FFB4AB] text-[#FFB4AB] hover:bg-[#FFB4AB]/10'}`} style={{ height: u(48), fontSize: u(11), gap: u(8), paddingLeft: u(8), paddingRight: u(8) }}>
                      <XCircle strokeWidth={2.5} style={{ width: u(20), height: u(20) }} />
                      TOLAK AKSES
                    </button>
                    <button onClick={() => setShowAccessGranted(true)} className={`flex-1 font-black tracking-wider flex items-center justify-center uppercase transition-colors shadow-lg rounded-sm whitespace-nowrap ${theme === 'light' ? 'bg-[#3B82F6] text-[#FAFAFA] hover:bg-[#3B82F6]/90 shadow-[#3B82F6]/20' : 'bg-[#2EAFF9] text-[#273421] hover:bg-[#2EAFF9]/90 shadow-[#2EAFF9]/20'}`} style={{ height: u(48), fontSize: u(11), gap: u(8), paddingLeft: u(8), paddingRight: u(8) }}>
                      <CheckCircle2 strokeWidth={3} style={{ width: u(20), height: u(20) }} />
                      DIPERSILAHKAN MASUK
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="helpdesk-single-alert bg-[#93000A] border-l-[8px] border-[#FFB4AB] flex items-center shrink-0 shadow-lg shadow-[#93000A]/10" style={{ height: u(80), paddingLeft: u(24), paddingRight: u(24), marginTop: u(24) }}>
              <AlertTriangle className="text-[#FFB4AB] shrink-0" strokeWidth={1.5} style={{ width: u(40), height: u(40) }} />
              <div className="flex flex-col justify-center" style={{ marginLeft: u(20) }}>
                <span className="font-black text-[#FFB4AB] tracking-wide uppercase leading-tight" style={{ fontSize: u(15), marginBottom: u(2) }}>PLAT BERBEDA</span>
                <span className="font-medium text-[#FFDAD6] tracking-wide" style={{ fontSize: u(10) }}>Sistem mendeteksi ketidaksesuaian antara PLAT dan Data RFID terdaftar.</span>
              </div>
              <div className="ml-auto flex flex-col items-end justify-center">
                <span className="font-black text-[#FFDAD6] tracking-[0.15em] uppercase" style={{ fontSize: u(9), marginBottom: u(2) }}>TIMESTAMPS</span>
                <span className="font-medium text-[#FFDAD6] tracking-widest" style={{ fontSize: u(12) }}>07:49:33:156</span>
              </div>
            </div>
          </div>
        )}

        {/* STATE >= 2: Multi Request */}
        {activeRequestCount >= 2 && (
          <div
            className={`helpdesk-multi-grid grid grid-cols-2 w-full mx-auto overflow-y-auto no-scrollbar ${activeRequestCount >= 3 ? 'min-h-0' : 'flex-1 min-h-0 content-center'}`}
            style={{
              maxWidth: 'calc(1864 * var(--u))',
              // Every row keeps the same height as the 2-row (3/4 cards) case.
              // 2 cards: the single row uses that same height and is vertically
              // centered (content-center). 5+ cards overflow and scroll.
              gridAutoRows: `calc((100% - ${u(18)}) / 2)`,
            }}
          >
            {Array.from({ length: activeRequestCount }).map((_, idx) => {
              const gateId = idx + 1;
              const gateNumStr = gateId.toString().padStart(2, '0');
              const imageSrc = gateId % 2 === 0 ? carImage2 : carImage;

              return (
                <div
                  key={gateId}
                  className={`helpdesk-request-card flex flex-col bg-[#1E2022] overflow-hidden min-w-0 transition-colors cursor-pointer ${selectedGate === gateId ? 'border-[4px] 2xl:border-[5px] border-light-blue' : 'border border-[#444841]'}`}
                  onClick={() => setSelectedGate(gateId)}
                >
                  <div className="helpdesk-card-body flex flex-row flex-1 min-h-0">
                    <div className="flex-1 bg-[#181C22] border border-[#444841] flex flex-col rounded-[3px] overflow-hidden min-h-0">
                      <div className="helpdesk-live-header flex items-center justify-between bg-[#323846]/80 border-b border-[#444841] shrink-0">
                        <div className="flex items-center gap-2.5 2xl:gap-3.5">
                          <div className="helpdesk-live-dot rounded-full bg-[#EF4444]"></div>
                          <span className="helpdesk-live-label font-bold text-white tracking-widest uppercase">LIVE CAPTURE - GATE {gateNumStr}</span>
                        </div>
                        <span className={`helpdesk-live-meta font-bold tracking-widest ${theme === 'light' ? 'text-[#F59E0B]' : 'text-[#FFB4AB]'}`}>60 FPS / 4K</span>
                      </div>
                      <div className="flex-1 relative bg-black min-h-0">
                        <img src={imageSrc} alt={`Car ${gateId}`} className="absolute inset-0 w-full h-full object-cover" />
                      </div>
                      <div className="helpdesk-plate-footer bg-[#1C2026] border-t border-[#444841] flex items-center justify-between shrink-0">
                        <div className="flex flex-col">
                          <span className="helpdesk-plate-caption font-bold tracking-widest text-[#C5C8BE] uppercase">DETEKSI PLAT</span>
                          <span className="helpdesk-plate-number font-black text-[#2EAFF9] tracking-wide leading-none">B 1234 TNI</span>
                        </div>
                        {selectedGate === gateId && (
                          <button className="helpdesk-mic-btn rounded-full border-[#0C5F9A] flex items-center justify-center hover:bg-[#0C5F9A]/10 transition-colors bg-transparent shadow-sm">
                            <Mic className="text-[#0C5F9A]" strokeWidth={2} />
                          </button>
                        )}
                      </div>
                    </div>
                    {selectedGate === gateId ? renderDualManualAuth() : renderDualDatabaseRFID()}
                  </div>
                  <div className="helpdesk-alert bg-[#93000A] border-[#FFB4AB] flex items-center shrink-0 shadow-lg shadow-[#93000A]/10">
                    <AlertTriangle className="helpdesk-alert-icon text-[#FFB4AB] shrink-0" strokeWidth={1.5} />
                    <div className="helpdesk-alert-body flex flex-col justify-center">
                      <span className="helpdesk-alert-title font-black text-[#FFB4AB] tracking-wide uppercase leading-tight">PLAT BERBEDA</span>
                      <span className="helpdesk-alert-description font-medium text-[#FFDAD6] tracking-wide">Sistem mendeteksi ketidaksesuaian antara PLAT dan Data RFID terdaftar.</span>
                    </div>
                    <div className="ml-auto flex flex-col items-end justify-center">
                      <span className="helpdesk-alert-ts-label font-black text-[#FFDAD6] tracking-[0.15em] uppercase">TIMESTAMPS</span>
                      <span className="helpdesk-alert-ts font-medium text-[#FFDAD6] tracking-widest">07:49:33:156</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* STATE 0: Empty */}
        {activeRequestCount === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full" style={{ marginBottom: u(64) }}>
            <img src={warningIcon} alt="Warning" className={`object-contain ${theme === 'light' ? 'mix-blend-multiply' : 'drop-shadow-2xl'}`} style={{ width: u(112), height: u(112), marginBottom: u(32) }} />
            <h3 className="font-medium text-white tracking-wide" style={{ fontSize: u(28) }}>Belum ada permintaan bantuan</h3>
          </div>
        )}

      </div>

      {/* Access Granted Popup Overlay */}
      {showAccessGranted && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200 ${theme === 'light' ? 'bg-[#F1F5F9]/80' : 'bg-[#121416]/80'}`}>
          <div className={`helpdesk-result-dialog ${theme === 'light' ? 'bg-[#FFFFFF] border-[#10B981] shadow-xl' : 'bg-[#0B0D10] border-[#00DF89] shadow-[0_0_30px_rgba(0,223,137,0.15)]'} border rounded-xl p-6 w-full max-w-[420px] relative flex flex-col`}>
            
            {/* System State Banner */}
            <div className={`border rounded-md px-3 py-2 mb-5 flex items-center ${theme === 'light' ? 'bg-[#10B981]/10 border-[#10B981]/30' : 'bg-[#00DF89]/[0.02] border-[#00DF89]/60 shadow-[inset_0_0_10px_rgba(0,223,137,0.05)]'}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-2.5 ${theme === 'light' ? 'bg-[#10B981]' : 'bg-[#00DF89] shadow-[0_0_8px_#00DF89]'}`}></div>
              <span className={`font-mono text-[8px] sm:text-[9px] tracking-[0.2em] font-bold uppercase ${theme === 'light' ? 'text-[#10B981]' : 'text-[#00DF89]'}`}>SYSTEM STATE: COMMAND EXECUTION SUCCESSFUL</span>
            </div>

            {/* Icon & Title */}
            <div className="flex flex-col items-center justify-center mb-5">
              <div className={`w-12 h-12 rounded-full border-[2px] flex items-center justify-center mb-3 ${theme === 'light' ? 'border-[#10B981] bg-[#10B981]/10 shadow-sm' : 'border-[#00DF89] bg-[#00DF89]/15 shadow-[0_0_20px_rgba(0,223,137,0.15)]'}`}>
                 <ShieldCheck className={`w-6 h-6 ${theme === 'light' ? 'text-[#10B981]' : 'text-[#00DF89]'}`} strokeWidth={1.5} />
              </div>
              <h2 className={`text-[20px] font-black tracking-widest mb-1 ${theme === 'light' ? 'text-[#10B981]' : 'text-[#00DF89] shadow-[#00DF89]'}`}>AKSES DIBERIKAN</h2>
              <p className={`tracking-[0.3em] text-[8px] font-medium uppercase text-center ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>ACCESS GRANTED // COMMAND SEND OK</p>
            </div>

            {/* License Plate Box */}
            <div className={`border rounded-lg py-3 px-4 mb-5 flex flex-col items-center ${theme === 'light' ? 'bg-[#F0F9FF] border-[#E0F2FE]' : 'bg-[#16181C] border-[#2A2D32] shadow-inner'}`}>
              <span className={`text-[8px] font-bold tracking-[0.2em] uppercase mb-1.5 text-center ${theme === 'light' ? 'text-[#0284C7]' : 'text-[#2EAFF9]'}`}>VEHICLE LICENSE PLATE</span>
              <span className={`text-3xl font-black tracking-widest mb-2 text-center ${theme === 'light' ? 'text-[#0284C7]' : 'text-[#2EAFF9] drop-shadow-[0_0_15px_rgba(46,175,249,0.3)]'}`}>B 1234 TNI</span>
              <div className={`flex items-center text-[8px] font-bold tracking-widest ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>
                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                   <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                   <path d="M9 22v-4h6v4"></path>
                   <path d="M8 6h.01"></path>
                   <path d="M16 6h.01"></path>
                   <path d="M12 6h.01"></path>
                   <path d="M12 10h.01"></path>
                   <path d="M12 14h.01"></path>
                   <path d="M16 10h.01"></path>
                   <path d="M16 14h.01"></path>
                   <path d="M8 10h.01"></path>
                   <path d="M8 14h.01"></path>
                 </svg>
                 GATE 01 - ENTRY
              </div>
            </div>

            {/* Authorization Manifest */}
            <div className="mb-5">
              <span className={`text-[8px] font-bold tracking-[0.2em] uppercase mb-1.5 block ${theme === 'light' ? 'text-[#64748B]' : 'text-gray-500'}`}>AUTHORIZATION MANIFEST</span>
              <div className={`border rounded-lg flex flex-col overflow-hidden ${theme === 'light' ? 'bg-[#F8FAFC] border-[#E2E8F0]' : 'bg-[#16181C] border-[#2A2D32]'}`}>
                {/* Row 1 */}
                <div className={`flex justify-between items-center px-3 py-2 border-b ${theme === 'light' ? 'border-[#E2E8F0]' : 'border-[#2A2D32]'}`}>
                  <span className={`text-[8px] font-bold tracking-[0.15em] uppercase ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>TIPE VERIFIKASI</span>
                  <span className={`text-[9px] font-bold text-right ${theme === 'light' ? 'text-[#0284C7]' : 'text-[#2EAFF9]'}`}>Manual Override</span>
                </div>
                {/* Row 2 */}
                <div className={`flex justify-between items-center px-3 py-2 border-b ${theme === 'light' ? 'border-[#E2E8F0]' : 'border-[#2A2D32]'}`}>
                  <span className={`text-[8px] font-bold tracking-[0.15em] uppercase ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>ALASAN</span>
                  <span className={`text-[9px] font-bold text-right ${theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>Ketidaksesuaian Data (Plat Berbeda)</span>
                </div>
                {/* Row 3 */}
                <div className={`flex justify-between items-center px-3 py-2 border-b ${theme === 'light' ? 'border-[#E2E8F0]' : 'border-[#2A2D32]'}`}>
                  <span className={`text-[8px] font-bold tracking-[0.15em] uppercase ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>OPERATOR</span>
                  <span className={`text-[9px] font-bold text-right ${theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>SGT. Ardiansyah</span>
                </div>
                {/* Row 4 */}
                <div className="flex justify-between items-center px-3 py-2">
                  <span className={`text-[8px] font-bold tracking-[0.15em] uppercase ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>TIMESTAMP</span>
                  <span className={`text-[9px] font-bold font-mono tracking-wider text-right ${theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>07:49:33 - 26 January 2026</span>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className={`border rounded-lg p-3 mb-5 flex items-center ${theme === 'light' ? 'bg-[#F1F5F9] border-[#E2E8F0]' : 'bg-[#0B0D10] border-[#2A2D32]'}`}>
              <Info className={`w-3 h-3 mr-2 shrink-0 ${theme === 'light' ? 'text-[#0284C7]' : 'text-[#2EAFF9]'}`} />
              <span className={`text-[8px] leading-relaxed ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>
                <span className={`font-bold ${theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>Catatan:</span> Akses manual telah dicatat dalam sistem audit keamanan pusat ASENTRIM.
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className={`text-[8px] font-bold tracking-[0.2em] uppercase ${theme === 'light' ? 'text-[#10B981]' : 'text-[#00DF89]'}`}>GATE OPENING ...</span>
                <span className={`text-[8px] font-bold font-mono ${theme === 'light' ? 'text-[#10B981]' : 'text-[#00DF89]'}`}>100%</span>
              </div>
              <div className={`h-1 rounded-full overflow-hidden border ${theme === 'light' ? 'bg-[#E2E8F0] border-[#E2E8F0]' : 'bg-[#16181C] border-[#2A2D32]'}`}>
                <div className={`h-full w-full ${theme === 'light' ? 'bg-[#10B981]' : 'bg-[#00DF89] shadow-[0_0_10px_#00DF89]'}`}></div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-auto">
              <button className={`flex-1 border font-bold text-[9px] tracking-[0.15em] uppercase h-[36px] rounded-md flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-white hover:bg-gray-50 border-[#CBD5E1] text-[#475569]' : 'bg-[#0B0D10] hover:bg-[#16181C] border-[#2A2D32] text-white'}`}>
                <List className="w-3.5 h-3.5 mr-1.5" />
                LIHAT LOG
              </button>
              <button onClick={() => setShowAccessGranted(false)} className={`flex-1 font-black text-[9px] tracking-[0.15em] uppercase h-[36px] rounded-md flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-[#10B981] hover:bg-[#10B981]/90 shadow-md shadow-[#10B981]/20' : 'bg-[#2EAFF9] hover:bg-[#2EAFF9]/90 shadow-[0_0_15px_rgba(46,175,249,0.3)]'}`} style={{ color: theme === 'light' ? '#FFFFFF' : '#0B0D10' }}>
                <Check className="w-3.5 h-3.5 mr-1.5" strokeWidth={3} />
                SELESAI
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Access Denied Popup Overlay */}
      {showAccessDenied && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200 ${theme === 'light' ? 'bg-[#F1F5F9]/80' : 'bg-[#121416]/80'}`}>
          <div className={`helpdesk-result-dialog ${theme === 'light' ? 'bg-[#FFFFFF] border-[#EF4444] shadow-xl' : 'bg-[#0B0D10] border-[#EF4444] shadow-[0_0_30px_rgba(239,68,68,0.15)]'} border rounded-xl p-6 w-full max-w-[420px] relative flex flex-col`}>
            
            {/* System State Banner */}
            <div className={`border rounded-md px-3 py-2 mb-5 flex items-center ${theme === 'light' ? 'bg-[#FEF2F2] border-[#EF4444]/30' : 'bg-[#EF4444]/[0.02] border-[#EF4444]/60 shadow-[inset_0_0_10px_rgba(239,68,68,0.05)]'}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-2.5 ${theme === 'light' ? 'bg-[#EF4444]' : 'bg-[#EF4444] shadow-[0_0_8px_#EF4444]'}`}></div>
              <span className={`font-mono text-[8px] sm:text-[9px] tracking-[0.2em] font-bold uppercase text-[#EF4444]`}>SYSTEM STATE: ACCESS REJECTED / LOCKED</span>
            </div>

            {/* Icon & Title */}
            <div className="flex flex-col items-center justify-center mb-5">
              <div className={`w-12 h-12 rounded-full border-[2px] flex items-center justify-center mb-3 ${theme === 'light' ? 'border-[#EF4444] bg-[#FEF2F2] shadow-sm' : 'border-[#EF4444] bg-[#EF4444]/15 shadow-[0_0_20px_rgba(239,68,68,0.15)]'}`}>
                 <XCircle className={`w-6 h-6 text-[#EF4444]`} strokeWidth={1.5} />
              </div>
              <h2 className={`text-[20px] font-black tracking-widest mb-1 text-[#EF4444] ${theme === 'dark' ? 'shadow-[#EF4444]' : ''}`}>AKSES DITOLAK</h2>
              <p className={`tracking-[0.3em] text-[8px] font-medium uppercase text-center ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>ACCESS DENIED // CRITICAL STOP TRIGGERED</p>
            </div>

            {/* License Plate Box */}
            <div className={`border rounded-lg py-3 px-4 mb-5 flex flex-col items-center ${theme === 'light' ? 'bg-[#FEF2F2] border-[#FEE2E2]' : 'bg-[#16181C] border-[#2A2D32] shadow-inner'}`}>
              <span className={`text-[8px] font-bold tracking-[0.2em] uppercase mb-1.5 text-center text-[#EF4444]`}>VEHICLE LICENSE PLATE</span>
              <span className={`text-3xl font-black tracking-widest mb-2 text-center text-[#EF4444] ${theme === 'dark' ? 'drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]' : ''}`}>B 1234 TNI</span>
              <div className={`flex items-center text-[8px] font-bold tracking-widest ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>
                 <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1.5">
                   <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                   <path d="M9 22v-4h6v4"></path>
                   <path d="M8 6h.01"></path>
                   <path d="M16 6h.01"></path>
                   <path d="M12 6h.01"></path>
                   <path d="M12 10h.01"></path>
                   <path d="M12 14h.01"></path>
                   <path d="M16 10h.01"></path>
                   <path d="M16 14h.01"></path>
                   <path d="M8 10h.01"></path>
                   <path d="M8 14h.01"></path>
                 </svg>
                 GATE 01 - ENTRY
              </div>
            </div>

            {/* Authorization Manifest */}
            <div className="mb-5">
              <span className={`text-[8px] font-bold tracking-[0.2em] uppercase mb-1.5 block ${theme === 'light' ? 'text-[#64748B]' : 'text-gray-500'}`}>REJECTION MANIFEST</span>
              <div className={`border rounded-lg flex flex-col overflow-hidden ${theme === 'light' ? 'bg-[#F8FAFC] border-[#E2E8F0]' : 'bg-[#16181C] border-[#2A2D32]'}`}>
                {/* Row 1 */}
                <div className={`flex justify-between items-center px-3 py-2 border-b ${theme === 'light' ? 'border-[#E2E8F0]' : 'border-[#2A2D32]'}`}>
                  <span className={`text-[8px] font-bold tracking-[0.15em] uppercase ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>TIPE VERIFIKASI</span>
                  <span className={`text-[9px] font-bold text-right ${theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>Manual Override</span>
                </div>
                {/* Row 2 */}
                <div className={`flex justify-between items-center px-3 py-2 border-b ${theme === 'light' ? 'border-[#E2E8F0]' : 'border-[#2A2D32]'}`}>
                  <span className={`text-[8px] font-bold tracking-[0.15em] uppercase ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>ALASAN PENOLAKAN</span>
                  <span className={`text-[9px] font-bold text-right text-[#EF4444]`}>Ketidaksesuaian Data (Plat Berbeda)</span>
                </div>
                {/* Row 3 */}
                <div className={`flex justify-between items-center px-3 py-2 border-b ${theme === 'light' ? 'border-[#E2E8F0]' : 'border-[#2A2D32]'}`}>
                  <span className={`text-[8px] font-bold tracking-[0.15em] uppercase ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>OPERATOR</span>
                  <span className={`text-[9px] font-bold text-right ${theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>SGT. Ardiansyah</span>
                </div>
                {/* Row 4 */}
                <div className="flex justify-between items-center px-3 py-2">
                  <span className={`text-[8px] font-bold tracking-[0.15em] uppercase ${theme === 'light' ? 'text-[#475569]' : 'text-gray-400'}`}>TIMESTAMP</span>
                  <span className={`text-[9px] font-bold font-mono tracking-wider text-right ${theme === 'light' ? 'text-[#0F172A]' : 'text-white'}`}>07:49:33 - 26 January 2026</span>
                </div>
              </div>
            </div>

            {/* Warning Box */}
            <div className={`border rounded-lg p-3 mb-5 flex items-center ${theme === 'light' ? 'bg-[#FEF2F2] border-[#FEE2E2]' : 'bg-[#0B0D10] border-[#EF4444]/30'}`}>
              <AlertTriangle className={`w-3 h-3 mr-2 shrink-0 text-[#EF4444]`} />
              <span className={`text-[8px] leading-relaxed text-[#EF4444]`}>
                <span className={`font-bold`}>PERINGATAN:</span> Kendaraan telah ditandai untuk pemeriksaan lebih lanjut oleh otoritas keamanan pusat ASENTRIM.
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-1.5">
                <span className={`text-[8px] font-bold tracking-[0.2em] uppercase text-[#EF4444]`}>BARRIER SYSTEM: GATE LOCKED</span>
                <span className={`text-[8px] font-bold font-mono text-[#EF4444]`}>SECURE 100%</span>
              </div>
              <div className={`h-1 rounded-full overflow-hidden border ${theme === 'light' ? 'bg-[#FEE2E2] border-[#FEE2E2]' : 'bg-[#16181C] border-[#2A2D32]'}`}>
                <div className={`h-full w-full bg-[#EF4444] ${theme === 'dark' ? 'shadow-[0_0_10px_#EF4444]' : ''}`}></div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-auto">
              <button className={`flex-1 border font-bold text-[9px] tracking-[0.15em] uppercase h-[36px] rounded-md flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-white hover:bg-gray-50 border-[#CBD5E1] text-[#475569]' : 'bg-[#0B0D10] hover:bg-[#16181C] border-[#2A2D32] text-white'}`}>
                <List className="w-3.5 h-3.5 mr-1.5" />
                LIHAT LOG
              </button>
              <button onClick={() => setShowAccessDenied(false)} className={`flex-1 font-black text-[9px] tracking-[0.15em] uppercase h-[36px] rounded-md flex items-center justify-center transition-colors ${theme === 'light' ? 'bg-[#EF4444] hover:bg-[#EF4444]/90 shadow-md shadow-[#EF4444]/20' : 'bg-[#EF4444] hover:bg-[#EF4444]/90 shadow-[0_0_15px_rgba(239,68,68,0.3)]'}`} style={{ color: theme === 'light' ? '#FFFFFF' : '#0B0D10' }}>
                <Check className="w-3.5 h-3.5 mr-1.5" strokeWidth={3} />
                SELESAI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
