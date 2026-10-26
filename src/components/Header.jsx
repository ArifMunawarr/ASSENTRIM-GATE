import React, { useState, useRef, useEffect } from 'react'
import { LayoutDashboard, History, HeadphonesIcon, Settings, Moon } from 'lucide-react'
import logoImageDark from '../assets/logologindark.svg'
import logoImageLight from '../assets/logologinlight.svg'
import userIcon from '../assets/usericon.svg'
import logOutIcon from '../assets/logoticon.svg'
import { OPERATOR_HELP_DESK_ENABLED } from '../features'

const navigationItems = [
  { page: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { page: 'activitylogs', label: 'Activity Logs', icon: History },
  { page: 'helpdesk', label: 'Operator Help Desk', icon: HeadphonesIcon, enabled: OPERATOR_HELP_DESK_ENABLED },
].filter(({ enabled }) => enabled !== false)

export default function Header({ activePage, onNavigate, theme = 'dark', onToggleTheme, onLogout }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const popupRef = useRef(null)
  const isDarkMode = theme === 'dark'
  const systemDate = new Intl.DateTimeFormat('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  }).format(new Date()).toUpperCase()

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
    <header className={`
      relative z-50 flex flex-none items-center justify-between border-b !shadow-none
      h-[calc(51*var(--header-unit))] px-[calc(19*var(--header-unit))]
      [--header-unit:calc(var(--layout-width,100vw)/1024)]
      [font-family:'Courier_New',monospace] text-[color:var(--header-text)]
      max-md:sticky max-md:top-0 max-md:h-[92px] max-md:px-4 max-md:pb-9 max-md:[--header-unit:1px]
      ${isDarkMode
        ? '[--header-accent:#2eaff9] [--header-text:#c8c7b8] [--header-active-bg:#27313a] border-[#32332d] bg-[#121416]'
        : '[--header-accent:#0c5f9a] [--header-text:#475569] [--header-active-bg:#e4f0f8] border-[#cbd5e1] bg-white'}
    `}>
      <div className="flex shrink-0 items-center gap-[calc(7*var(--header-unit))]">
        <img src={isDarkMode ? logoImageDark : logoImageLight} alt="" className="h-[calc(22*var(--header-unit))] w-[calc(22*var(--header-unit))]" />
        <h1 className="m-0 whitespace-nowrap [font-family:Arial,sans-serif] text-[length:calc(18*var(--header-unit))] font-bold leading-none tracking-[calc(-0.7*var(--header-unit))] text-[color:var(--header-accent)]">ASENTRIM GATE</h1>
      </div>

      <nav
        aria-label="Main navigation"
        className="absolute left-[calc(386*var(--header-unit))] grid h-full grid-flow-col auto-cols-[calc(113*var(--header-unit))] items-center gap-[calc(9*var(--header-unit))] max-md:bottom-0 max-md:left-3 max-md:right-3 max-md:h-9 max-md:auto-cols-fr max-md:gap-1"
      >
        {navigationItems.map(({ page, label, icon: Icon }) => (
          <button
            key={page}
            type="button"
            onClick={() => onNavigate?.(page)}
            aria-current={activePage === page ? 'page' : undefined}
            className="flex h-[calc(28*var(--header-unit))] items-center justify-center gap-[calc(6*var(--header-unit))] whitespace-nowrap border-b-[length:calc(2*var(--header-unit))] border-transparent bg-transparent p-0 [font-family:inherit] text-[length:calc(7.5*var(--header-unit))] font-bold leading-none tracking-[calc(0.2*var(--header-unit))] text-[color:var(--header-text)] transition-[background-color,border-color] duration-150 ease-[ease] hover:bg-[var(--header-active-bg)] aria-[current=page]:border-b-[color:var(--header-accent)] aria-[current=page]:bg-[var(--header-active-bg)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--header-accent)] motion-reduce:transition-none max-md:h-8 max-md:gap-[5px] max-md:text-[9px] max-md:tracking-normal"
          >
            <Icon aria-hidden="true" strokeWidth={2} className="h-[calc(10*var(--header-unit))] w-[calc(10*var(--header-unit))] shrink-0 max-md:h-3 max-md:w-3" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-[calc(9*var(--header-unit))]">
        <div className="flex flex-col items-end whitespace-nowrap text-[length:calc(8*var(--header-unit))] font-bold leading-[calc(10*var(--header-unit))] tracking-[calc(1.1*var(--header-unit))] max-md:hidden">
          <div>SYSTEM DATE: {systemDate}</div>
          <div className="text-[length:calc(7*var(--header-unit))] leading-[calc(9*var(--header-unit))] tracking-[calc(1.3*var(--header-unit))] text-[color:var(--header-accent)]">SYNC STATUS: STABLE</div>
        </div>
        
        <div className="relative" ref={popupRef}>
          <button 
            type="button"
            aria-label="Settings"
            aria-expanded={isSettingsOpen}
            className="flex items-center justify-center p-0 text-[color:var(--header-text)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[var(--header-accent)]"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings aria-hidden="true" className="h-[calc(16*var(--header-unit))] w-[calc(16*var(--header-unit))] stroke-1 max-md:h-[18px] max-md:w-[18px]" />
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
