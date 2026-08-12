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
    <div className="pt-6 border-t border-slate-200 space-y-4">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-dynamic-accent">
          <Sparkles size={18} />
          <h3 className="font-display tracking-wider uppercase text-xs font-bold text-slate-900">
            Next Outfit Style Evolution
          </h3>
        </div>
        <span className="text-[11px] text-slate-500 font-mono">4 Rule Variations</span>
      </div>

      {/* Grid of Next Outfit Styles */}
      <div className="grid sm:grid-cols-2 gap-4">
        {nextStyles.map((styleItem, idx) => (
          <div
            key={styleItem.title || idx}
            className="group relative rounded-xl border border-slate-200 bg-slate-50/50 p-4 transition-all duration-200 hover:border-dynamic-accent/60 hover:bg-white hover:shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-200/80 text-slate-800 px-2.5 py-0.5 rounded-full border border-slate-300">
                  {styleItem.vibe || 'Style Option'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Concept #{idx + 1}</span>
              </div>

              <h4 className="font-display text-base font-bold text-slate-900 group-hover:text-dynamic-accent transition-colors duration-200 mb-1.5">
                {styleItem.title}
              </h4>

              <p className="text-xs text-slate-700 leading-relaxed mb-3 font-normal">{styleItem.concept}</p>

              {/* Key Garments */}
              <div className="space-y-1.5 mb-3">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                  <Shirt size={11} /> Suggested Pieces:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {styleItem.garments?.map((g) => (
                    <span
                      key={g}
                      className="inline-block rounded-md bg-white border border-slate-200 px-2 py-0.5 text-xs text-slate-800 font-medium shadow-2xs"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {/* Color Swatches */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                <div className="flex items-center gap-1.5">
                  {styleItem.palette?.map((hex) => (
                    <button
                      key={hex}
                      onClick={() => copyColor(hex)}
                      onMouseEnter={() => onHoverColor?.(hex)}
                      onMouseLeave={() => onHoverColor?.(null)}
                      title={`Click to copy ${hex} · Hover to tint UI`}
                      className="group/color relative h-5 w-5 rounded-full border border-slate-300 transition transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent cursor-pointer"
                      style={{ backgroundColor: hex }}
                    >
                      {copiedHex === hex && (
                        <Check size={10} className="absolute inset-0 m-auto text-white drop-shadow" />
                      )}
                    </button>
                  ))}
                  {copiedHex && (
                    <span className="text-[10px] text-emerald-600 font-semibold ml-1">Copied!</span>
                  )}
                </div>

                <button
                  onClick={() => setActiveModalStyle(styleItem)}
                  className="text-xs font-semibold text-dynamic-accent flex items-center gap-1 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent rounded cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-slate-200 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveModalStyle(null)}
              className="absolute top-4 right-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-dynamic-accent">
              <Sparkles size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {activeModalStyle.vibe}
              </span>
            </div>

            <h3 className="font-display text-xl text-slate-900 font-bold">{activeModalStyle.title}</h3>

            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3.5 border border-slate-200">
              {activeModalStyle.concept}
            </p>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                <Shirt size={14} className="text-dynamic-accent" /> Key Transition Garments
              </h4>
              <ul className="space-y-1.5">
                {activeModalStyle.garments?.map((g) => (
                  <li key={g} className="text-sm text-slate-800 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-dynamic-accent" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
                <Palette size={14} className="text-dynamic-accent" /> Transition Palette
              </h4>
              <div className="flex items-center gap-2 flex-wrap">
                {activeModalStyle.palette?.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => copyColor(hex)}
                    onMouseEnter={() => onHoverColor?.(hex)}
                    onMouseLeave={() => onHoverColor?.(null)}
                    className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-dynamic-accent cursor-pointer transition"
                  >
                    <span className="h-4 w-4 rounded-full border border-slate-300" style={{ backgroundColor: hex }} />
                    <span className="text-xs font-mono font-bold text-slate-900">{hex}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModalStyle(null)}
                className="w-full rounded-xl bg-slate-900 text-white font-bold py-2.5 text-sm hover:bg-slate-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus-visible:ring-slate-900 shadow-xs"
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
