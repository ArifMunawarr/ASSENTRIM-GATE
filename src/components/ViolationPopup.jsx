import React, { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import processIcon from '../assets/process.svg';

export default function ViolationPopup() {
  const [violation, setViolation] = useState(null);

  useEffect(() => {
    let timeoutId;

    const handleShow = (e) => {
      setViolation(e.detail);
      
      // Auto hide popup after 8 seconds
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setViolation(null);
      }, 8000);
    };
    const handleHide = () => {
      setViolation(null);
      if (timeoutId) clearTimeout(timeoutId);
    };

    window.addEventListener('show-violation', handleShow);
    window.addEventListener('hide-violation', handleHide);

    return () => {
      window.removeEventListener('show-violation', handleShow);
      window.removeEventListener('hide-violation', handleHide);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!violation) return null;

  const getViolationMessage = (v) => {
    if (!v) return "";
    const gateStr = v.gateId ? ` berada di depan gate ${v.gateId}` : "";
    
    if (v.type === 'UNKNOWN_PLATE') {
      return `Sistem mendeteksi Plat tidak dikenal${gateStr}`;
    }
    if (v.type === 'OCR_RFID_MISMATCH') {
      return `Sistem mendeteksi ketidaksesuaian antara OCR dan Data RFID terdaftar${gateStr}`;
    }
    
    return v.message || `Sistem mendeteksi pelanggaran keamanan${gateStr}`;
  };

  return (
    <div className="fixed top-[90px] left-4 sm:top-[110px] sm:left-6 lg:top-[120px] lg:left-8 z-[9999] shadow-2xl animate-in fade-in slide-in-from-top-4">
      <div 
        className="flex items-center justify-between overflow-hidden border-l-[8px] border-[#FFB4AB]"
        style={{ 
          background: '#93000A',
          width: '100%',
          maxWidth: '920px',
          minWidth: '740px'
        }}
      >
        <div className="flex items-center px-5 py-4 2xl:px-7 2xl:py-5 gap-5 2xl:gap-7 flex-1 min-w-0">
          <AlertTriangle className="w-11 h-11 2xl:w-12 2xl:h-12 shrink-0" color="#FFB4AB" strokeWidth={2} />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-[15px] 2xl:text-[17px] tracking-wide uppercase truncate" style={{ color: '#FFB4AB' }}>
              PERINGATAN VERIFIKASI KENDARAAN
            </span>
            <span className="text-[13px] 2xl:text-[15px] mt-1 truncate" style={{ color: '#FFDAD6' }}>
              {getViolationMessage(violation)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center px-5 py-4 2xl:px-7 2xl:py-5 gap-6 2xl:gap-10 shrink-0 relative">
          <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-transparent pointer-events-none" />
          <div className="flex flex-col items-end justify-center relative z-10">
            <span className="font-bold tracking-[0.15em] text-[9px] 2xl:text-[10px] uppercase mb-1" style={{ color: '#FFDAD6' }}>TIMESTAMPS</span>
            <span className="font-medium text-[15px] 2xl:text-[18px] leading-none tracking-wide" style={{ color: '#FFDAD6' }}>{violation.timestamp || "07:49:33:156"}</span>
          </div>
          <button 
            onClick={() => setViolation(null)}
            style={{ background: '#C5C8BE' }}
            className="flex items-center justify-center gap-2.5 px-5 py-2.5 2xl:px-7 2xl:py-3 rounded-[2px] hover:brightness-110 transition-all relative z-10"
          >
            <img src={processIcon} alt="Process" className="w-4 h-4 2xl:w-5 2xl:h-5 opacity-90" />
            <span className="text-[#1E2022] font-bold text-[13px] 2xl:text-[15px] tracking-wide">Process</span>
          </button>
        </div>
      </div>
    </div>
  );
}
