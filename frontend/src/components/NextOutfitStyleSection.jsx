import { useState } from 'react'
import { Sparkles, ArrowRight, Layers, Check, Copy, X, Shirt, Palette } from 'lucide-react'

export default function NextOutfitStyleSection({ nextStyles }) {
  const [copiedHex, setCopiedHex] = useState(null)
  const [activeModalStyle, setActiveModalStyle] = useState(null)

  if (!nextStyles || nextStyles.length === 0) return null

  function copyColor(hex) {
    navigator.clipboard.writeText(hex)
    setCopiedHex(hex)
    setTimeout(() => setCopiedHex(null), 2000)
  }

  return (
    <div className="pt-6 border-t border-ink/10 space-y-4">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-accent">
          <Sparkles size={18} />
          <h3 className="font-display text-lg text-ink font-semibold">
            Next Outfit Style Variations
          </h3>
        </div>
        <span className="text-xs text-ink/50 font-medium">What to wear next</span>
      </div>

      {/* Grid of Next Outfit Styles */}
      <div className="grid sm:grid-cols-2 gap-4">
        {nextStyles.map((styleItem, idx) => (
          <div
            key={styleItem.title || idx}
            className="group relative rounded-xl border border-ink/10 bg-paper/40 p-4 transition-all hover:border-accent/40 hover:bg-white hover:shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                  {styleItem.vibe || 'Style Option'}
                </span>
                <span className="text-xs text-ink/40 font-mono">Option #{idx + 1}</span>
              </div>

              <h4 className="font-display text-base font-semibold text-ink group-hover:text-accent transition mb-1">
                {styleItem.title}
              </h4>

              <p className="text-xs text-ink/70 leading-relaxed mb-3">{styleItem.concept}</p>

              {/* Garments tags */}
              <div className="space-y-1 mb-3">
                <p className="text-[11px] font-semibold text-ink/50 uppercase tracking-wider flex items-center gap-1">
                  <Shirt size={12} /> Key Clothing Pieces:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {styleItem.garments?.map((g) => (
                    <span
                      key={g}
                      className="inline-block rounded-md bg-white border border-ink/10 px-2 py-0.5 text-xs text-ink/80"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {/* Color Swatches */}
              <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                <div className="flex items-center gap-1.5">
                  {styleItem.palette?.map((hex) => (
                    <button
                      key={hex}
                      onClick={() => copyColor(hex)}
                      title={`Copy ${hex}`}
                      className="group/color relative h-5 w-5 rounded-full border border-black/20 transition transform hover:scale-110"
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
                  className="text-xs font-semibold text-accent flex items-center gap-1 hover:underline"
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-2xl border border-ink/10 p-6 shadow-xl space-y-4 animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveModalStyle(null)}
              className="absolute top-4 right-4 rounded-full p-1 text-ink/50 hover:bg-ink/5 hover:text-ink"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 text-accent">
              <Sparkles size={18} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {activeModalStyle.vibe}
              </span>
            </div>

            <h3 className="font-display text-xl text-ink font-semibold">{activeModalStyle.title}</h3>

            <p className="text-sm text-ink/80 leading-relaxed bg-accent/5 rounded-xl p-3 border border-accent/15">
              {activeModalStyle.concept}
            </p>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink/60 mb-2 flex items-center gap-1">
                <Shirt size={14} /> Next Outfit Garments
              </h4>
              <ul className="space-y-1.5">
                {activeModalStyle.garments?.map((g) => (
                  <li key={g} className="text-sm text-ink/80 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ink/60 mb-2 flex items-center gap-1">
                <Palette size={14} /> Recommended Color Palette
              </h4>
              <div className="flex items-center gap-3">
                {activeModalStyle.palette?.map((hex) => (
                  <div key={hex} className="flex items-center gap-2 bg-paper px-3 py-1.5 rounded-lg border border-ink/10">
                    <span className="h-4 w-4 rounded-full border border-black/20" style={{ backgroundColor: hex }} />
                    <span className="text-xs font-mono font-medium text-ink">{hex}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveModalStyle(null)}
                className="w-full rounded-xl bg-ink text-white font-medium py-2.5 text-sm hover:opacity-90 transition"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
