'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import WorkflowCanvas from './WorkflowCanvas'
import { useWorkflowStore } from '@/lib/store'
import { Node, Edge } from 'reactflow'
import { Save, Download, Upload, Undo2, Redo2, Trash2 } from 'lucide-react'

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
    const dataStr = JSON.stringify(workflow, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'weavy-workflow.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const workflow = JSON.parse(event.target?.result as string)
            importWorkflow(workflow)
            alert('Workflow imported successfully!')
          } catch (error) {
            alert('Failed to import workflow')
          }
        }
        reader.readAsText(file)
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

// Pre-built Product Listing Generator workflow
function createProductListingWorkflow(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [
    // Image Node: Product Photo
    {
      id: 'image-1',
      type: 'image',
      position: { x: 100, y: 100 },
      data: {
        label: 'Image Node',
        imageUrl: '',
      },
    },
    // LLM Node: Analyze product
    {
      id: 'llm-1',
      type: 'llm',
      position: { x: 400, y: 100 },
      data: {
        label: 'Run Any LLM Node',
        model: 'gemini-pro-vision',
        systemPrompt: 'You are a product analysis expert. Analyze the product image and provide detailed information.',
        prompt: 'Analyze this product image and provide: product name, key features, specifications, and target audience.',
        isLoading: false,
        error: null,
        output: null,
      },
    },
    // Text Node: Product name & specs
    {
      id: 'text-1',
      type: 'text',
      position: { x: 700, y: 100 },
      data: {
        label: 'Text Node',
        content: '',
      },
    },
    // LLM Node: Write Amazon listing
    {
      id: 'llm-2',
      type: 'llm',
      position: { x: 100, y: 400 },
      data: {
        label: 'Run Any LLM Node',
        model: 'gemini-pro',
        systemPrompt: 'You are an expert copywriter specializing in Amazon product listings.',
        prompt: 'Write a compelling Amazon product listing based on the product information provided. Include title, bullet points, and description.',
        isLoading: false,
        error: null,
        output: null,
      },
    },
    // LLM Node: Write Instagram caption
    {
      id: 'llm-3',
      type: 'llm',
      position: { x: 400, y: 400 },
      data: {
        label: 'Run Any LLM Node',
        model: 'gemini-pro',
        systemPrompt: 'You are a social media marketing expert.',
        prompt: 'Write an engaging Instagram caption for this product. Make it catchy, include relevant hashtags, and encourage engagement.',
        isLoading: false,
        error: null,
        output: null,
      },
    },
    // LLM Node: Write SEO meta description
    {
      id: 'llm-4',
      type: 'llm',
      position: { x: 700, y: 400 },
      data: {
        label: 'Run Any LLM Node',
        model: 'gemini-pro',
        systemPrompt: 'You are an SEO specialist.',
        prompt: 'Write an SEO-optimized meta description for this product. Keep it under 160 characters and include relevant keywords.',
        isLoading: false,
        error: null,
        output: null,
      },
    },
    // Output Text Nodes
    {
      id: 'text-2',
      type: 'text',
      position: { x: 100, y: 700 },
      data: {
        label: 'Text Node',
        content: '',
      },
    },
    {
      id: 'text-3',
      type: 'text',
      position: { x: 400, y: 700 },
      data: {
        label: 'Text Node',
        content: '',
      },
    },
    {
      id: 'text-4',
      type: 'text',
      position: { x: 700, y: 700 },
      data: {
        label: 'Text Node',
        content: '',
      },
    },
  ]

  const edges: Edge[] = [
    { id: 'e1', source: 'image-1', target: 'llm-1' },
    { id: 'e2', source: 'llm-1', target: 'text-1' },
    { id: 'e3', source: 'text-1', target: 'llm-2' },
    { id: 'e4', source: 'text-1', target: 'llm-3' },
    { id: 'e5', source: 'text-1', target: 'llm-4' },
    { id: 'e6', source: 'llm-2', target: 'text-2' },
    { id: 'e7', source: 'llm-3', target: 'text-3' },
    { id: 'e8', source: 'llm-4', target: 'text-4' },
  ]

  return { nodes, edges }
}

