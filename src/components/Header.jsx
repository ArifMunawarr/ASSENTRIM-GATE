import React, { useState, useRef, useEffect } from 'react'
import { LayoutDashboard, History, HeadphonesIcon, Settings, Moon, Sun } from 'lucide-react'
import logoImageDark from '../assets/logologindark.svg'
import logoImageLight from '../assets/logologinlight.svg'
import userIcon from '../assets/usericon.svg'
import logOutIcon from '../assets/logoticon.svg'

export default function Header({ activePage, onNavigate, theme = 'dark', onToggleTheme, onLogout }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const popupRef = useRef(null)
  const isDarkMode = theme === 'dark'

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-16 sm:h-[4.5rem] flex items-center justify-between px-4 sm:px-6 bg-[#121416] shrink-0 z-50 relative" style={{ borderBottom: `1px solid ${isDarkMode ? '#47483C' : '#D8D8D8'}` }}>
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <img src={isDarkMode ? logoImageDark : logoImageLight} alt="Logo" className="w-6 h-6 sm:w-8 sm:h-8" />
        <h1 className="hidden md:block text-lg sm:text-xl font-black text-[#2EAFF9] tracking-wide uppercase mt-0.5">
          ASENTRIM
        </h1>
        <h1 className="hidden lg:block text-lg sm:text-xl font-black text-[#2EAFF9] tracking-wide uppercase mt-0.5">
          GATE COMMAND
        </h1>
      </div>

      <nav className="flex items-center h-full overflow-x-auto no-scrollbar ml-4 sm:ml-0 flex-1 lg:flex-none justify-start lg:justify-center">
        <button 
          onClick={() => onNavigate && onNavigate('dashboard')} 
          className={`h-full px-4 sm:px-6 flex items-center justify-center gap-2 border-b-2 font-bold text-[10px] sm:text-xs tracking-wider whitespace-nowrap transition-colors ${
            activePage === 'dashboard' 
              ? 'border-[#2EAFF9] bg-[#1a2235]/40 text-[#2EAFF9]' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard size={14} strokeWidth={2.5} />
          Dashboard
        </button>
        <button 
          onClick={() => onNavigate && onNavigate('activitylogs')} 
          className={`h-full px-4 sm:px-6 flex items-center justify-center gap-2 border-b-2 font-bold text-[10px] sm:text-xs tracking-wider whitespace-nowrap transition-colors ${
            activePage === 'activitylogs' 
              ? 'border-[#2EAFF9] bg-[#1a2235]/40 text-[#2EAFF9]' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <History size={14} strokeWidth={2.5} />
          Activity Logs
        </button>
        <button 
          onClick={() => onNavigate && onNavigate('helpdesk')} 
          className={`h-full px-4 sm:px-6 flex items-center justify-center gap-2 border-b-2 font-bold text-[10px] sm:text-xs tracking-wider whitespace-nowrap transition-colors ${
            activePage === 'helpdesk' 
              ? 'border-[#2EAFF9] bg-[#1a2235]/40 text-[#2EAFF9]' 
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HeadphonesIcon size={14} strokeWidth={2.5} />
          Operator Help Desk
        </button>
      </nav>

      <div className="hidden xl:flex items-center gap-6 justify-end shrink-0 w-[24rem]">
        <div className="flex flex-col items-end">
          <div className="text-[9px] font-black tracking-[0.2em] text-slate-400 uppercase">
            SYSTEM TIME : 06:54:21:537
          </div>
          <div className="text-[9px] font-black tracking-[0.2em] text-[#2EAFF9] mt-1 uppercase">
            SYNC STATUS: STABLE
          </div>
        </div>
        
        <div className="relative" ref={popupRef}>
          <button 
            className={`text-slate-400 hover:text-white transition-colors ${isSettingsOpen ? 'text-white' : ''}`}
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings size={20} />
          </button>

          {isSettingsOpen && (
            <div className={`absolute top-full right-0 mt-4 w-[210px] shadow-2xl py-2 flex flex-col rounded-[6px] ${!isDarkMode ? 'bg-white border-0' : 'bg-[#181C22] border border-[#444841]'}`}>
              <button 
                onClick={() => {
                  if (onNavigate) onNavigate('profile');
                  setIsSettingsOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 transition-colors text-[15px] font-medium tracking-wide ${!isDarkMode ? 'text-[#1F2937] hover:bg-slate-50' : 'text-white hover:bg-white/5'}`}
              >
                <img src={userIcon} alt="Profile" className={`w-[20px] h-[20px] ${!isDarkMode ? 'brightness-0 opacity-80' : ''}`} />
                Profile
              </button>
              
              <button
                onClick={() => {
                  if (onLogout) onLogout()
                  setIsSettingsOpen(false)
                }}
                className={`flex items-center gap-3 px-4 py-3 transition-colors text-[15px] font-medium tracking-wide ${!isDarkMode ? 'text-[#1F2937] hover:bg-slate-50' : 'text-white hover:bg-white/5'}`}
              >
                <img src={logOutIcon} alt="Log Out" className={`w-[20px] h-[20px] ${!isDarkMode ? 'brightness-0 opacity-80' : ''}`} />
                Log Out
              </button>

              <div className={`h-px mx-4 my-2 ${!isDarkMode ? 'bg-[#E5E7EB]' : 'bg-[#444841]'}`} />

              <button type="button" onClick={onToggleTheme} className={`flex items-center justify-between px-4 py-3 text-left transition-colors duration-300 ${!isDarkMode ? 'hover:bg-slate-50' : 'hover:bg-white/5'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-[34px] h-[34px] rounded-[8px] bg-[#1C2434] flex items-center justify-center shrink-0">
                    <Moon size={18} className={`transition-colors duration-300 ${!isDarkMode ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-[14px] font-semibold tracking-wide transition-colors duration-300 ${!isDarkMode ? 'text-[#1F2937]' : 'text-white'}`}>Dark Mode</span>
                    <span className={`text-[12px] font-medium mt-0.5 transition-colors duration-300 ${!isDarkMode ? 'text-[#6B7280]' : 'text-[#2EAFF9]'}`}>{isDarkMode ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
                <div className={`${isDarkMode ? 'bg-[#3b82f6]' : 'bg-[#E2E8F0]'} w-[44px] h-[24px] rounded-full flex items-center px-[2px] cursor-pointer transition-colors duration-300 shrink-0`}>
                  <div className={`w-[20px] h-[20px] bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${isDarkMode ? 'translate-x-[20px]' : 'translate-x-0'}`} />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
