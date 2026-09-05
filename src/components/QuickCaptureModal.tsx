import { useState, useEffect, useRef } from 'react'
import { X, Send } from 'lucide-react'

type Category = 'insight' | 'powerful_moment' | 'scripture' | 'question' | 'action'

interface QuickCaptureModalProps {
  category: Category | null
  onClose: () => void
  onSave: (content: string) => void
}

const CATEGORY_LABELS: Record<Category, string> = {
  insight: 'Insight',
  powerful_moment: 'Powerful Moment',
  scripture: 'Scripture',
  question: 'Question',
  action: 'Action Item'
}

export default function QuickCaptureModal({ category, onClose, onSave }: QuickCaptureModalProps) {
  const [content, setContent] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (category && inputRef.current) {
      inputRef.current.focus()
    }
  }, [category])

  if (!category) return null

  const handleSave = () => {
    if (content.trim()) {
      onSave(content.trim())
      setContent('')
    }
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(10, 10, 15, 0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div 
        className="animate-slide-up bg-surface border-t border-border p-md rounded-t-xl"
        onClick={e => e.stopPropagation()} // Prevent close on modal click
        style={{ background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: 'var(--space-lg)', borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)' }}
      >
        <div className="flex justify-between items-center mb-md">
          <h3 className="text-primary">{CATEGORY_LABELS[category]}</h3>
          <button className="btn-icon" onClick={onClose} style={{ width: 32, height: 32 }}>
            <X size={18} />
          </button>
        </div>

        <textarea
          ref={inputRef}
          className="input-field mb-md"
          rows={3}
          placeholder={`Capture your ${CATEGORY_LABELS[category].toLowerCase()}...`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              handleSave()
            }
          }}
        />

        <button 
          className="btn btn-primary"
          onClick={handleSave}
          disabled={!content.trim()}
        >
          Save Capture
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
