'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import WorkflowCanvas from './WorkflowCanvas'
import SaveWorkflowModal from './modals/SaveWorkflowModal'
import LoadWorkflowModal from './modals/LoadWorkflowModal'
import { ToastContainer, Toast, ToastType } from './Toast'
import { useWorkflowStore } from '@/stores/workflow-store'
import { Save, Download, Upload, Undo2, Redo2, Trash2, FolderOpen } from 'lucide-react'
import { createProductListingWorkflow, exportWorkflowToFile, importWorkflowFromFile } from '@/utils/workflow'

export default function WorkflowBuilder() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [loadModalOpen, setLoadModalOpen] = useState(false)
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
        sessionStorage.setItem('weavy-workflow-visited', 'true')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          nodes: workflow.nodes,
          edges: workflow.edges,
        }),
      })

      if (response.ok) {
        showToast('Workflow saved successfully!', 'success')
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
          showToast('Workflow imported successfully!', 'success')
        } catch (error) {
          console.error('Error importing workflow:', error)
          showToast('Failed to import workflow', 'error')
        }
      }
    }
    input.click()
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the workflow?')) {
      reset()
      showToast('Workflow cleared', 'info')
    }
  }

  return (
    <>
      <div className="flex w-full h-screen overflow-hidden bg-weavy-bg-primary" style={{ height: '100vh', overflow: 'hidden' }}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <div className="flex-1 flex flex-col h-screen">
          {/* Toolbar */}
          <div className="h-12 bg-weavy-bg-secondary border-b border-weavy-border flex items-center justify-between px-4 z-20">
            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo()}
                className="p-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                title="Undo (Ctrl+Z)"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={redo}
                disabled={!canRedo()}
                className="p-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                title="Redo (Ctrl+Y)"
              >
                <Redo2 className="w-4 h-4" />
              </button>
              <div className="w-px h-6 bg-weavy-border mx-2" />
              <button
                onClick={() => setSaveModalOpen(true)}
                className="px-3 py-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200 flex items-center gap-2"
                title="Save workflow"
              >
                <Save className="w-4 h-4" />
                <span className="text-xs font-medium">Save</span>
              </button>
              <button
                onClick={() => setLoadModalOpen(true)}
                className="px-3 py-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200 flex items-center gap-2"
                title="Load workflow"
              >
                <FolderOpen className="w-4 h-4" />
                <span className="text-xs font-medium">Load</span>
              </button>
              <button
                onClick={handleExport}
                className="p-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200"
                title="Export workflow"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={handleImport}
                className="p-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200"
                title="Import workflow"
              >
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleClear}
              className="p-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-red-500/20 hover:border-red-500/50 transition-colors duration-200"
              title="Clear workflow"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Canvas */}
          <WorkflowCanvas sidebarCollapsed={sidebarCollapsed} />
        </div>
      </div>

      {/* Modals */}
      <SaveWorkflowModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSave={handleSave}
        isLoading={isSaving}
      />
      <LoadWorkflowModal
        isOpen={loadModalOpen}
        onClose={() => setLoadModalOpen(false)}
        onLoad={handleLoad}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  )
}
