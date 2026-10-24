import React, { useState } from 'react'
import Header from '../components/Header'
import { Pencil, Eye, EyeOff, Check, Loader2 } from 'lucide-react'

const defaultProfile = {
  nama: 'Administrator',
  username: 'admin',
  role: 'Admin / Superuser',
}

export default function Profile({ user, onNavigate, theme, onToggleTheme, onLogout }) {
  const [profile, setProfile] = useState({ ...defaultProfile, ...(user || {}) })
  const [saving, setSaving] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [fullName, setFullName] = useState(user?.nama || defaultProfile.nama)
  const [usernameInput, setUsernameInput] = useState(user?.username || defaultProfile.username)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const handleSave = (e) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword && newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password confirmation does not match.' })
      return
    }

    // Dummy save - no backend
    setSaving(true)
    setTimeout(() => {
      setProfile((prev) => ({ ...prev, nama: fullName, username: usernameInput }))
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      setNewPassword('')
      setConfirmPassword('')
      setSaving(false)
    }, 600)
  }

  const displayName = profile?.nama || 'Administrator'
  const displayUsername = profile?.username || 'admin'
  const displayRole = profile?.role || 'Admin / Superuser'

  return (
    <div className="min-h-screen bg-[#121416] text-white flex flex-col font-display h-screen overflow-hidden">
      <Header activePage="profile" onNavigate={onNavigate} theme={theme} onToggleTheme={onToggleTheme} onLogout={onLogout} />
      
      <div className="flex-1 px-4 py-4 sm:px-6 sm:py-5 2xl:px-8 2xl:py-8 flex flex-col min-h-0 overflow-y-auto no-scrollbar relative">
        <div className="shrink-0 mb-4 2xl:mb-6">
          <div className="text-[9px] 2xl:text-[11px] font-black tracking-[0.2em] text-[#2EAFF9] uppercase mb-1">OPERATIONAL GATE SERVICE</div>
          <h2 className="text-xl 2xl:text-[28px] font-bold text-white tracking-wide">Profile</h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 2xl:gap-[80px] items-start w-full pb-10">
            
            {/* Left Panel - Profile Info */}
            <div className="w-full lg:w-[550px] 2xl:w-[700px] bg-[#282A2C] border border-[#444841] flex flex-col p-6 2xl:p-8 rounded-sm shrink-0">
              <div className="flex justify-between items-start mb-8 2xl:mb-10">
                <div className="flex flex-col gap-2 2xl:gap-3">
                  <h3 className="text-2xl 2xl:text-[28px] font-black tracking-wider uppercase text-white">{displayName}</h3>
                  <div className="bg-[#3B82F6] text-white text-[8px] 2xl:text-[10px] font-black tracking-widest px-2 py-1 rounded-[2px] uppercase self-start">
                    {displayRole.split('/')[0].trim()}
                  </div>
                </div>
                <button className="flex items-center gap-1.5 2xl:gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[9px] 2xl:text-[11px] font-black px-4 py-2.5 2xl:px-5 2xl:py-3 rounded-[3px] tracking-widest uppercase transition-colors">
                  <Pencil className="w-3.5 h-3.5 2xl:w-4 2xl:h-4" strokeWidth={2.5} />
                  EDIT PROFILE
                </button>
              </div>

              <div className="flex flex-col border border-[#444841] bg-[#0a0e13] rounded-[3px] overflow-hidden">
                <div className="bg-[#2EAFF9] text-white text-[10px] 2xl:text-[12px] font-black tracking-widest px-4 py-3 2xl:px-5 2xl:py-4 uppercase">
                  ACCOUNT SETTINGS
                </div>
                
                <div className="flex flex-col px-4 2xl:px-5">
                  <div className="flex justify-between items-center py-4 2xl:py-5 border-b border-[#444841]">
                    <span className="text-[10px] 2xl:text-[11px] font-bold tracking-widest text-white uppercase">USERNAME</span>
                    <span className="text-xs 2xl:text-[13px] text-white font-medium tracking-wide">{displayUsername}</span>
                  </div>
                  <div className="flex justify-between items-center py-4 2xl:py-5 border-b border-[#444841]">
                    <span className="text-[10px] 2xl:text-[11px] font-bold tracking-widest text-white uppercase">PASSWORD</span>
                    <span className="text-xs 2xl:text-[13px] text-white font-medium tracking-wider">••••••••••••</span>
                  </div>
                  <div className="flex justify-between items-center py-4 2xl:py-5">
                    <span className="text-[10px] 2xl:text-[11px] font-bold tracking-widest text-white uppercase">ROLE</span>
                    <span className="text-xs 2xl:text-[13px] text-white font-medium tracking-wide">{displayRole}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Edit Form */}
            <form onSubmit={handleSave} className="flex-1 w-full bg-[#282A2C] border border-[#444841] flex flex-col p-6 2xl:p-8 rounded-sm">
              <h3 className="text-xl 2xl:text-[24px] font-black tracking-wide text-white mb-1 uppercase">EDIT PROFILE</h3>
              <p className="text-xs 2xl:text-[13px] text-white mb-6 2xl:mb-8 font-medium">Update your personal and account details</p>

              {message && (
                <div className={`mb-6 p-3 rounded text-xs border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                  {message.text}
                </div>
              )}

              <div className="flex flex-col gap-6 2xl:gap-8 flex-1">
                <div className="flex flex-col gap-2 2xl:gap-2.5">
                  <label className="text-[9px] 2xl:text-[11px] font-bold tracking-widest text-white uppercase">FULL NAME</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-[#282A2C] border border-[#D8D8D8] text-white text-xs 2xl:text-[13px] font-medium tracking-wide px-4 py-3 2xl:px-5 2xl:py-4 rounded-[2px] outline-none focus:border-[#2EAFF9] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2 2xl:gap-2.5">
                  <label className="text-[9px] 2xl:text-[11px] font-bold tracking-widest text-white uppercase">USERNAME</label>
                  <input 
                    type="text" 
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    className="bg-[#282A2C] border border-[#D8D8D8] text-white text-xs 2xl:text-[13px] font-medium tracking-wide px-4 py-3 2xl:px-5 2xl:py-4 rounded-[2px] outline-none focus:border-[#2EAFF9] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-2 2xl:gap-2.5">
                  <label className="text-[9px] 2xl:text-[11px] font-bold tracking-widest text-white uppercase">NEW PASSWORD</label>
                  <div className="relative">
                    <input 
                      type={showNewPassword ? "text" : "password"} 
                      placeholder="At least 12 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-[#282A2C] border border-[#D8D8D8] text-white text-xs 2xl:text-[13px] font-medium tracking-wide px-4 py-3 2xl:px-5 2xl:py-4 rounded-[2px] outline-none focus:border-[#2EAFF9] transition-colors placeholder:text-[#444841]"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 2xl:right-5 top-1/2 -translate-y-1/2 text-white hover:text-slate-200 transition-colors"
                    >
                      {showNewPassword ? <Eye className="w-4 h-4 2xl:w-5 2xl:h-5" /> : <EyeOff className="w-4 h-4 2xl:w-5 2xl:h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 2xl:gap-2.5">
                  <label className="text-[9px] 2xl:text-[11px] font-bold tracking-widest text-white uppercase">CONFIRM PASSWORD</label>
                  <div className="relative">
                    <input 
                      type={showConfirmPassword ? "text" : "password"} 
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#282A2C] border border-[#D8D8D8] text-white text-xs 2xl:text-[13px] font-medium tracking-wide px-4 py-3 2xl:px-5 2xl:py-4 rounded-[2px] outline-none focus:border-[#2EAFF9] transition-colors placeholder:text-[#444841]"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 2xl:right-5 top-1/2 -translate-y-1/2 text-white hover:text-slate-200 transition-colors"
                    >
                      {showConfirmPassword ? <Eye className="w-4 h-4 2xl:w-5 2xl:h-5" /> : <EyeOff className="w-4 h-4 2xl:w-5 2xl:h-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="mt-auto pt-8 2xl:pt-10 flex items-center justify-end gap-6 2xl:gap-8">
                  <button type="button" onClick={() => { setFullName(profile?.nama || ''); setUsernameInput(profile?.username || ''); setNewPassword(''); setConfirmPassword(''); setMessage(null); }} className="text-[10px] 2xl:text-[12px] font-bold tracking-widest text-white uppercase hover:bg-white/5 transition-colors border border-[#D8D8D8]/60 px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-[3px]">
                    CANCEL
                  </button>
                  <button type="submit" disabled={saving} className="flex items-center gap-1.5 2xl:gap-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-[10px] 2xl:text-[12px] font-black px-6 py-3.5 2xl:px-8 2xl:py-4 rounded-[3px] tracking-widest uppercase transition-colors disabled:opacity-50">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Check className="w-4 h-4 2xl:w-5 2xl:h-5" strokeWidth={3.5} />}
                    SAVE CHANGES
                  </button>
                </div>
              </div>
            </form>

        </div>
      </div>
    </div>
  )
}


