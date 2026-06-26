import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
]

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay() // 0=Sun
}

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function DateRangePicker({ onChange, widthClass = "w-48", theme = 'dark' }) {
  const today = new Date()
  const [isOpen, setIsOpen] = useState(false)
  const [viewMode, setViewMode] = useState('date')
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const popupRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(y => y - 1)
    } else {
      setCurrentMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(y => y + 1)
    } else {
      setCurrentMonth(m => m + 1)
    }
  }

  function selectYear(year) {
    setCurrentYear(year)
    setViewMode('date')
  }

  function selectDate(day) {
    const selected = new Date(currentYear, currentMonth, day)
    if (!startDate || (startDate && endDate)) {
      setStartDate(selected)
      setEndDate(null)
    } else {
      if (selected < startDate) {
        setEndDate(startDate)
        setStartDate(selected)
      } else {
        setEndDate(selected)
      }
    }
  }

  function isStart(day) {
    if (!startDate) return false
    const d = new Date(currentYear, currentMonth, day)
    return d.toDateString() === startDate.toDateString()
  }

  function isEnd(day) {
    if (!endDate) return false
    const d = new Date(currentYear, currentMonth, day)
    return d.toDateString() === endDate.toDateString()
  }

  function isInRange(day) {
    if (!startDate || !endDate) return false
    const d = new Date(currentYear, currentMonth, day)
    return d > startDate && d < endDate
  }

  function formatDate(d) {
    if (!d) return '--/--/----'
    return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}`
  }

  const displayLabel = startDate
    ? `${formatDate(startDate)}${endDate ? ' - ' + formatDate(endDate) : ''}`
    : 'mm/dd/yyyy'

  // Generate year range (±5 from current)
  const yearStart = Math.floor(currentYear / 10) * 10 - 1
  const years = Array.from({ length: 12 }, (_, i) => yearStart + i)

  return (
    <div className="relative" ref={popupRef}>
      <div
        className={`bg-[#181C22] border border-[#444841] text-slate-300 text-[11px] px-3 py-2 ${widthClass} outline-none cursor-pointer flex items-center justify-between tracking-wider`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={startDate ? 'text-slate-200' : 'text-slate-500'}>{displayLabel}</span>
        <ChevronDown size={12} className="text-slate-400 shrink-0 ml-1" />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-[#1C2026] border border-[#444841] rounded shadow-2xl z-50 w-[220px] overflow-hidden">
          {/* Header */}
          <div className={`flex items-center justify-between p-3 ${theme === 'light' ? 'bg-[#0C5F9A]' : 'bg-[#1C2026]'}`}>
            <div
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() => setViewMode(viewMode === 'date' ? 'year' : 'date')}
            >
              <span className={`text-[12px] font-semibold tracking-wide uppercase ${theme === 'light' ? 'text-[#FAFAFA]' : 'text-white'}`}>
                {MONTHS[currentMonth]} {currentYear}
              </span>
              <svg width="8" height="5" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 6L0 0H10L5 6Z" fill={theme === 'light' ? '#FAFAFA' : 'white'} />
              </svg>
            </div>
            <div className="flex items-center gap-3">
              <ChevronLeft
                size={14}
                strokeWidth={3}
                className={`cursor-pointer ${theme === 'light' ? 'text-[#FAFAFA] hover:text-white' : 'text-white hover:text-slate-300'}`}
                onClick={prevMonth}
              />
              <ChevronRight
                size={14}
                strokeWidth={3}
                className={`cursor-pointer ${theme === 'light' ? 'text-[#FAFAFA] hover:text-white' : 'text-white hover:text-slate-300'}`}
                onClick={nextMonth}
              />
            </div>
          </div>

          <div className="p-3">
            {viewMode === 'date' ? (
              <div className="flex flex-col">
                {/* Weekdays */}
                <div className="grid grid-cols-7 mb-2">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-[#2EAFF9] text-[11px] font-medium">
                      {d}
                    </div>
                  ))}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-7 gap-y-2 gap-x-0 text-center">
                  {/* Empty leading cells */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const start = isStart(day)
                    const end = isEnd(day)
                    const inRange = isInRange(day)

                    let classes = "w-7 h-7 mx-auto flex items-center justify-center text-[12px] cursor-pointer transition-colors "

                    if (start) {
                      classes += theme === 'light' ? "rounded-full border border-[#0C5F9A] text-[#0C5F9A] font-semibold" : "rounded-full border border-[#2EAFF9] text-[#2EAFF9] font-semibold"
                    } else if (end) {
                      classes += theme === 'light' ? "rounded-full bg-[#0C5F9A] text-[#FAFAFA] font-semibold" : "rounded-full bg-[#2EAFF9] text-[#0a0d14] font-semibold"
                    } else if (inRange) {
                      classes += "rounded-full bg-[#2EAFF9]/20 text-white"
                    } else {
                      classes += "text-slate-300 hover:bg-white/10 rounded-full"
                    }

                    return (
                      <div
                        key={day}
                        className={classes}
                        onClick={() => selectDate(day)}
                      >
                        {day}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center">
                <div className="grid grid-cols-3 gap-y-5 gap-x-1">
                  {years.map(year => {
                    const isSelected = year === currentYear
                    let classes = "w-[56px] h-8 mx-auto flex items-center justify-center text-[13px] font-medium cursor-pointer transition-colors tracking-wide "

                    if (isSelected) {
                      classes += theme === 'light' ? "rounded-full bg-[#0C5F9A] text-[#FAFAFA] font-bold" : "rounded-full bg-[#2EAFF9] text-[#0a0d14] font-bold"
                    } else {
                      classes += theme === 'light' ? "text-[#0C5F9A] hover:opacity-80" : "text-[#2EAFF9] hover:text-white"
                    }

                    return (
                      <div
                        key={year}
                        className={classes}
                        onClick={() => selectYear(year)}
                      >
                        {year}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

