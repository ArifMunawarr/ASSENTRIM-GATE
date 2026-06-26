import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export default function CustomSelect({ options, value, onChange, placeholder, widthClass = "w-48", theme = 'dark' }) {
  const [isOpen, setIsOpen] = useState(false)
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

  const selectedOption = options.find(opt => opt.value === value)
  const displayLabel = selectedOption ? selectedOption.label : placeholder

  return (
    <div className={`relative ${widthClass}`} ref={popupRef}>
      <div
        className="bg-[#181C22] border border-[#444841] text-slate-300 text-[11px] px-3 py-2 w-full outline-none cursor-pointer flex items-center justify-between tracking-wider h-[33.5px]"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="truncate">{displayLabel}</span>
        <ChevronDown size={12} className="text-slate-400 shrink-0 ml-1" />
      </div>

      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 border shadow-2xl z-50 w-full py-1 ${theme === 'light' ? 'bg-[#FAFAFA] border-[#D8D8D8]' : 'bg-[#181C22] border-[#444841]'}`}>
          {options.map((option, idx) => {
            const isSelected = option.value === value
            return (
              <div
                key={idx}
                className={`px-4 py-2.5 text-[12px] cursor-pointer transition-colors ${
                  isSelected 
                    ? (theme === 'light' ? 'bg-[#0C5F9A] text-[#FAFAFA] font-medium' : 'bg-[#2EAFF9] text-[#0a0d14] font-medium')
                    : (theme === 'light' ? 'text-[#172033] hover:bg-[#0C5F9A]/10 hover:text-[#0C5F9A]' : 'text-slate-300 hover:bg-[#2EAFF9]/10 hover:text-white')
                }`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
