'use client'

import { useState } from 'react'
import { ChevronLeft, Type, Image as ImageIcon, Brain } from 'lucide-react'
import { useWorkflowStore } from '@/stores/workflow-store'
import { Node } from 'reactflow'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [draggedNodeType, setDraggedNodeType] = useState<'text' | 'image' | 'llm' | null>(null)
  const addNode = useWorkflowStore((state) => state.addNode)

  const handleAddNode = (type: 'text' | 'image' | 'llm', position?: { x: number; y: number }) => {
    const nodeId = `${type}-${Date.now()}`
    const nodePosition = position || {
      x: Math.random() * 400 + 100,
      y: Math.random() * 400 + 100,
    }

    const baseNode: Node = {
      id: nodeId,
      type,
      position: nodePosition,
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
          model: 'gemini-2.5-flash-lite',
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

  const handleDragStart = (e: React.DragEvent, type: 'text' | 'image' | 'llm') => {
    setDraggedNodeType(type)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/reactflow', type)
  }

  const handleDragEnd = () => {
    setDraggedNodeType(null)
  }

  return (
    <div
      className={`bg-weavy-bg-secondary border-r border-weavy-border flex flex-col h-screen transition-all duration-300 relative z-10 ${
        collapsed ? 'w-sidebar-collapsed' : 'w-sidebar'
      } md:relative`}
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
          {/* Quick Access */}
          <div className="p-4 flex-1 overflow-y-auto scrollbar-custom">
            <h3 className="text-xs font-semibold text-weavy-text-secondary uppercase tracking-wider mb-3">
              Quick Access
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleAddNode('text')}
                onDragStart={(e) => handleDragStart(e, 'text')}
                onDragEnd={handleDragEnd}
                draggable
                className="flex items-center gap-3 p-3 bg-weavy-bg-tertiary border border-weavy-border rounded-lg text-weavy-text-primary cursor-pointer transition-all duration-200 hover:bg-weavy-bg-primary hover:border-weavy-accent hover:translate-x-0.5 text-left w-full group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-weavy-bg-primary rounded-md text-base flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-weavy-accent group-hover:to-purple-600 group-hover:text-white font-bold">
                  <Type className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium flex-1">Text Node</span>
                <span className="text-xs text-weavy-text-secondary">Click or drag</span>
              </button>

              <button
                onClick={() => handleAddNode('image')}
                onDragStart={(e) => handleDragStart(e, 'image')}
                onDragEnd={handleDragEnd}
                draggable
                className="flex items-center gap-3 p-3 bg-weavy-bg-tertiary border border-weavy-border rounded-lg text-weavy-text-primary cursor-pointer transition-all duration-200 hover:bg-weavy-bg-primary hover:border-weavy-accent hover:translate-x-0.5 text-left w-full group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-weavy-bg-primary rounded-md text-base flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-pink-500 group-hover:to-rose-500">
                  <ImageIcon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium flex-1">Image Node</span>
                <span className="text-xs text-weavy-text-secondary">Click or drag</span>
              </button>

              <button
                onClick={() => handleAddNode('llm')}
                onDragStart={(e) => handleDragStart(e, 'llm')}
                onDragEnd={handleDragEnd}
                draggable
                className="flex items-center gap-3 p-3 bg-weavy-bg-tertiary border border-weavy-border rounded-lg text-weavy-text-primary cursor-pointer transition-all duration-200 hover:bg-weavy-bg-primary hover:border-weavy-accent hover:translate-x-0.5 text-left w-full group"
              >
                <div className="w-8 h-8 flex items-center justify-center bg-weavy-bg-primary rounded-md text-base flex-shrink-0 group-hover:bg-gradient-to-br group-hover:from-emerald-500 group-hover:to-green-600">
                  <Brain className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium flex-1">Run Any LLM Node</span>
                <span className="text-xs text-weavy-text-secondary">Click or drag</span>
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

