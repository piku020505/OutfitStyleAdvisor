import { useState } from 'react'
import { Sparkles, ArrowRight, Check, X, Shirt, Palette } from 'lucide-react'

export default function NextOutfitStyleSection({ nextStyles, onHoverColor }) {
  const [copiedHex, setCopiedHex] = useState(null)
  const [activeModalStyle, setActiveModalStyle] = useState(null)

  if (!nextStyles || nextStyles.length === 0) return null

  function copyColor(hex) {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    setTimeout(() => setCopiedHex(null), 2000)
  }

  return (
    <div className="pt-6 border-t border-border space-y-4">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-dynamic-accent">
          <Sparkles size={18} />
          <h3 className="font-display tracking-wider uppercase text-xs font-semibold text-paper">
            Next Outfit Style Evolution
          </h3>
        </div>
        <span className="text-[11px] text-muted-dark font-mono">4 Rule Variations</span>
      </div>

      {/* Grid of Next Outfit Styles */}
      <div className="grid sm:grid-cols-2 gap-4">
        {nextStyles.map((styleItem, idx) => (
          <div
            key={styleItem.title || idx}
            className="group relative rounded-xl border border-border bg-surface-elevated p-4 transition-all duration-200 hover:border-dynamic-accent/50 hover:bg-surface-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-dynamic-accent/15 text-dynamic-accent px-2.5 py-0.5 rounded-full border border-dynamic-accent/20">
                  {styleItem.vibe || 'Style Option'}
                </span>
                <span className="text-[10px] text-muted-dark font-mono">Concept #{idx + 1}</span>
              </div>

              <h4 className="font-display text-base font-semibold text-paper group-hover:text-dynamic-accent transition-colors duration-200 mb-1.5">
                {styleItem.title}
              </h4>

              <p className="text-xs text-muted leading-relaxed mb-3">{styleItem.concept}</p>

              {/* Key Garments */}
              <div className="space-y-1.5 mb-3">
                <p className="text-[10px] font-semibold text-muted-dark uppercase tracking-wider flex items-center gap-1">
                  <Shirt size={11} /> Suggested Pieces:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {styleItem.garments?.map((g) => (
                    <span
                      key={g}
                      className="inline-block rounded-md bg-surface border border-border px-2 py-0.5 text-xs text-paper/90"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {/* Color Swatches */}
              <div className="flex items-center justify-between pt-3 border-t border-border/60">
                <div className="flex items-center gap-1.5">
                  {styleItem.palette?.map((hex) => (
                    <button
                      key={hex}
                      onClick={() => copyColor(hex)}
                      onMouseEnter={() => onHoverColor?.(hex)}
                      onMouseLeave={() => onHoverColor?.(null)}
                      title={`Click to copy ${hex} · Hover to tint UI`}
                      className="group/color relative h-5 w-5 rounded-full border border-white/20 transition transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent"
                      style={{ backgroundColor: hex }}
                    >
                      {copiedHex === hex && (
                        <Check size={10} className="absolute inset-0 m-auto text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                  {copiedHex && (
                    <span className="text-[10px] text-emerald-400 font-semibold ml-1">Copied!</span>
                  )}
                </div>

                <button
                  onClick={() => setActiveModalStyle(styleItem)}
                  className="text-xs font-semibold text-dynamic-accent flex items-center gap-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent rounded"
                >
                  Explore <ArrowRight size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal for Next Outfit Style */}
      {activeModalStyle && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-surface rounded-2xl border border-border p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveModalStyle(null)}
              className="absolute top-4 right-4 rounded-full p-1 text-muted hover:bg-surface-elevated hover:text-paper transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-dynamic-accent">
              <Sparkles size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {activeModalStyle.vibe}
              </span>
            </div>

            <h3 className="font-display text-xl text-paper font-semibold">{activeModalStyle.title}</h3>

            <p className="text-sm text-paper/90 leading-relaxed bg-surface-elevated rounded-xl p-3.5 border border-border">
              {activeModalStyle.concept}
            </p>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1">
                <Shirt size={14} className="text-dynamic-accent" /> Key Transition Garments
              </h4>
              <ul className="space-y-1.5">
                {activeModalStyle.garments?.map((g) => (
                  <li key={g} className="text-sm text-paper/90 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-dynamic-accent" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2 flex items-center gap-1">
                <Palette size={14} className="text-dynamic-accent" /> Transition Palette
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {activeModalStyle.palette?.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => copyColor(hex)}
                    onMouseEnter={() => onHoverColor?.(hex)}
                    onMouseLeave={() => onHoverColor?.(null)}
                    className="flex items-center gap-2 bg-surface-elevated px-3 py-1.5 rounded-lg border border-border hover:border-dynamic-accent cursor-pointer transition"
                  >
                    <span className="h-4 w-4 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
                    <span className="text-xs font-mono font-medium text-paper">{hex}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModalStyle(null)}
                className="w-full rounded-xl bg-dynamic-accent text-canvas font-bold py-2.5 text-sm hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:ring-dynamic-accent"
              >
                Close Concept
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
