import { useState, useEffect } from 'react'
import { X, History, Trash2, ArrowUpRight, Shirt, Loader2, Sparkles } from 'lucide-react'

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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-5 border-b border-ink/10 flex items-center justify-between bg-paper">
          <div className="flex items-center gap-2 text-ink font-semibold font-display text-lg">
            <History size={20} className="text-accent" />
            <span>Saved Outfit History</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-ink/40 hover:bg-ink/5 hover:text-ink transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-ink/40 gap-2">
              <Loader2 size={24} className="animate-spin text-accent" />
              <p className="text-xs font-medium">Fetching saved analyses...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-600 text-xs">{error}</div>
          ) : historyItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-ink/40 gap-2">
              <Shirt size={32} />
              <p className="text-xs">No saved outfit analyses yet.<br />Upload photos while logged in to auto-save history!</p>
            </div>
          ) : (
            historyItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item)
                  onClose()
                }}
                className="group relative rounded-xl border border-ink/10 p-4 bg-white hover:border-accent/40 hover:shadow-md transition cursor-pointer space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs text-ink/50">
                  <span className="font-mono text-[11px]">
                    {new Date(item.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    disabled={deletingId === item.id}
                    title="Delete entry"
                    className="text-ink/30 hover:text-red-600 p-1 transition"
                  >
                    {deletingId === item.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>

                <h4 className="font-display text-sm font-semibold text-ink group-hover:text-accent transition line-clamp-1">
                  {item.style_report?.headline || `${item.style} ${item.garment_type}`}
                </h4>

                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-medium text-ink/70 capitalize">
                    {item.garment_type}
                  </span>
                  <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] font-medium text-ink/70 capitalize">
                    {item.style}
                  </span>
                  <span className="rounded-full bg-accent/10 text-accent px-2 py-0.5 text-[10px] font-semibold">
                    {Math.round(item.garment_confidence * 100)}% Match
                  </span>
                </div>

                {/* Color Swatches */}
                <div className="flex items-center justify-between pt-2 border-t border-ink/10">
                  <div className="flex items-center gap-1.5">
                    {item.dominant_colors?.map((c, i) => (
                      <span
                        key={i}
                        className="h-3.5 w-3.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>

                  <span className="text-xs font-semibold text-accent flex items-center gap-1">
                    Load Report <ArrowUpRight size={13} />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
