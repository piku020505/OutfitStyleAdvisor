import { useCallback, useRef, useState } from 'react'
import { Upload, Image as ImageIcon } from 'lucide-react'

export default function ImageUploader({ onFileSelected, previewUrl, disabled }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback(
    (files) => {
      if (files && files[0]) onFileSelected(files[0])
    },
    [onFileSelected]
  )

  const handleKeyDown = (e) => {
    if (disabled) return
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      inputRef.current?.click()
    }
  }

  return (
    <div
      tabIndex={disabled ? -1 : 0}
      role="button"
      aria-label="Upload outfit photo"
      onKeyDown={handleKeyDown}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
      onClick={() => !disabled && inputRef.current?.click()}
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas focus-visible:ring-dynamic-accent
        ${isDragging ? 'border-dynamic-accent bg-slate-100 scale-[1.01]' : 'border-border bg-white hover:border-dynamic-accent/70 hover:bg-slate-50/50'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        h-80 shadow-sm`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {previewUrl ? (
        <div className="relative w-full h-full group">
          <img src={previewUrl} alt="Outfit preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[2px]">
            <Upload size={16} /> Click or drop to replace photo
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 text-slate-500 px-6 text-center">
          <div className="rounded-full bg-slate-100 border border-slate-200 p-4 text-dynamic-accent shadow-inner">
            <Upload size={28} />
          </div>
          <p className="font-semibold text-slate-900 text-sm">Drop an outfit photo here</p>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
            <ImageIcon size={13} /> or click / press space to browse (JPEG, PNG, WEBP)
          </p>
        </div>
      )}
    </div>
  )
}
