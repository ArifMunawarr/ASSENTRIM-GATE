import React, { useState } from 'react'
import { Eye, EyeOff, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import bgImageDark from '../assets/bglogindark.jpg'
import bgImageLight from '../assets/bglogin.jpg'
import logoImageDark from '../assets/logologindark.svg'
import logoImageLight from '../assets/logologinlight.svg'
import iconIdDark from '../assets/iconid.svg'
import iconIdLight from '../assets/iconid(1).svg'
import iconPassDark from '../assets/iconpass.svg'
import iconPassLight from '../assets/iconpass(1).svg'

function Login({ onLogin, theme = 'dark' }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password) {
      setError('Mohon masukkan Username / Service ID dan Password.')
      return
    }

    setError(null)
    setIsLoading(true)

    // Dummy auth - menerima kredensial apa pun
    setTimeout(() => {
      setIsLoading(false)
      if (onLogin) {
        onLogin({
          nama: 'Administrator',
          username: username.trim(),
          role: 'Admin / Superuser',
        })
      }
    }, 800)
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center font-display relative"
      style={{ backgroundImage: `url(${theme === 'light' ? bgImageLight : bgImageDark})` }}
    >
      <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay to ensure contrast */}

      <div className="relative z-10 flex flex-col items-center w-full max-w-[28rem] px-4 sm:px-6">
        <img src={theme === 'light' ? logoImageLight : logoImageDark} alt="Asentrim Logo" className="w-12 h-12 sm:w-[3.25rem] sm:h-[3.25rem] mb-4 sm:mb-5" />
        <h1 className={`text-xl sm:text-2xl font-black tracking-wide mb-2 sm:mb-3 text-center uppercase ${theme === 'light' ? 'text-[#0C5F9A]' : 'text-[#2EAFF9]'}`}>
          ASENTRIM GATE COMMAND
        </h1>
        <p className={`text-[9px] font-bold tracking-[0.45em] mb-8 sm:mb-10 uppercase ${theme === 'light' ? 'text-[#383735]' : 'text-slate-400'}`}>
          LOGIN
        </p>

        <form onSubmit={handleSubmit} className={`w-full backdrop-blur-xl p-6 sm:p-8 shadow-2xl rounded-xl ${theme === 'light' ? 'bg-white/95 border border-[#D8D8D8]' : 'bg-[#181c25]/95 border border-slate-700/40'}`}>
          {error && (
            <div className="mb-5 p-3 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mb-5 sm:mb-6">
            <div className="flex justify-between items-center mb-2.5 px-0.5">
              <label className={`text-[9px] font-bold tracking-wider ${theme === 'light' ? 'text-[#383735]' : 'text-slate-400'}`}>SERVICE ID / NRP</label>
              <span className={`text-[9px] font-bold tracking-wider ${theme === 'light' ? 'text-[#61616199]' : 'text-slate-600'}`}>REQUIRED</span>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <img src={theme === 'light' ? iconIdLight : iconIdDark} alt="ID" className="w-[1.1rem] h-[1.1rem] opacity-50 group-focus-within:opacity-80 transition-opacity" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ID: 00000-TNI"
                disabled={isLoading}
                className={`w-full rounded-sm py-3.5 pl-[2.75rem] pr-4 focus:outline-none focus:border-[#2EAFF9]/50 focus:ring-1 focus:ring-transparent transition-colors ${theme === 'light' ? 'bg-white border border-[#D8D8D8] text-slate-800 placeholder-slate-400' : 'bg-[#0a0d14] border border-transparent text-slate-300 placeholder-slate-700/80'}`}
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-2.5 px-0.5">
              <label className={`text-[9px] font-bold tracking-wider ${theme === 'light' ? 'text-[#383735]' : 'text-slate-400'}`}>TACTICAL KEYPHRASE</label>
              <span className={`text-[9px] font-bold tracking-wider ${theme === 'light' ? 'text-[#61616199]' : 'text-slate-600'}`}>ENCRYPTED</span>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <img src={theme === 'light' ? iconPassLight : iconPassDark} alt="Password" className="w-[1.1rem] h-[1.1rem] opacity-50 group-focus-within:opacity-80 group-focus-within:drop-shadow-[0_0_8px_#2EAFF9] transition-all" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••"
                disabled={isLoading}
                className={`w-full rounded-sm py-[0.8rem] pl-[2.75rem] pr-12 focus:outline-none focus:border-[#2EAFF9]/50 focus:ring-1 focus:ring-transparent transition-colors tracking-widest font-mono ${theme === 'light' ? 'bg-white border border-[#D8D8D8] text-slate-800 placeholder-slate-400' : 'bg-[#0a0d14] border border-transparent text-slate-300 placeholder-slate-700/80'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-600 hover:text-[#2EAFF9] transition-colors"
              >
                {showPassword ? <Eye size={16} strokeWidth={2.5} /> : <EyeOff size={16} strokeWidth={2.5} />}

              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-black text-[10px] py-[1.1rem] px-4 rounded-sm transition-colors flex items-center justify-center gap-2 tracking-[0.15em] uppercase ${theme === 'light' ? 'bg-[#2EAFF9] hover:bg-[#1f9beb] text-[#FAFAFA]' : 'bg-[#2EAFF9] hover:bg-[#1f9beb] text-[#0a0d14]'} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                AUTHENTICATING...
              </>
            ) : (
              <>
                SECURE LOGIN
                <ArrowRight size={14} strokeWidth={3} className="ml-0.5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

