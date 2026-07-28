import React from 'react'
import Header from '../components/Header'
import { Car, Shield, FileEdit, History, ChevronRight } from 'lucide-react'
import fotdriver from '../assets/fotdriver.png'
import das1 from '../assets/das1.png'
import das2 from '../assets/das2.png'

export default function DetailLog({ logData, onNavigate, theme, onToggleTheme, onLogout }) {
  const isLight = theme === 'light'

  // Default mock data if logData is partial
  const data = {
    id: logData?.id || '22323232323',
    plate: logData?.plate || 'B 1234 TNI',
    type: logData?.type || 'SUV',
    color: logData?.color || 'Hitam',
    brand: logData?.brand || 'Toyota Fortuner',
    year: logData?.year || '2022',
    rfidTag: logData?.rfidTag || 'RFID-2023-0847-TNI',
    rfidStatus: logData?.rfidStatus || 'VERIFIED',
    driver: logData?.driver || 'Anton Ruman',
    gateMasuk: logData?.gateMasuk || 'GATE 01 - Main Entrance',
    gateKeluar: logData?.gateKeluar || 'GATE 02 - Side Exit',
    waktuMasuk: logData?.waktuMasuk ? `${logData.date || '2023-10-24'} ${logData.waktuMasuk}` : '2023-10-24 09:12:44',
    waktuKeluar: logData?.waktuKeluar ? `${logData.date || '2023-10-24'} ${logData.waktuKeluar}` : '2023-10-24 17:45:12',
    durasi: logData?.durasi || '8 jam 32 menit',
    status: logData?.status || 'DITERIMA',
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
    <div className={`min-h-screen flex flex-col font-display ${isLight ? 'bg-[#FAFAFA] text-[#1F2937]' : 'bg-[#0B1326] text-white'}`}>
      {/* Header */}
      <Header activePage="activitylogs" onNavigate={onNavigate} theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout} />

      {/* Page Content */}
      <div className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 2xl:px-6 2xl:py-4 flex flex-col gap-2.5 sm:gap-3 2xl:gap-4">
        
        {/* Title & Breadcrumb Header */}
        <div className="flex flex-col gap-0.5 shrink-0">
          <div className="flex items-center gap-1.5 text-[9px] 2xl:text-[11px] font-black tracking-widest text-slate-400 uppercase">
            <button 
              onClick={() => onNavigate && onNavigate('activitylogs')} 
              className={`hover:text-[#2EAFF9] transition-colors ${isLight ? 'text-[#0C5F9A]' : 'text-slate-400'}`}
            >
              ACTIVITY LOGS & REPORTS
            </button>
            <ChevronRight className="w-3 h-3 text-slate-500" />
            <span className={isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}>DETAIL LOG</span>
          </div>
          <h2 className={`text-lg 2xl:text-[24px] font-bold tracking-wide ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>
            Detail Log
          </h2>
          <div className={`text-[12px] 2xl:text-[14px] font-bold ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
            #{data.id}
          </div>
        </div>

        {/* Top Section - 3 Photo Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_22.5%] gap-2.5 sm:gap-3 2xl:gap-4 shrink-0">
          
          {/* Card 1: Foto Kendaraan Masuk */}
          <div className={`relative border rounded-sm overflow-hidden h-36 sm:h-44 2xl:h-52 group ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
            <img src={data.fotoMasuk} alt="Foto Kendaraan Masuk" className="w-full h-full object-cover" />
            {/* Top-Left Overlay */}
            <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-sm flex flex-col backdrop-blur-xs ${isLight ? 'bg-[#00000066]' : 'bg-[#00000099]'}`}>
              <span className={`text-[8.5px] 2xl:text-[10px] font-black tracking-wider uppercase ${isLight ? 'text-[#FFFFFF]' : 'text-[#2EAFF9]'}`}>CAMERA ENTRY CAPTURE</span>
              <span className={`text-[8.5px] 2xl:text-[10px] font-medium ${isLight ? 'text-[#FFFFFF]' : 'text-slate-200'}`}>{data.waktuMasuk} - {data.gateMasuk.split(' - ')[0]}</span>
            </div>
            {/* Bottom-Right Overlay */}
            <div className={`absolute bottom-2 right-2 px-3 py-1 rounded-sm backdrop-blur-xs ${isLight ? 'bg-[#FFFFFFE5] border border-[#0066CC]' : 'bg-[#0B1326E6] border border-[#2EAFF9]'}`}>
              <span className={`text-[8.5px] 2xl:text-[10.5px] font-black tracking-widest uppercase ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>FOTO KENDARAAN MASUK</span>
            </div>
          </div>

          {/* Card 2: Foto Kendaraan Keluar */}
          <div className={`relative border rounded-sm overflow-hidden h-36 sm:h-44 2xl:h-52 group ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
            <img src={data.fotoKeluar} alt="Foto Kendaraan Keluar" className="w-full h-full object-cover" />
            {/* Top-Left Overlay */}
            <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-sm flex flex-col backdrop-blur-xs ${isLight ? 'bg-[#00000066]' : 'bg-[#00000099]'}`}>
              <span className={`text-[8.5px] 2xl:text-[10px] font-black tracking-wider uppercase ${isLight ? 'text-[#FFFFFF]' : 'text-[#2EAFF9]'}`}>CAMERA EXIT CAPTURE</span>
              <span className={`text-[8.5px] 2xl:text-[10px] font-medium ${isLight ? 'text-[#FFFFFF]' : 'text-slate-200'}`}>{data.waktuKeluar} - {data.gateKeluar.split(' - ')[0]}</span>
            </div>

            {/* Bottom-Right Overlay */}
            <div className={`absolute bottom-2 right-2 px-3 py-1 rounded-sm backdrop-blur-xs ${isLight ? 'bg-[#FFFFFFE5] border border-[#0066CC]' : 'bg-[#0B1326E6] border border-[#2EAFF9]'}`}>
              <span className={`text-[8.5px] 2xl:text-[10.5px] font-black tracking-widest uppercase ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>FOTO KENDARAAN KELUAR</span>
            </div>
          </div>

          {/* Card 3: Driver Info */}
          <div className={`border rounded-sm p-2 2xl:p-2.5 flex gap-2.5 2xl:gap-3 items-center h-36 sm:h-44 2xl:h-52 ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
            <div className="relative aspect-square h-full rounded-sm overflow-hidden border border-[#444841] bg-[#121416] shrink-0">
              <img src={fotdriver} alt="Foto Driver" className="w-full h-full object-cover" />
              <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[7px] 2xl:text-[8px] font-black tracking-widest uppercase whitespace-nowrap ${isLight ? 'bg-[#00000099] text-[#FFFFFF]' : 'bg-[#00000099] text-[#2EAFF9]'}`}>
                FOTO DRIVER
              </div>
            </div>
            <div className="flex flex-col justify-center min-w-0 flex-1">
              {/* Nama Driver color: #C5C8BE */}
              <div className={`text-[8px] 2xl:text-[9.5px] font-bold tracking-widest uppercase mb-0.5 ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>NAMA DRIVER</div>
              <div className={`text-sm sm:text-base 2xl:text-lg font-bold tracking-wide truncate ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>{data.driver}</div>
            </div>
          </div>

        </div>

        {/* Bottom Section - 2 Columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-3 2xl:gap-4">
          
          {/* Left Column: Data Kendaraan & Catatan Operator */}
          <div className="flex flex-col gap-2.5 sm:gap-3 2xl:gap-4">
            
            {/* Data Kendaraan - #1C2026 border #444841 */}
            <div className={`border rounded-sm p-3 2xl:p-4 flex flex-col ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
              <div className="flex items-center gap-2 mb-1.5 2xl:mb-2 shrink-0">
                <Car className={`w-4 h-4 ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                <h3 className={`text-[10px] 2xl:text-[12px] font-black tracking-wider uppercase ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                  DATA KENDARAAN
                </h3>
              </div>
              <div className="flex flex-col divide-y divide-[#444841]/50">
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>NOMOR PLAT</span>
                  <span className={`font-bold tracking-wide ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>{data.plate}</span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>TIPE KENDARAAN</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.type}</span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>WARNA</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.color}</span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>MEREK</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.brand}</span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>TAHUN</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.year}</span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>RFID TAG</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.rfidTag}</span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>RFID STATUS</span>
                  <span className={`inline-block px-2.5 py-0.5 text-[9.5px] 2xl:text-[11px] font-bold tracking-wider uppercase rounded border ${
                    data.rfidStatus === 'VERIFIED'
                      ? (isLight ? 'border-[#0C5F9A] text-[#0C5F9A] bg-[#0C5F9A]/10' : 'border-[#2EAFF9] text-[#2EAFF9] bg-[#2EAFF9]/10')
                      : (isLight ? 'border-[#EF4444] text-[#EF4444] bg-[#EF4444]/10' : 'border-[#FFB4AB] text-[#FFB4AB] bg-[#FFB4AB]/10')
                  }`}>
                    {data.rfidStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Catatan Operator - outer #1C2026 border #444841, inner #181C22 border #444841 */}
            <div className={`border rounded-sm p-3 2xl:p-4 ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
              <div className="flex items-center gap-2 mb-2 shrink-0">
                <FileEdit className={`w-4 h-4 ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                <h3 className={`text-[10px] 2xl:text-[12px] font-black tracking-wider uppercase ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                  CATATAN OPERATOR
                </h3>
              </div>
              <div className={`p-2.5 2xl:p-3 rounded-sm border text-[10px] 2xl:text-[12px] leading-relaxed ${isLight ? 'bg-[#F7F8FC] border-[#D8D8D8] text-slate-700' : 'bg-[#181C22] border-[#444841] text-slate-300'}`}>
                {data.catatan}
              </div>
            </div>

          </div>

          {/* Right Column: Data Akses Gate & Riwayat Akses Terakhir */}
          <div className="flex flex-col gap-2.5 sm:gap-3 2xl:gap-4">
            
            {/* Data Akses Gate - #1C2026 border #444841 */}
            <div className={`border rounded-sm p-3 2xl:p-4 flex flex-col ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
              <div className="flex items-center gap-2 mb-1.5 2xl:mb-2 shrink-0">
                <Shield className={`w-4 h-4 ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                <h3 className={`text-[10px] 2xl:text-[12px] font-black tracking-wider uppercase ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                  DATA AKSES GATE
                </h3>
              </div>
              <div className="flex flex-col divide-y divide-[#444841]/50">
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>ID LOG</span>
                  <span className={`font-bold tracking-wide ${isLight ? 'text-[#1F2937]' : 'text-white'}`}>{data.id}</span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>GATE MASUK</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.gateMasuk}</span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>GATE KELUAR</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.gateKeluar}</span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>WAKTU MASUK</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.waktuMasuk}</span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>WAKTU KELUAR</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.waktuKeluar}</span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>DURASI</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.durasi}</span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>STATUS</span>
                  <span className={`text-[9px] 2xl:text-[11px] font-black tracking-widest px-2.5 py-0.5 uppercase ${
                    data.status === 'DITOLAK' 
                      ? (isLight ? 'bg-[#FF1B001A] text-[#EF4444] border-l-[4px] border-[#EF4444]' : 'bg-[#FFB4AB1A] text-[#FFB4AB] border-l-[4px] border-[#FFB4AB]') 
                      : (isLight ? 'bg-[#0000001A] text-[#0C5F9A] border-l-[4px] border-[#0C5F9A]' : 'bg-[#BCCBB11A] text-[#2EAFF9] border-l-[4px] border-[#2EAFF9]')
                  }`}>
                    {data.status}
                  </span>
                </div>
                <div className="py-1.5 2xl:py-2 flex items-center justify-between text-[10px] 2xl:text-[12px]">
                  <span className={`font-bold tracking-wider uppercase ${isLight ? 'text-slate-500' : 'text-[#C5C8BE]'}`}>OPERATOR</span>
                  <span className={`font-medium ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{data.operator}</span>
                </div>
              </div>
            </div>

            {/* Riwayat Akses Terakhir Kendaraan - #1C2026 border #444841 */}
            <div className={`border rounded-sm p-3 2xl:p-4 ${isLight ? 'bg-white border-[#D8D8D8]' : 'bg-[#1C2026] border-[#444841]'}`}>
              <div className="flex items-center gap-2 mb-2 shrink-0">
                <History className={`w-4 h-4 ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                <h3 className={`text-[10px] 2xl:text-[12px] font-black tracking-wider uppercase ${isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
                  RIWAYAT AKSES TERAKHIR KENDARAAN
                </h3>
              </div>
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left text-[9.5px] 2xl:text-[11.5px]">
                  <thead>
                    <tr className={`border-b ${isLight ? 'bg-[#F3F4F6] border-slate-200 detail-log-tr' : 'border-[#444841]/60'}`}>
                      <th className={`py-1.5 px-2 font-bold tracking-wider uppercase ${isLight ? 'text-[#4B5563] detail-log-th' : 'text-[#C5C8BE]'}`}>WAKTU</th>
                      <th className={`py-1.5 px-2 font-bold tracking-wider uppercase ${isLight ? 'text-[#4B5563] detail-log-th' : 'text-[#C5C8BE]'}`}>GATE</th>
                      <th className={`py-1.5 px-2 font-bold tracking-wider uppercase text-right ${isLight ? 'text-[#4B5563] detail-log-th' : 'text-[#C5C8BE]'}`}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#444841]/40">
                    {data.riwayat.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className={`py-1.5 px-2 font-medium whitespace-nowrap ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{item.waktu}</td>
                        <td className={`py-1.5 px-2 font-medium whitespace-nowrap ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>{item.gate}</td>
                        <td className="py-1.5 px-2 font-bold text-right whitespace-nowrap">
                          <span className={isLight ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}>{item.status}</span>
                        </td>
                      </tr>
                    ))}
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
