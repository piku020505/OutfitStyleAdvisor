import { useState, useEffect } from 'react'
import { Shirt, Loader2, AlertCircle, Sparkles, CheckCircle2, User, LogOut, History, LogIn } from 'lucide-react'
import ImageUploader from './components/ImageUploader.jsx'
import ColorPalette from './components/ColorPalette.jsx'
import StyleReport from './components/StyleReport.jsx'
import LiveShowcaseBar from './components/LiveShowcaseBar.jsx'
import AuthModal from './components/AuthModal.jsx'
import OutfitHistoryDrawer from './components/OutfitHistoryDrawer.jsx'
import { SAMPLE_OUTFITS, generateOutfitFile } from './utils/sampleGenerator.js'

const API_BASE = 'http://localhost:8000/api'

export default function App() {
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentOutfitId, setCurrentOutfitId] = useState(null)
  const [backendHealth, setBackendHealth] = useState(null)

  // Auth & History states
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Load auth session from localStorage & check backend health
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('auth_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {}
    }

    fetch(`${API_BASE}/health`)
      .then((res) => res.json())
      .then((data) => setBackendHealth(data))
      .catch(() => setBackendHealth(null))
  }, [])

  function handleLogout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
    setToken(null)
  }

  function handleFileSelected(f) {
    setCurrentOutfitId(null)
    setFile(f)
    setResult(null)
    setError(null)
    setPreviewUrl(URL.createObjectURL(f))
  }

  async function handleAnalyze(fileToAnalyze = file) {
    const targetFile = fileToAnalyze || file
    if (!targetFile) return
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('file', targetFile)

      const headers = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers,
        body: formData,
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.detail || `Request failed (${res.status})`)
      }
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'Something went wrong analyzing this image.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSelectSampleOutfit(outfit) {
    setCurrentOutfitId(outfit.id)
    setError(null)
    setLoading(true)

    try {
      const outfitFile = await generateOutfitFile(outfit)
      setFile(outfitFile)
      setPreviewUrl(URL.createObjectURL(outfitFile))
      await handleAnalyze(outfitFile)
    } catch (err) {
      setError('Failed to generate sample outfit.')
      setLoading(false)
    }
  }

  function handleSelectHistoryItem(historyItem) {
    setResult({
      garment_type: historyItem.garment_type,
      garment_confidence: historyItem.garment_confidence,
      pattern: historyItem.pattern,
      style: historyItem.style,
      style_confidence: historyItem.style_confidence,
      vision_backend: historyItem.vision_backend,
      dominant_colors: historyItem.dominant_colors,
      top_garment_candidates: [],
      style_report: historyItem.style_report,
    })
  }

  // Load first sample outfit automatically on initial page load if none loaded
  useEffect(() => {
    if (!file && !result && SAMPLE_OUTFITS.length > 0) {
      handleSelectSampleOutfit(SAMPLE_OUTFITS[0])
    }
  }, [])

  return (
    <div className="min-h-screen bg-paper pb-16">
      {/* Top Navigation */}
      <header className="border-b border-ink/10 bg-white/70 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-accent p-2 text-white shadow-md">
              <Shirt size={22} />
            </div>
            <div>
              <h1 className="font-display text-xl text-ink font-bold tracking-tight">Outfit Style Advisor</h1>
              <p className="text-xs text-ink/60">Enterprise AI Outfit Analysis & Styling Platform</p>
            </div>
          </div>

          {/* Right Action Bar: Vision AI badge & Auth controls */}
          <div className="flex items-center gap-3">
            {backendHealth && (
              <div className="hidden lg:flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs text-emerald-700">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>AI API: <strong className="font-semibold">{backendHealth.vision_backend}</strong></span>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="rounded-xl border border-ink/15 bg-white px-3 py-2 text-xs font-semibold text-ink flex items-center gap-1.5 hover:bg-ink/5 transition shadow-sm"
                >
                  <History size={15} className="text-accent" />
                  <span className="hidden sm:inline">Saved History</span>
                </button>

                <div className="flex items-center gap-2 rounded-xl bg-ink/5 border border-ink/10 px-3 py-1.5 text-xs text-ink">
                  <User size={14} className="text-accent" />
                  <span className="font-semibold">{user.full_name || user.email}</span>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="ml-1 text-ink/40 hover:text-red-600 transition"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="rounded-xl bg-ink text-white px-4 py-2 text-xs font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-md"
              >
                <LogIn size={15} />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Live Showcase & Next Outfit Carousel Bar */}
        <LiveShowcaseBar
          currentOutfitId={currentOutfitId}
          onSelectOutfit={handleSelectSampleOutfit}
          loading={loading}
        />

        {/* Main Grid: Upload/Preview Left, Style Report Right */}
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left Column: Image & Controls */}
          <section className="space-y-5">
            <ImageUploader onFileSelected={handleFileSelected} previewUrl={previewUrl} disabled={loading} />

            <button
              onClick={() => handleAnalyze()}
              disabled={!file || loading}
              className="w-full rounded-xl bg-ink text-white font-semibold py-3.5 flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-40 hover:opacity-90 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-accent" /> Running AI Analysis...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-accent" /> Analyze Outfit & Next Styles
                </>
              )}
            </button>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {result && <ColorPalette colors={result.dominant_colors} />}
          </section>

          {/* Right Column: AI Style Report & Next Style Generator */}
          <section className="bg-white rounded-2xl border border-ink/10 p-8 shadow-sm">
            {result ? (
              <StyleReport result={result} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-ink/40 gap-3 py-24">
                <Shirt size={40} className="animate-bounce text-ink/20" />
                <p className="text-sm">
                  Click <strong className="text-accent font-semibold">Next Outfit Style</strong> above or upload a photo<br />to see your live AI style report & next outfit recommendations.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Auth Modal (Login & Register) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u, t) => {
          setUser(u)
          setToken(t)
        }}
      />

      {/* Saved Outfit History Drawer */}
      <OutfitHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        token={token}
        onSelectHistoryItem={handleSelectHistoryItem}
      />
    </div>
  )
}
