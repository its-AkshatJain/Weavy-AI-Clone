'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import WorkflowCanvas from './WorkflowCanvas'
import SaveWorkflowModal from './modals/SaveWorkflowModal'
import LoadWorkflowModal from './modals/LoadWorkflowModal'
import ConfirmModal from './modals/ConfirmModal'
import { ToastContainer, Toast, ToastType } from './Toast'
import { useWorkflowStore } from '@/stores/workflow-store'
import { Save, Download, Upload, Undo2, Redo2, Trash2, FolderOpen, Menu, FilePlus } from 'lucide-react'
import { createProductListingWorkflow, exportWorkflowToFile, importWorkflowFromFile } from '@/utils/workflow'

export default function WorkflowBuilder() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [loadModalOpen, setLoadModalOpen] = useState(false)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null)
  const [confirmTitle, setConfirmTitle] = useState('')
  const [confirmMessage, setConfirmMessage] = useState('')
  const [confirmVariant, setConfirmVariant] = useState<'danger' | 'warning' | 'info'>('warning')
  const [currentWorkflowName, setCurrentWorkflowName] = useState<string | null>(null)
  const [currentWorkflowId, setCurrentWorkflowId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [toasts, setToasts] = useState<Toast[]>([])
  const {
    nodes,
    edges,
    loadWorkflow,
    exportWorkflow,
    importWorkflow,
    reset,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useWorkflowStore()

  // Load pre-built workflow only on first visit to /workflow page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasVisited = sessionStorage.getItem('weavy-workflow-visited')
      const isWorkflowPage = window.location.pathname === '/workflow'
      
      if (!hasVisited && isWorkflowPage) {
        const prebuiltWorkflow = createProductListingWorkflow()
        loadWorkflow(prebuiltWorkflow.nodes, prebuiltWorkflow.edges)
        setCurrentWorkflowName(null) // Prebuilt workflow doesn't have a saved name
        sessionStorage.setItem('weavy-workflow-visited', 'true')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Ensure sidebar starts collapsed on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768 // md breakpoint
      if (isMobile) {
        setSidebarCollapsed(true)
      }
    }
  }, [])

  const showToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const handleSave = async (name: string) => {
    setIsSaving(true)
    
    try {
      const workflow = exportWorkflow()

      // If we have a current workflow ID, update it; otherwise create new
      const url = currentWorkflowId 
        ? `/api/workflows/${currentWorkflowId}`
        : '/api/workflows'
      const method = currentWorkflowId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          nodes: workflow.nodes,
          edges: workflow.edges,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentWorkflowName(name)
        setCurrentWorkflowId(data.id || currentWorkflowId)
        showToast(
          currentWorkflowId 
            ? 'Workflow updated successfully!'
            : 'Workflow saved successfully!',
          'success'
        )
        setSaveModalOpen(false)
      } else {
        const errorData = await response.json()
        console.error('Failed to save workflow:', errorData)
        showToast(errorData.error || 'Failed to save workflow', 'error')
      }
    } catch (error) {
      console.error('Error saving workflow:', error)
      showToast(error instanceof Error ? error.message : 'Failed to save workflow', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleLoad = async (workflowId: string) => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/workflows/${workflowId}`)
      
      if (response.ok) {
        const data = await response.json()
        
        if (!data.nodes || !data.edges) {
          console.error('Invalid workflow data: missing nodes or edges')
          showToast('Invalid workflow data: missing nodes or edges', 'error')
          return
        }
        
        importWorkflow({ nodes: data.nodes, edges: data.edges })
        setCurrentWorkflowName(data.name)
        setCurrentWorkflowId(workflowId)
        showToast(`Workflow "${data.name}" loaded successfully!`, 'success')
        setLoadModalOpen(false)
      } else {
        let errorData
        try {
          const text = await response.text()
          errorData = text ? JSON.parse(text) : { error: `HTTP ${response.status}: ${response.statusText}` }
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
        }
        console.error('Failed to load workflow:', response.status, errorData)
        showToast(errorData.error || `Failed to load workflow (${response.status})`, 'error')
      }
    } catch (error) {
      console.error('Error loading workflow:', error)
      showToast(error instanceof Error ? error.message : 'Failed to load workflow', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (workflowId: string) => {
    try {
      const response = await fetch(`/api/workflows/${workflowId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        showToast('Workflow deleted successfully', 'success')
        // Clear workflow name and ID if the deleted workflow was currently loaded
        if (currentWorkflowName) {
          setCurrentWorkflowName(null)
          setCurrentWorkflowId(null)
        }
      } else {
        const errorData = await response.json()
        console.error('Failed to delete workflow:', errorData)
        showToast(errorData.error || 'Failed to delete workflow', 'error')
      }
    } catch (error) {
      console.error('Error deleting workflow:', error)
      showToast(error instanceof Error ? error.message : 'Failed to delete workflow', 'error')
    }
  }

  const handleExport = () => {
    const workflow = exportWorkflow()
    exportWorkflowToFile(workflow)
    showToast('Workflow exported successfully!', 'success')
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        try {
          const workflow = await importWorkflowFromFile(file)
          importWorkflow(workflow)
          setCurrentWorkflowName(null) // Imported workflows don't have a name
          setCurrentWorkflowId(null) // Imported workflows don't have an ID
          showToast('Workflow imported successfully!', 'success')
        } catch (error) {
          console.error('Error importing workflow:', error)
          showToast('Failed to import workflow', 'error')
        }
      }
    }
    input.click()
  }

  const showConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: 'danger' | 'warning' | 'info' = 'warning'
  ) => {
    setConfirmTitle(title)
    setConfirmMessage(message)
    setConfirmAction(() => onConfirm)
    setConfirmVariant(variant)
    setConfirmModalOpen(true)
  }

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction()
      setConfirmAction(null)
    }
    setConfirmModalOpen(false)
  }

  const handleClear = () => {
    showConfirm(
      'Clear Workflow',
      'Are you sure you want to clear the current workflow? This action cannot be undone.',
      () => {
        reset()
        setCurrentWorkflowName(null)
        setCurrentWorkflowId(null)
        showToast('Workflow cleared', 'info')
      },
      'danger'
    )
  }

  const handleNew = () => {
    // Check if there are any nodes/edges to warn user
    const hasContent = nodes.length > 0 || edges.length > 0
    
    if (hasContent) {
      showConfirm(
        'New Workflow',
        'Starting a new workflow will clear the current one. Any unsaved changes will be lost. Do you want to continue?',
        () => {
          reset()
          setCurrentWorkflowName(null)
          setCurrentWorkflowId(null)
          showToast('New workflow started', 'info')
        },
        'warning'
      )
    } else {
      // No content, just reset
      reset()
      setCurrentWorkflowName(null)
      setCurrentWorkflowId(null)
      showToast('New workflow started', 'info')
    }
  }

  return (
    <>
      <div className="flex w-full h-screen overflow-hidden bg-weavy-bg-primary" style={{ height: '100vh', overflow: 'hidden' }}>
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        </div>
        
        {/* Mobile sidebar overlay */}
        {!sidebarCollapsed && (
          <div className="md:hidden fixed inset-0 z-30">
            <div 
              className="absolute inset-0 bg-black/50 transition-opacity duration-300" 
              onClick={() => setSidebarCollapsed(true)} 
            />
            <div className="absolute left-0 top-0 bottom-0 w-[280px] z-40 shadow-2xl">
              <Sidebar collapsed={false} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
            </div>
          </div>
        )}
        
        <div className="flex-1 flex flex-col h-screen min-w-0">
          {/* Toolbar */}
          <div className="h-auto md:h-12 bg-weavy-bg-secondary border-b border-weavy-border flex flex-row items-center justify-between px-2 md:px-4 py-2 md:py-0 z-20">
            <div className="flex items-center gap-1.5 md:gap-4 flex-1 min-w-0 overflow-x-auto scrollbar-none">
              {currentWorkflowName && (
                <>
                  <div className="px-2 md:px-3 py-1.5 bg-weavy-bg-tertiary border border-weavy-border rounded-md flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-weavy-text-secondary font-medium hidden sm:inline">Workflow:</span>
                    <span className="text-xs md:text-sm font-semibold text-weavy-text-primary truncate max-w-[100px] sm:max-w-[200px]">
                      {currentWorkflowName}
                    </span>
                  </div>
                  <div className="w-px h-4 md:h-6 bg-weavy-border hidden sm:block flex-shrink-0" />
                </>
              )}
              <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                <button
                  onClick={undo}
                  disabled={!canUndo()}
                  className="p-1.5 md:p-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={redo}
                  disabled={!canRedo()}
                  className="p-1.5 md:p-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <div className="w-px h-4 md:h-6 bg-weavy-border mx-0.5 md:mx-2 flex-shrink-0" />
                <button
                  onClick={handleNew}
                  className="px-2 md:px-3 py-1.5 md:py-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200 flex items-center gap-1.5 md:gap-2 flex-shrink-0"
                  title="New workflow"
                >
                  <FilePlus className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-xs font-medium hidden sm:inline">New</span>
                </button>
                <button
                  onClick={() => setSaveModalOpen(true)}
                  className="px-2 md:px-3 py-1.5 md:py-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200 flex items-center gap-1.5 md:gap-2 flex-shrink-0"
                  title="Save workflow"
                >
                  <Save className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-xs font-medium hidden sm:inline">Save</span>
                </button>
                <button
                  onClick={() => setLoadModalOpen(true)}
                  className="px-2 md:px-3 py-1.5 md:py-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200 flex items-center gap-1.5 md:gap-2 flex-shrink-0"
                  title="Load workflow"
                >
                  <FolderOpen className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-xs font-medium hidden sm:inline">Load</span>
                </button>
                <button
                  onClick={handleExport}
                  className="p-1.5 md:p-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200 flex-shrink-0"
                  title="Export workflow"
                >
                  <Download className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
                <button
                  onClick={handleImport}
                  className="p-1.5 md:p-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200 flex-shrink-0"
                  title="Import workflow"
                >
                  <Upload className="w-3.5 h-3.5 md:w-4 md:h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
              {/* Mobile sidebar toggle button */}
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="md:hidden p-1.5 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200"
                title="Toggle sidebar"
              >
                <Menu className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="p-1.5 md:p-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-red-500/20 hover:border-red-500/50 transition-colors duration-200 flex-shrink-0"
                title="Clear workflow"
              >
                <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </button>
            </div>
          </div>

          {/* Canvas */}
          <WorkflowCanvas sidebarCollapsed={sidebarCollapsed} />
        </div>
      </div>

      {/* Modals */}
      <SaveWorkflowModal
        key={`save-modal-${currentWorkflowId || 'new'}`}
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSave}
        isLoading={isSaving}
        currentWorkflowName={currentWorkflowName}
        isUpdate={Boolean(currentWorkflowId)}
      />
      <LoadWorkflowModal
        isOpen={loadModalOpen}
        onClose={() => setLoadModalOpen(false)}
        onLoad={handleLoad}
        onDelete={handleDelete}
        isLoading={isLoading}
        onShowConfirm={showConfirm}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirm}
        title={confirmTitle}
        message={confirmMessage}
        variant={confirmVariant}
        confirmText="Confirm"
        cancelText="Cancel"
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}
