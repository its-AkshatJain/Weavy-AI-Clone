'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import WorkflowCanvas from './WorkflowCanvas'
import { useWorkflowStore } from '@/stores/workflow-store'
import { Save, Download, Upload, Undo2, Redo2, Trash2 } from 'lucide-react'
import { createProductListingWorkflow, exportWorkflowToFile, importWorkflowFromFile } from '@/utils/workflow'

export default function WorkflowBuilder() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const {
    loadWorkflow,
    exportWorkflow,
    importWorkflow,
    reset,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useWorkflowStore()

  // Load pre-built Product Listing Generator workflow on mount
  useEffect(() => {
    const prebuiltWorkflow = createProductListingWorkflow()
    loadWorkflow(prebuiltWorkflow.nodes, prebuiltWorkflow.edges)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = () => {
    const workflow = exportWorkflow()
    localStorage.setItem('weavy-workflow', JSON.stringify(workflow))
    alert('Workflow saved to localStorage!')
  }

  const handleLoad = () => {
    const saved = localStorage.getItem('weavy-workflow')
    if (saved) {
      try {
        const workflow = JSON.parse(saved)
        importWorkflow(workflow)
        alert('Workflow loaded from localStorage!')
      } catch (error) {
        alert('Failed to load workflow')
      }
    } else {
      alert('No saved workflow found')
    }
  }

  const handleExport = () => {
    const workflow = exportWorkflow()
    exportWorkflowToFile(workflow)
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
          alert('Workflow imported successfully!')
        } catch (error) {
          alert('Failed to import workflow')
        }
      }
    }
    input.click()
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the workflow?')) {
      reset()
    }
  }

  return (
    <div className="flex w-full h-screen overflow-hidden bg-weavy-bg-primary">
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
              onClick={handleSave}
              className="p-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200"
              title="Save workflow"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={handleLoad}
              className="p-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200"
              title="Load workflow"
            >
              <Upload className="w-4 h-4" />
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
  )
}

