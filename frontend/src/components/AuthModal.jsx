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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-2xl border border-ink/10 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1 text-ink/40 hover:bg-ink/5 hover:text-ink transition"
        >
          <X size={20} />
        </button>

        {/* Tab Switcher */}
        <div className="flex rounded-xl bg-paper p-1 border border-ink/10">
          <button
            onClick={() => {
              setIsRegister(false)
              setError(null)
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              !isRegister ? 'bg-white text-ink shadow-sm' : 'text-ink/60 hover:text-ink'
            }`}
          >
            <LogIn size={14} /> Sign In
          </button>
          <button
            onClick={() => {
              setIsRegister(true)
              setError(null)
            }}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              isRegister ? 'bg-white text-ink shadow-sm' : 'text-ink/60 hover:text-ink'
            }`}
          >
            <UserPlus size={14} /> Create Account
          </button>
        </div>

        <div className="text-center space-y-1">
          <h3 className="font-display text-xl font-bold text-ink">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-ink/60">
            {isRegister
              ? 'Save your outfit style history and AI styling reports.'
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
            <div>
              <label className="block text-xs font-semibold text-ink/70 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-3 top-3 text-ink/40" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-ink/20 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-ink/70 mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-ink/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full rounded-xl border border-ink/20 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink/70 mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-ink/40" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-ink/20 pl-9 pr-4 py-2.5 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-ink text-white font-semibold py-3 text-sm flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isRegister ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
