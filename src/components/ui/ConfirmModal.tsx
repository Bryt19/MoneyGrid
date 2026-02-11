import { useState } from 'react'
import type { ReactNode } from 'react'

type ConfirmModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description: ReactNode
  confirmLabel: string
  variant?: 'danger' | 'default'
  loading?: boolean
}

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  variant = 'default',
  loading: loadingProp = false,
}: ConfirmModalProps) => {
  const [busy, setBusy] = useState(false)
  const loading = loadingProp || busy

  if (!open) return null

  const handleConfirm = async () => {
    try {
      setBusy(true)
      await onConfirm()
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <div
        className="w-full max-w-md rounded-xl border border-[var(--border)] bg-[var(--card-bg)] p-5 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-title" className="text-lg font-semibold text-[var(--text)]">
          {title}
        </h2>
        <div className="mt-2 text-sm text-[var(--text-muted)]">{description}</div>
        <div className="mt-5 flex flex-wrap gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-[var(--border)] bg-[var(--page-bg)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--border)] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-primary hover:bg-primary-hover'
            }`}
          >
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
