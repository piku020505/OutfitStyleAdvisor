import { useState } from 'react'
import { X, Lock, Mail, User as UserIcon, LogIn, UserPlus, AlertCircle, Loader2 } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const endpoint = isRegister ? `${API_BASE}/auth/register` : `${API_BASE}/auth/login`
    const payload = isRegister
      ? { email, password, full_name: fullName || null }
      : { email, password }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed.')
      }

      localStorage.setItem('auth_token', data.access_token)
      localStorage.setItem('auth_user', JSON.stringify(data.user))
      onAuthSuccess(data.user, data.access_token)
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to authenticate.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent"
        >
          <X size={20} />
        </button>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          <button
            onClick={() => {
              setIsRegister(false)
              setError(null)
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent ${
              !isRegister ? 'bg-white text-slate-900 border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn size={14} className={!isRegister ? 'text-dynamic-accent' : ''} /> Sign In
          </button>
          <button
            onClick={() => {
              setIsRegister(true)
              setError(null)
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent ${
              isRegister ? 'bg-white text-slate-900 border border-slate-200 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus size={14} className={isRegister ? 'text-dynamic-accent' : ''} /> Create Account
          </button>
        </div>

        <div className="text-center space-y-1">
          <h3 className="font-display text-xl font-bold text-slate-900">
            {isRegister ? 'Create User Session' : 'Authenticate Session'}
          </h3>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'Save your outfit style history and fashion reports.'
              : 'Sign in to access your saved outfit style history.'}
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 p-3 text-xs text-red-700">
            <AlertCircle size={15} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
                Full Name
              </label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent focus-visible:border-dynamic-accent transition"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent focus-visible:border-dynamic-accent transition"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 pl-10 pr-4 text-xs text-slate-900 placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent focus-visible:border-dynamic-accent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-dynamic-accent text-white font-bold py-3 text-xs flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-dynamic-accent"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Authenticating...
              </>
            ) : isRegister ? (
              'Create Account & Login'
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
