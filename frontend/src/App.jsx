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

  // Dynamic Accent Tinting States
  const [hoveredColor, setHoveredColor] = useState(null)

  // Auth & History states
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)

  // Calculate dynamic accent color from extracted outfit palette or hover
  const primaryColorHex = result?.dominant_colors?.[0]?.hex || '#2563EB'
  const effectiveAccent = hoveredColor || primaryColorHex

  // Apply dynamic accent CSS variable to :root
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-dynamic', effectiveAccent)
  }, [effectiveAccent])

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
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 pb-16 transition-colors duration-300">
      {/* Top Navigation */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 border border-slate-200 p-2.5 text-dynamic-accent shadow-xs transition-colors duration-300">
              <Shirt size={22} />
            </div>
            <div>
              <h1 className="font-display text-xl text-slate-900 font-bold tracking-tight flex items-center gap-2">
                Outfit Style Advisor
              </h1>
              <p className="text-xs text-slate-500 font-mono">Classical Computer Vision & Fashion Rule Matrix Engine</p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {backendHealth && (
              <div className="hidden lg:flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-xs text-slate-700 font-mono">
                <CheckCircle2 size={13} className="text-emerald-600" />
                <span>Engine: <strong className="text-dynamic-accent font-semibold">{backendHealth.vision_backend}</strong></span>
              </div>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 flex items-center gap-1.5 hover:border-dynamic-accent transition shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent"
                >
                  <History size={15} className="text-dynamic-accent" />
                  <span className="hidden sm:inline">Saved History</span>
                </button>

                <div className="flex items-center gap-2 rounded-xl bg-slate-100 border border-slate-200 px-3 py-1.5 text-xs text-slate-800">
                  <User size={14} className="text-dynamic-accent" />
                  <span className="font-semibold">{user.full_name || user.email}</span>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="ml-1 text-slate-400 hover:text-red-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthOpen(true)}
                className="rounded-xl bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 text-xs font-bold flex items-center gap-2 transition shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
              >
                <LogIn size={15} />
                <span>Sign In / Register</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Live Showcase & Next Outfit Carousel Bar */}
        <LiveShowcaseBar
          currentOutfitId={currentOutfitId}
          onSelectOutfit={handleSelectSampleOutfit}
          loading={loading}
        />

        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Image & Controls (5 cols) */}
          <section className="lg:col-span-5 space-y-5">
            <ImageUploader onFileSelected={handleFileSelected} previewUrl={previewUrl} disabled={loading} />

            <button
              onClick={() => handleAnalyze()}
              disabled={!file || loading}
              className="w-full rounded-xl bg-slate-900 text-white font-bold py-3.5 flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-40 hover:bg-slate-800 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin text-dynamic-accent" /> Extracting Swatches & Matching Rules...
                </>
              ) : (
                <>
                  <Sparkles size={18} className="text-dynamic-accent" /> Analyze Outfit & Next Styles
                </>
              )}
            </button>

            {error && (
              <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 p-4 text-xs text-red-700">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            {result && <ColorPalette colors={result.dominant_colors} onHoverColor={setHoveredColor} />}
          </section>

          {/* Right Column: Style Report & Next Style Generator (7 cols) */}
          <section className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs relative overflow-hidden">
            {result ? (
              <StyleReport result={result} onHoverColor={setHoveredColor} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 gap-3 py-24">
                <div className="rounded-full bg-slate-100 p-4 border border-slate-200 text-dynamic-accent">
                  <Shirt size={36} />
                </div>
                <p className="font-display tracking-wider uppercase text-xs font-semibold text-slate-900">
                  No Outfit Analyzed Yet
                </p>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Select a preset from the canvas bar above or drop an outfit photo to extract dominant RGB swatches and generate structured fashion rule recommendations.
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
