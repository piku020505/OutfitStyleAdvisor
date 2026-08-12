export default function ColorPalette({ colors, onHoverColor }) {
  if (!colors || colors.length === 0) return null

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display tracking-wider uppercase text-xs font-semibold text-muted">
          Extracted Dominant Palette
        </h3>
        <span className="text-[11px] text-muted font-mono">Scikit-Learn K-Means (RGB)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {colors.map((c) => (
          <div
            key={c.hex}
            onMouseEnter={() => onHoverColor?.(c.hex)}
            onMouseLeave={() => onHoverColor?.(null)}
            className="group relative flex flex-col items-center gap-2 rounded-xl bg-white border border-border p-3 transition-all duration-200 hover:border-dynamic-accent hover:shadow-md cursor-pointer"
            title={`Click or hover to tint UI with ${c.name} (${c.hex})`}
          >
            <div
              className="h-10 w-10 rounded-full border border-slate-300 shadow-sm group-hover:scale-105 transition-transform duration-200"
              style={{ backgroundColor: c.hex }}
            />
            <div className="text-center">
              <p className="text-xs font-semibold text-paper capitalize leading-none mb-1">{c.name}</p>
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted font-mono">
                <span>{c.hex}</span>
                <span>·</span>
                <span className="text-paper font-bold">{Math.round(c.weight * 100)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
