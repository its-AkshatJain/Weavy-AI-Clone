'use client'

import { useState, useEffect } from 'react'
import { X, Loader2, Trash2, RefreshCw, AlertCircle } from 'lucide-react'

interface Workflow {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

interface LoadWorkflowModalProps {
  isOpen: boolean
  onClose: () => void
  onLoad: (workflowId: string) => Promise<void>
  onDelete?: (workflowId: string) => Promise<void>
  isLoading?: boolean
  onShowConfirm?: (title: string, message: string, onConfirm: () => void, variant?: 'danger' | 'warning' | 'info') => void
}

export default function LoadWorkflowModal({
  isOpen,
  onClose,
  onLoad,
  onDelete,
  isLoading = false,
  onShowConfirm,
}: LoadWorkflowModalProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      fetchWorkflows()
    }
  }, [isOpen])

  const fetchWorkflows = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/workflows')
      
      if (response.ok) {
        const data = await response.json()
        setWorkflows(data.workflows || [])
      } else {
        let errorData
        try {
          const text = await response.text()
          errorData = text ? JSON.parse(text) : { error: `HTTP ${response.status}: ${response.statusText}` }
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
        }
        console.error('Failed to fetch workflows:', errorData)
        setError(errorData.error || 'Failed to fetch workflows')
      }
    } catch (error) {
      console.error('Network error fetching workflows:', error)
      setError(error instanceof Error ? error.message : 'Failed to connect to server. Check MongoDB connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleLoad = async (workflowId: string) => {
    await onLoad(workflowId)
    onClose()
  }

  const handleDelete = async (e: React.MouseEvent, workflowId: string) => {
    e.stopPropagation()
    
    const workflow = workflows.find((w) => w.id === workflowId)
    const workflowName = workflow?.name || 'this workflow'
    
    if (onShowConfirm) {
      onShowConfirm(
        'Delete Workflow',
        `Are you sure you want to delete "${workflowName}"? This action cannot be undone.`,
        async () => {
          setDeletingId(workflowId)
          
          try {
            const response = await fetch(`/api/workflows/${workflowId}`, {
              method: 'DELETE',
            })

            if (response.ok) {
              setWorkflows(workflows.filter((w) => w.id !== workflowId))
              if (onDelete) {
                await onDelete(workflowId)
              }
            } else {
              const errorData = await response.json()
              console.error('Failed to delete workflow:', errorData)
              setError(errorData.error || 'Failed to delete workflow')
            }
          } catch (error) {
            console.error('Error deleting workflow:', error)
            setError(error instanceof Error ? error.message : 'Failed to delete workflow')
          } finally {
            setDeletingId(null)
          }
        },
        'danger'
      )
    } else {
      // Fallback to confirm if onShowConfirm is not provided
      if (!confirm(`Are you sure you want to delete "${workflowName}"?`)) {
        return
      }

      setDeletingId(workflowId)
      
      try {
        const response = await fetch(`/api/workflows/${workflowId}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          setWorkflows(workflows.filter((w) => w.id !== workflowId))
          if (onDelete) {
            await onDelete(workflowId)
          }
        } else {
          const errorData = await response.json()
          console.error('Failed to delete workflow:', errorData)
          setError(errorData.error || 'Failed to delete workflow')
        }
      } catch (error) {
        console.error('Error deleting workflow:', error)
        setError(error instanceof Error ? error.message : 'Failed to delete workflow')
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-weavy-bg-secondary border border-weavy-border rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-weavy-border">
          <h2 className="text-lg font-semibold text-weavy-text-primary">Load Workflow</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchWorkflows}
              disabled={loading}
              className="p-1.5 hover:bg-weavy-bg-primary rounded transition-colors disabled:opacity-50"
              title="Refresh workflows"
            >
              <RefreshCw className={`w-4 h-4 text-weavy-text-secondary ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="p-1 hover:bg-weavy-bg-primary rounded transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-weavy-text-secondary" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-weavy-accent" />
              <p className="text-sm text-weavy-text-secondary">Loading workflows...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <p className="text-sm text-red-400 font-medium">{error}</p>
              <p className="text-xs text-weavy-text-secondary text-center max-w-md">
                {error.includes('MongoDB') || error.includes('connection') ? (
                  <>
                    Check that MONGODB_URI is set in .env.local<br />
                    Verify your MongoDB connection is active
                  </>
                ) : (
                  'Please try refreshing or check the console for details'
                )}
              </p>
            </div>
          ) : workflows.length === 0 ? (
            <div className="text-center py-12 text-weavy-text-secondary">
              <p className="text-sm">No saved workflows found</p>
              <p className="text-xs mt-2">Create a workflow and save it to see it here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  onClick={() => !isLoading && handleLoad(workflow.id)}
                  className="p-4 bg-weavy-bg-primary border border-weavy-border rounded-lg hover:border-weavy-accent hover:bg-weavy-bg-tertiary transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-weavy-text-primary truncate">
                        {workflow.name}
                      </h3>
                      <p className="text-xs text-weavy-text-secondary mt-1">
                        Updated: {new Date(workflow.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    {onDelete && (
                      <button
                        onClick={(e) => handleDelete(e, workflow.id)}
                        disabled={deletingId === workflow.id || isLoading}
                        className="ml-2 p-2 hover:bg-red-500/20 rounded transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                        title="Delete workflow"
                      >
                        {deletingId === workflow.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-400" />
                        ) : (
                          <Trash2 className="w-4 h-4 text-red-400" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-4 border-t border-weavy-border">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary transition-colors disabled:opacity-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

