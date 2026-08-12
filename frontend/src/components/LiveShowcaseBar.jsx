import { useState, useEffect } from 'react'
import { SkipForward, SkipBack, Play, Pause, Shuffle, Sparkles, Shirt } from 'lucide-react'
import { SAMPLE_OUTFITS } from '../utils/sampleGenerator'

export default function LiveShowcaseBar({
  currentOutfitId,
  onSelectOutfit,
  loading,
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)

  const currentIndex = SAMPLE_OUTFITS.findIndex((o) => o.id === currentOutfitId)

  function handleNext() {
    const nextIdx = (currentIndex + 1) % SAMPLE_OUTFITS.length
    onSelectOutfit(SAMPLE_OUTFITS[nextIdx])
  }

  function handlePrev() {
    const prevIdx = (currentIndex - 1 + SAMPLE_OUTFITS.length) % SAMPLE_OUTFITS.length
    onSelectOutfit(SAMPLE_OUTFITS[prevIdx])
  }

  function handleRandom() {
    let randIdx = Math.floor(Math.random() * SAMPLE_OUTFITS.length)
    if (randIdx === currentIndex && SAMPLE_OUTFITS.length > 1) {
      randIdx = (randIdx + 1) % SAMPLE_OUTFITS.length
    }
    onSelectOutfit(SAMPLE_OUTFITS[randIdx])
  }

  // Auto-play timer stream
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0)
      return
    }

    const interval = 50 // ms tick
    const totalMs = 5000 // 5 seconds per outfit
    let elapsed = 0

    const timer = setInterval(() => {
      elapsed += interval
      setProgress((elapsed / totalMs) * 100)
      if (elapsed >= totalMs) {
        elapsed = 0
        handleNext()
      }
    }, interval)

    return () => clearInterval(timer)
  }, [isPlaying, currentIndex])

  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm space-y-4">
      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-ink/10">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-accent/10 p-2 text-accent">
            <Sparkles size={18} className="animate-pulse" />
          </div>
          <div>
            <h2 className="font-display text-lg text-ink font-semibold flex items-center gap-2">
              Live Outfit Showcase & Next Style Stream
            </h2>
            <p className="text-xs text-ink/60">
              Browse presets or click <span className="font-semibold text-accent">Next Outfit Style</span> to cycle instantly
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={loading}
            title="Previous Style"
            className="rounded-xl border border-ink/15 p-2.5 text-ink hover:bg-ink/5 disabled:opacity-40 transition"
          >
            <SkipBack size={16} />
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            className="rounded-xl bg-accent text-white px-4 py-2.5 text-xs font-semibold flex items-center gap-2 hover:opacity-90 transition shadow-sm"
          >
            <SkipForward size={16} />
            <span>Next Outfit Style</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Live Stream' : 'Play Live Showcase'}
            className={`rounded-xl border p-2.5 transition flex items-center gap-1.5 text-xs font-medium ${
              isPlaying
                ? 'bg-emerald-500 border-emerald-600 text-white'
                : 'border-ink/15 text-ink hover:bg-ink/5'
            }`}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            <span className="hidden md:inline">{isPlaying ? 'Live Active' : 'Auto Stream'}</span>
          </button>

          <button
            onClick={handleRandom}
            disabled={loading}
            title="Random Outfit"
            className="rounded-xl border border-ink/15 p-2.5 text-ink hover:bg-ink/5 disabled:opacity-40 transition"
          >
            <Shuffle size={16} />
          </button>
        </div>
      </div>

      {/* Auto-Play Stream Progress Bar */}
      {isPlaying && (
        <div className="w-full bg-ink/10 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-emerald-500 h-1.5 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Preset Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-1">
        {SAMPLE_OUTFITS.map((outfit) => {
          const isSelected = currentOutfitId === outfit.id
          return (
            <button
              key={outfit.id}
              onClick={() => onSelectOutfit(outfit)}
              disabled={loading}
              className={`group relative flex flex-col items-start p-3 rounded-xl border text-left transition-all overflow-hidden ${
                isSelected
                  ? 'border-accent bg-accent/5 ring-2 ring-accent/30 shadow-md'
                  : 'border-ink/10 bg-paper/50 hover:border-ink/30 hover:bg-paper'
              }`}
            >
              {/* Color accent pill */}
              <div className="flex items-center gap-1.5 mb-2 w-full">
                <span
                  className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: outfit.primaryColor }}
                />
                <span
                  className="h-3 w-3 rounded-full border border-black/10 shrink-0"
                  style={{ backgroundColor: outfit.secondaryColor }}
                />
                <span className="ml-auto text-[10px] uppercase font-semibold text-ink/40">
                  {outfit.category}
                </span>
              </div>

              <p className="font-medium text-xs text-ink line-clamp-1 group-hover:text-accent transition">
                {outfit.name}
              </p>
              <p className="text-[11px] text-ink/50 line-clamp-1 mt-0.5">{outfit.description}</p>

              {isSelected && (
                <div className="absolute top-0 right-0 bg-accent text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg">
                  LIVE
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
