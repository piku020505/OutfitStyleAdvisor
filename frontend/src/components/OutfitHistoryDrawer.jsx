import { useState, useEffect } from 'react'
import { X, History, Trash2, Shirt, Loader2, Sparkles } from 'lucide-react'

const API_BASE = 'http://localhost:8000/api'

export default function OutfitHistoryDrawer({ isOpen, onClose, token, onSelectHistoryItem }) {
  const [historyItems, setHistoryItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen && token) {
      fetchHistory()
    }
  }, [isOpen, token])

  async function fetchHistory() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/history`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to load history.')
      const data = await res.json()
      setHistoryItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation()
    setDeletingId(id)
    try {
      const res = await fetch(`${API_BASE}/history/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Failed to delete item.')
      setHistoryItems((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      alert(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-full sm:max-w-md bg-surface border-l border-border h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-surface-elevated">
          <div className="flex items-center gap-2 text-paper font-semibold font-display text-lg">
            <History size={20} className="text-dynamic-accent" />
            <span>Saved Outfit History</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-muted hover:bg-surface hover:text-paper transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted gap-2">
              <Loader2 size={24} className="animate-spin text-dynamic-accent" />
              <p className="text-xs font-mono">Fetching saved analyses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-400 text-xs">{error}</div>
          ) : historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-muted gap-3">
              <div className="rounded-full bg-surface-elevated p-4 text-muted-dark border border-border">
                <Shirt size={32} />
              </div>
              <p className="text-sm font-semibold text-paper">No outfits analyzed yet</p>
              <p className="text-xs text-muted-dark max-w-xs leading-relaxed">
                Upload an outfit photo or select a canvas preset to create and save your first styling report.
              </p>
            </div>
          ) : (
            historyItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item)
                  onClose()
                }}
                className="group relative rounded-xl border border-border bg-surface-elevated p-4 hover:border-dynamic-accent hover:bg-surface-card transition cursor-pointer space-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dynamic-accent"
                tabIndex={0}
                role="button"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-wider uppercase bg-dynamic-accent/15 text-dynamic-accent px-2 py-0.5 rounded border border-dynamic-accent/20">
                    {item.style} · {item.garment_type}
                  </span>
                  <span className="text-[10px] text-muted-dark font-mono">
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                <h4 className="text-sm font-semibold text-paper group-hover:text-dynamic-accent transition">
                  {item.style_report?.headline || `${item.style} ${item.garment_type}`}
                </h4>

                {/* Dominant Palette Swatches */}
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <div className="flex items-center gap-1.5">
                    {item.dominant_colors?.map((c) => (
                      <span
                        key={c.hex}
                        className="h-3.5 w-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: c.hex }}
                        title={`${c.name} (${c.hex})`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    disabled={deletingId === item.id}
                    title="Delete Saved Outfit"
                    className="text-muted-dark hover:text-red-400 p-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
