import { useState, useEffect } from 'react'
import { SkipForward, SkipBack, Play, Pause, Shuffle, Shirt } from 'lucide-react'
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
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-lg space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Shirt size={18} className="text-dynamic-accent" />
          <h2 className="font-display tracking-wider uppercase text-xs font-semibold text-paper">
            Live Outfit Canvas Presets & Rotation
          </h2>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handlePrev}
            disabled={loading}
            title="Previous Outfit"
            className="rounded-lg border border-border bg-surface-elevated p-2 text-paper hover:border-dynamic-accent hover:text-dynamic-accent transition disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent"
          >
            <SkipBack size={15} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={loading}
            title={isPlaying ? 'Pause Auto Stream' : 'Auto Stream Outfits (5s)'}
            className={`rounded-lg border px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent ${
              isPlaying
                ? 'border-dynamic-accent bg-dynamic-accent text-canvas'
                : 'border-border bg-surface-elevated text-paper hover:border-dynamic-accent'
            }`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            <span>{isPlaying ? 'Pause Stream' : 'Auto Stream'}</span>
          </button>

          <button
            onClick={handleNext}
            disabled={loading}
            title="Next Outfit"
            className="rounded-lg border border-border bg-surface-elevated p-2 text-paper hover:border-dynamic-accent hover:text-dynamic-accent transition disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent"
          >
            <SkipForward size={15} />
          </button>

          <button
            onClick={handleRandom}
            disabled={loading}
            title="Random Outfit"
            className="rounded-lg border border-border bg-surface-elevated p-2 text-muted hover:border-dynamic-accent hover:text-paper transition disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent"
          >
            <Shuffle size={15} />
          </button>
        </div>
      </div>

      {/* Auto-play progress bar */}
      {isPlaying && (
        <div className="h-1 w-full bg-surface-elevated rounded-full overflow-hidden">
          <div
            className="h-full bg-dynamic-accent transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Preset cards horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-2 pt-1 no-scrollbar sm:custom-scrollbar">
        {SAMPLE_OUTFITS.map((outfit) => {
          const isSelected = outfit.id === currentOutfitId
          return (
            <button
              key={outfit.id}
              onClick={() => onSelectOutfit(outfit)}
              disabled={loading}
              className={`group flex-shrink-0 relative rounded-xl border p-3 text-left transition-all duration-200 w-44 sm:w-48 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent
                ${
                  isSelected
                    ? 'border-dynamic-accent bg-surface-elevated ring-1 ring-dynamic-accent/40 shadow-md'
                    : 'border-border bg-surface-elevated/50 hover:border-border-subtle hover:bg-surface-elevated'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-muted-dark font-mono mb-1">
                  <span className="capitalize">{outfit.style}</span>
                  {isSelected && (
                    <span className="text-dynamic-accent font-bold">ACTIVE</span>
                  )}
                </div>
                <h3 className="text-xs font-semibold text-paper line-clamp-1 group-hover:text-dynamic-accent transition-colors">
                  {outfit.name}
                </h3>
              </div>

              {/* Color Dot Swatches */}
              <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-border/40">
                {(outfit.palette || [outfit.primaryColor, outfit.secondaryColor, outfit.accentColor]).filter(Boolean).map((hex) => (
                  <span
                    key={hex}
                    className="h-3 w-3 rounded-full border border-white/20 shrink-0"
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
