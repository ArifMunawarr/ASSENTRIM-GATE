import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export default function CheckboxSelect({ options, selectedValues, onChange, placeholder, widthClass = "w-48", theme = 'dark' }) {
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

  const toggleOption = (value) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value))
    } else {
      onChange([...selectedValues, value])
    }
  }

  let displayLabel = placeholder
  if (selectedValues.length === 1) {
    const opt = options.find(o => o.value === selectedValues[0])
    displayLabel = opt ? opt.label : placeholder
  } else if (selectedValues.length > 1) {
    displayLabel = `${selectedValues.length} Selected`
  }

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
        <div className={`absolute top-full left-0 mt-1 border shadow-2xl z-50 w-full py-2 ${theme === 'light' ? 'bg-[#FAFAFA] border-[#D8D8D8]' : 'bg-[#181C22] border-[#444841]'}`}>
          {options.map((option, idx) => {
            const isSelected = selectedValues.includes(option.value)
            return (
              <div
                key={idx}
                className={`px-4 py-2 flex items-center justify-between cursor-pointer transition-colors ${theme === 'light' ? 'hover:bg-[#0C5F9A]/10' : 'hover:bg-white/5'}`}
                onClick={() => toggleOption(option.value)}
              >
                <span className={`text-[12px] tracking-wide ${theme === 'light' ? 'text-[#172033]' : 'text-slate-200'}`}>{option.label}</span>
                <div className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors ${
                  isSelected 
                    ? (theme === 'light' ? 'bg-[#0C5F9A]' : 'bg-[#2EAFF9]') 
                    : (theme === 'light' ? 'border-[1.5px] border-[#94A3B8]' : 'border border-[#444841]')
                }`}>
                  {isSelected && <Check size={12} strokeWidth={3} className={theme === 'light' ? 'text-[#FAFAFA]' : 'text-[#0a0d14]'} />}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
