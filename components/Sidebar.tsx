'use client'

import { useState } from 'react'
import { Search, ChevronLeft, Type, Image as ImageIcon, Brain } from 'lucide-react'
import { useWorkflowStore } from '@/stores/workflow-store'
import { Node } from 'reactflow'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const addNode = useWorkflowStore((state) => state.addNode)

  const handleAddNode = (type: 'text' | 'image' | 'llm') => {
    const nodeId = `${type}-${Date.now()}`
    const position = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 400 + 100,
    }

    const baseNode: Node = {
      id: nodeId,
      type,
      position,
      data: {},
    }

    switch (type) {
      case 'text':
        baseNode.data = {
          label: 'Text Node',
          content: '',
        }
        break
      case 'image':
        baseNode.data = {
          label: 'Image Node',
          imageUrl: '',
        }
        break
      case 'llm':
        baseNode.data = {
          label: 'Run Any LLM Node',
          model: 'gemini-pro',
          systemPrompt: '',
          prompt: '',
          isLoading: false,
          error: null,
          output: null,
        }
        break
    }

    addNode(baseNode)
  }

  return (
    <div
      className={`bg-weavy-bg-secondary border-r border-weavy-border flex flex-col h-screen transition-all duration-300 relative z-10 ${
        collapsed ? 'w-sidebar-collapsed' : 'w-sidebar'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-weavy-border min-h-[60px]">
        {!collapsed && (
          <h2 className="text-2xl font-bold text-weavy-text-primary tracking-tight">
            Weavy
          </h2>
        )}
        <button
          onClick={onToggle}
          className="bg-weavy-bg-tertiary border border-weavy-border text-weavy-text-primary w-8 h-8 rounded-md flex items-center justify-center text-base transition-all duration-200 hover:bg-weavy-bg-primary hover:border-weavy-accent hover:text-weavy-accent"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {!collapsed && (
        <>
          {/* Search */}
          <div className="p-4 border-b border-weavy-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-weavy-text-secondary" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 bg-weavy-bg-primary border border-weavy-border rounded-md text-weavy-text-primary text-sm transition-all duration-200 focus:outline-none focus:border-weavy-accent focus:ring-2 focus:ring-weavy-accent/20 placeholder:text-weavy-text-secondary"
              />
            </div>
          </div>

          {/* Quick Access */}
          <div className="p-4 flex-1 overflow-y-auto scrollbar-custom">
            <h3 className="text-xs font-semibold text-weavy-text-secondary uppercase tracking-wider mb-3">
              Quick Access
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleAddNode('text')}
                className="flex items-center gap-3 p-3 bg-weavy-bg-tertiary border border-weavy-border rounded-lg text-weavy-text-primary cursor-pointer transition-all duration-200 hover:bg-weavy-bg-primary hover:border-weavy-accent hover:translate-x-0.5 text-left w-full group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-weavy-bg-primary rounded-md text-base flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-weavy-accent group-hover:to-purple-600 group-hover:text-white font-bold">
                  <Type className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium flex-1">Text Node</span>
              </button>

              <button
                onClick={() => handleAddNode('image')}
                className="flex items-center gap-3 p-3 bg-weavy-bg-tertiary border border-weavy-border rounded-lg text-weavy-text-primary cursor-pointer transition-all duration-200 hover:bg-weavy-bg-primary hover:border-weavy-accent hover:translate-x-0.5 text-left w-full group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-weavy-bg-primary rounded-md text-base flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-rose-500">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium flex-1">Image Node</span>
              </button>

              <button
                onClick={() => handleAddNode('llm')}
                className="flex items-center gap-3 p-3 bg-weavy-bg-tertiary border border-weavy-border rounded-lg text-weavy-text-primary cursor-pointer transition-all duration-200 hover:bg-weavy-bg-primary hover:border-weavy-accent hover:translate-x-0.5 text-left w-full group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-weavy-bg-primary rounded-md text-base flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-green-600">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium flex-1">Run Any LLM Node</span>
              </button>
            </div>
          </div>
        </>
      )}

      {collapsed && (
        <div className="flex flex-col gap-2 p-4 items-center">
          <button
            onClick={() => handleAddNode('text')}
            className="w-11 h-11 flex items-center justify-center bg-weavy-bg-tertiary border border-weavy-border rounded-lg text-weavy-text-primary cursor-pointer transition-all duration-200 hover:bg-weavy-bg-primary hover:border-weavy-accent hover:scale-105"
            title="Text Node"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAddNode('image')}
            className="w-11 h-11 flex items-center justify-center bg-weavy-bg-tertiary border border-weavy-border rounded-lg text-weavy-text-primary cursor-pointer transition-all duration-200 hover:bg-weavy-bg-primary hover:border-weavy-accent hover:scale-105"
            title="Image Node"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAddNode('llm')}
            className="w-11 h-11 flex items-center justify-center bg-weavy-bg-tertiary border border-weavy-border rounded-lg text-weavy-text-primary cursor-pointer transition-all duration-200 hover:bg-weavy-bg-primary hover:border-weavy-accent hover:scale-105"
            title="Run Any LLM Node"
          >
            <Brain className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

