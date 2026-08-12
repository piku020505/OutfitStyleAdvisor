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

  return (
    <div
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
      className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden
        ${isDragging ? 'border-accent bg-accent/5' : 'border-ink/20 bg-white'}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:border-accent'}
        h-80`}
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
        <img src={previewUrl} alt="Outfit preview" className="h-full w-full object-cover" />
      ) : (
        <div className="flex flex-col items-center gap-3 text-ink/50 px-6 text-center">
          <div className="rounded-full bg-ink/5 p-4">
            <Upload size={28} />
          </div>
          <p className="font-medium text-ink/70">Drop an outfit photo here</p>
          <p className="text-sm flex items-center gap-1">
            <ImageIcon size={14} /> or click to browse (JPEG, PNG, WEBP)
          </p>
        </div>
      )}
    </div>
  )
}
