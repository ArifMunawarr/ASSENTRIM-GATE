import React from 'react'
import Header from '../components/Header'
import { Car, Shield, FileEdit, History, ChevronRight, CameraOff } from 'lucide-react'

import fotdriver from '../assets/fotdriver.png'
import das1 from '../assets/das1.png'
import das2 from '../assets/das2.png'

export default function DetailLog({ logData, onNavigate, theme, onToggleTheme, onLogout }) {
  const isLight = theme === 'light'

  // Default mock data if logData is partial
  const data = {
    id: logData?.id || '22323232323',
    status: logData?.status || 'DITERIMA',
    plate: logData?.plate || 'B 1234 TNI',
    type: logData?.type || 'SUV',
    color: logData?.color || 'Hitam',
    brand: logData?.brand || 'Toyota Fortuner',
    year: logData?.year || '2022',
    rfidTag: logData?.rfidTag || 'RFID-2023-0847-TNI',
    rfidStatus: logData?.rfidStatus || 'VERIFIED',
    rfidOk: logData?.rfidOk ?? true,
    driver: logData?.driver || 'Anton Ruman',
    gateMasuk: logData?.gateMasuk || 'GATE 01 - Main Entrance',
    gateKeluar: logData?.gateKeluar || 'GATE 02 - Side Exit',
    waktuMasuk: logData?.waktuMasuk ? `${logData.date || '2023-10-24'} ${logData.waktuMasuk}` : '2023-10-24 09:12:44',
    waktuKeluar: logData?.waktuKeluar ? `${logData.date || '2023-10-24'} ${logData.waktuKeluar}` : '2023-10-24 17:45:12',
    durasi: logData?.durasi || '8 jam 32 menit',
    operator: logData?.operator || 'Sgt. Pratama',
    fotoMasuk: logData?.fotoMasuk || das1,
    fotoKeluar: logData?.fotoKeluar || das2,
    catatan: logData?.catatan || 'Kendaraan dinas resmi, verifikasi RFID berhasil. Tidak ada catatan khusus.',
    riwayat: logData?.riwayat || [
      { waktu: '2023-10-23 08:44:12', gate: 'GATE 01 - Main Entrance', status: 'VERIFIED' },
      { waktu: '2023-10-22 17:10:05', gate: 'GATE 02 - Side Exit', status: 'VERIFIED' },
      { waktu: '2023-10-22 09:01:52', gate: 'GATE 01 - Main Entrance', status: 'VERIFIED' }
    ]
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
          --u: clamp(0.7px, min(calc(100vw / 1827.3), calc(100vh / 1032.38)), var(--detail-baseline-unit));
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

        /* ===== Driver card ===== */
        .dl-driver-card { height: calc(223.5 * var(--u)); padding: calc(10 * var(--u)); gap: calc(12.5 * var(--u)); }
        .dl-driver-badge { bottom: calc(5 * var(--u)); padding: calc(2.5 * var(--u)) calc(7.5 * var(--u)); font-size: calc(9 * var(--u)); }
        .dl-driver-label { font-size: calc(10 * var(--u)); margin-bottom: calc(2.5 * var(--u)); }
        .dl-driver-name { font-size: calc(20 * var(--u)); line-height: calc(30.5 * var(--u)); }

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

        {/* Top Section - 3 Photo Cards */}
        <div className="dl-top-grid grid grid-cols-1 min-[1100px]:grid-cols-[1fr_1fr_22.5%] shrink-0">


          
          {/* Card 1: Foto Kendaraan Masuk */}
          <div className={`dl-photo-card relative border rounded-sm overflow-hidden group bg-[#000000] ${isLight ? 'border-[#D8D8D8]' : 'border-[#444841]'}`}>
            {data.fotoMasuk ? (
              <img src={data.fotoMasuk} alt="Foto Kendaraan Masuk" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1 bg-[#121416]">
                <CameraOff className="dl-cam-icon" />
                <span className="dl-cam-text font-bold tracking-wider uppercase">TIDAK ADA FOTO MASUK</span>
              </div>
            )}
            {/* Top-Left Overlay */}
            <div className="dl-ov-tl absolute bg-[#00000066] rounded-sm flex flex-col backdrop-blur-xs">
              <span className={`dl-ov-text font-black tracking-wider uppercase ${isLight ? 'text-[#FFFFFF]' : 'text-[#2EAFF9]'}`}>CAMERA ENTRY CAPTURE</span>
              <span className={`dl-ov-text font-medium ${isLight ? 'text-[#FFFFFF]' : 'text-slate-200'}`}>{data.waktuMasuk} - {(data.gateMasuk || '-').split(' - ')[0]}</span>
            </div>
            {/* Bottom-Right Overlay */}
            <div className={`dl-ov-br absolute rounded-sm backdrop-blur-xs ${isLight ? 'bg-[#FFFFFFE5] border border-[#0066CC]' : 'bg-[#0B1326E6] border border-[#2EAFF9]'}`}>
              <span className={`dl-ov-text font-black tracking-widest uppercase ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>FOTO KENDARAAN MASUK</span>
            </div>
          </div>

          {/* Card 2: Foto Kendaraan Keluar */}
          <div className={`dl-photo-card relative border rounded-sm overflow-hidden group bg-[#000000] ${isLight ? 'border-[#D8D8D8]' : 'border-[#444841]'}`}>
            {data.fotoKeluar ? (
              <img src={data.fotoKeluar} alt="Foto Kendaraan Keluar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-1 bg-[#121416]">
                <CameraOff className="dl-cam-icon" />
                <span className="dl-cam-text font-bold tracking-wider uppercase">TIDAK ADA FOTO KELUAR</span>
              </div>
            )}
            {/* Top-Left Overlay */}
            <div className="dl-ov-tl absolute bg-[#00000066] rounded-sm flex flex-col backdrop-blur-xs">
              <span className={`dl-ov-text font-black tracking-wider uppercase ${isLight ? 'text-[#FFFFFF]' : 'text-[#2EAFF9]'}`}>CAMERA EXIT CAPTURE</span>
              <span className={`dl-ov-text font-medium ${isLight ? 'text-[#FFFFFF]' : 'text-slate-200'}`}>{data.waktuKeluar} - {(data.gateKeluar || '-').split(' - ')[0]}</span>

            </div>

            {/* Bottom-Right Overlay */}
            <div className={`dl-ov-br absolute rounded-sm backdrop-blur-xs ${isLight ? 'bg-[#FFFFFFE5] border border-[#0066CC]' : 'bg-[#0B1326E6] border border-[#2EAFF9]'}`}>
              <span className={`dl-ov-text font-black tracking-widest uppercase ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>FOTO KENDARAAN KELUAR</span>
            </div>
          </div>


          {/* Card 3: Driver Info */}
          <div className={`dl-driver-card border rounded-sm flex items-center ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
            <div className="relative aspect-square h-full rounded-sm overflow-hidden border border-[#444841] bg-[#000000] shrink-0">
              <img src={fotdriver} alt="Foto Driver" className="w-full h-full object-cover" />
              <div className={`dl-driver-badge absolute left-1/2 -translate-x-1/2 rounded font-black tracking-widest uppercase whitespace-nowrap ${isLight ? 'bg-[#00000099] text-[#FFFFFF]' : 'bg-[#00000099] text-[#2EAFF9]'}`}>
                FOTO DRIVER
              </div>
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1">
              {/* Nama Driver color: #C5C8BE */}
              <div className={`dl-driver-label font-bold tracking-widest uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>NAMA DRIVER</div>
              <div className={`dl-driver-name font-bold tracking-wide truncate ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>{data.driver}</div>
            </div>
          </div>

        </div>

        {/* Bottom Section - 2 Columns Layout */}
        <div className="dl-bottom-grid grid grid-cols-1 min-[1100px]:grid-cols-2">
          
          {/* Left Column: Data Kendaraan & Catatan Operator */}
          <div className="dl-col flex flex-col">
            
            {/* Data Kendaraan - #1C2026 border #444841 */}
            <div className={`dl-card border rounded-sm flex flex-col ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
              <div className="dl-card-head flex items-center shrink-0">
                <Car className={`dl-card-icon ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                <h3 className={`dl-card-title font-black tracking-wider uppercase ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                  DATA KENDARAAN
                </h3>
              </div>
              <div className="flex flex-col divide-y divide-[#444841]/50">
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>NOMOR PLAT</span>
                  <span className={`font-bold tracking-wide ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>{data.plate}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>TIPE KENDARAAN</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.type}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>WARNA</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.color}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>MEREK</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.brand}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>TAHUN</span>
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

            {/* Catatan Operator - outer #1C2026 border #444841, inner #181C22 border #444841 */}
            <div className={`dl-card border rounded-sm ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
              <div className="dl-card-head dl-card-head--lg flex items-center shrink-0">
                <FileEdit className={`dl-card-icon ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                <h3 className={`dl-card-title font-black tracking-wider uppercase ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                  CATATAN OPERATOR
                </h3>
              </div>
              <div className={`dl-note rounded-sm border leading-relaxed ${isLight ? 'bg-[#F7F8FC] border-[#D8D8D8] text-slate-700' : 'bg-[#181C22] border-[#444841] text-slate-300'}`}>
                {data.catatan}
              </div>
            </div>

          </div>

          {/* Right Column: Data Akses Gate & Riwayat Akses Terakhir */}
          <div className="dl-col flex flex-col">
            
            {/* Data Akses Gate - #1C2026 border #444841 */}
            <div className={`dl-card border rounded-sm flex flex-col ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
              <div className="dl-card-head flex items-center shrink-0">
                <Shield className={`dl-card-icon ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                <h3 className={`dl-card-title font-black tracking-wider uppercase ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                  DATA AKSES GATE
                </h3>
              </div>
              <div className="flex flex-col divide-y divide-[#444841]/50">
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>ID LOG</span>
                  <span className={`font-bold tracking-wide ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>{data.id}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>GATE MASUK</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.gateMasuk}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>GATE KELUAR</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.gateKeluar}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>WAKTU MASUK</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.waktuMasuk}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>WAKTU KELUAR</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.waktuKeluar}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>DURASI</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.durasi}</span>
                </div>
                <div className="dl-row flex items-center justify-between">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>STATUS</span>
                  <span className={`dl-status-badge font-black tracking-widest uppercase ${
                    data.status === 'DITOLAK' 
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

            {/* Riwayat Akses Terakhir Kendaraan - #1C2026 border #444841 */}
            <div className={`dl-card border rounded-sm ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
              <div className="dl-card-head dl-card-head--lg flex items-center shrink-0">
                <History className={`dl-card-icon ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                <h3 className={`dl-card-title font-black tracking-wider uppercase ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                  RIWAYAT AKSES TERAKHIR KENDARAAN
                </h3>
              </div>
              <div className="dl-riwayat-box overflow-y-auto overflow-x-auto no-scrollbar">
                <table className="dl-table w-full text-left">
                  <thead className="sticky top-0 z-10">
                    <tr className={`border-b ${isLight ? 'bg-[#F3F4F6] border-slate-200 detail-log-tr' : 'bg-[#1C2026] border-[#444841]/60'}`}>
                      <th className={`dl-th font-bold tracking-wider uppercase ${isLight ? 'text-[#4B5563] detail-log-th' : 'text-[#C5C8BE]'}`}>WAKTU</th>
                      <th className={`dl-th font-bold tracking-wider uppercase ${isLight ? 'text-[#4B5563] detail-log-th' : 'text-[#C5C8BE]'}`}>GATE</th>
                      <th className={`dl-th font-bold tracking-wider uppercase text-right ${isLight ? 'text-[#4B5563] detail-log-th' : 'text-[#C5C8BE]'}`}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#444841]/40">
                    {data.riwayat.length === 0 ? (
                      <tr>
                        <td colSpan={3} className={`dl-td-empty text-center font-medium ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                          TIDAK ADA RIWAYAT AKSES
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
