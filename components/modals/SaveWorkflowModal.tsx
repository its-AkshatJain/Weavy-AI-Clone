'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface SaveWorkflowModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (name: string) => Promise<void>
  isLoading?: boolean
}

export default function SaveWorkflowModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: SaveWorkflowModalProps) {
  const [workflowName, setWorkflowName] = useState('')

  useEffect(() => {
    if (isOpen) {
      setWorkflowName('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (workflowName.trim()) {
      await onSave(workflowName.trim())
      setWorkflowName('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-weavy-bg-secondary border border-weavy-border rounded-lg shadow-xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-weavy-border">
          <h2 className="text-lg font-semibold text-weavy-text-primary">Save Workflow</h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1 hover:bg-weavy-bg-primary rounded transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-weavy-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-weavy-text-secondary mb-2">
                Workflow Name
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="Enter workflow name..."
                disabled={isLoading}
                autoFocus
                className="w-full px-3 py-2 bg-weavy-bg-primary border border-weavy-border rounded text-weavy-text-primary placeholder-weavy-text-secondary focus:outline-none focus:border-weavy-accent transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!workflowName.trim() || isLoading}
              className="px-4 py-2 bg-weavy-accent hover:bg-weavy-accent-hover text-white rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

