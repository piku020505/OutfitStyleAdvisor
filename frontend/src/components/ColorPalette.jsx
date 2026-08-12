export default function ColorPalette({ colors }) {
  if (!colors || colors.length === 0) return null

  return (
    <div>
      <h3 className="font-display text-lg text-ink mb-3">Dominant Palette</h3>
      <div className="flex gap-3 flex-wrap">
        {colors.map((c) => (
          <div key={c.hex} className="flex flex-col items-center gap-1.5">
            <div
              className="h-14 w-14 rounded-full border border-black/10 shadow-sm"
              style={{ backgroundColor: c.hex }}
              title={`${c.name} · ${c.hex}`}
            />
            <span className="text-xs text-ink/60 capitalize">{c.name}</span>
            <span className="text-[10px] text-ink/35">{Math.round(c.weight * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
