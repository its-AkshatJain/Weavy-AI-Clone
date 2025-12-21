'use client'

import { memo, useState } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Brain, Loader2, AlertCircle, Play } from 'lucide-react'
import { useWorkflowStore } from '@/stores/workflow-store'
import type { LLMNodeData } from '@/types'

function LLMNode({ data, selected, id }: NodeProps<LLMNodeData>) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const { nodes, edges } = useWorkflowStore((state) => ({ nodes: state.nodes, edges: state.edges }))
  const [localPrompt, setLocalPrompt] = useState(data.prompt || '')
  const [localSystemPrompt, setLocalSystemPrompt] = useState(data.systemPrompt || '')
  const [localModel, setLocalModel] = useState(data.model || 'gemini-2.5-flash-lite')

  const handleRun = async () => {
    updateNodeData(id, { isLoading: true, error: null, output: null })

    try {
      // Get upstream connected nodes
      const incomingEdges = edges.filter((edge) => edge.target === id)
      const upstreamNodes = nodes.filter((node) =>
        incomingEdges.some((edge) => edge.source === node.id)
      )

      // Collect text and image inputs
      const textInputs: string[] = []
      const imageInputs: string[] = []

      upstreamNodes.forEach((node) => {
        if (node.type === 'text' && node.data.content) {
          textInputs.push(node.data.content)
        }
        if (node.type === 'image' && node.data.imageUrl) {
          imageInputs.push(node.data.imageUrl)
        }
      })

      // Combine inputs with prompt
      const combinedPrompt = [
        ...textInputs,
        localPrompt,
      ]
        .filter(Boolean)
        .join('\n\n')

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: localModel,
          prompt: combinedPrompt,
          systemPrompt: localSystemPrompt || undefined,
          images: imageInputs.length > 0 ? imageInputs : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to run LLM')
      }

      const result = await response.json()
      updateNodeData(id, {
        isLoading: false,
        output: result.text,
        prompt: localPrompt,
        systemPrompt: localSystemPrompt,
        model: localModel,
      })
    } catch (error) {
      updateNodeData(id, {
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      })
    }
  }

  return (
    <div
      className={`bg-weavy-bg-secondary border rounded-lg min-w-[280px] max-w-[400px] shadow-lg transition-all duration-200 ${
        selected
          ? 'border-weavy-accent shadow-[0_0_0_2px_rgba(99,102,241,0.3)]'
          : 'border-weavy-border hover:border-weavy-accent hover:shadow-[0_4px_12px_rgba(99,102,241,0.2)]'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 bg-weavy-accent border-2 border-weavy-bg-secondary rounded-full hover:bg-weavy-accent-hover hover:scale-110 transition-all"
      />
      <div className="flex items-center gap-2 p-3 border-b border-weavy-border bg-weavy-bg-tertiary rounded-t-lg">
        <div className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-green-600 rounded text-white">
          <Brain className="w-3 h-3" />
        </div>
        <span className="text-sm font-medium text-weavy-text-primary flex-1">
          {data.label || 'Run Any LLM Node'}
        </span>
        <button
          onClick={handleRun}
          disabled={data.isLoading}
          className="px-3 py-1.5 bg-weavy-accent hover:bg-weavy-accent-hover disabled:bg-weavy-bg-primary disabled:opacity-50 text-white text-xs font-medium rounded transition-colors duration-200 flex items-center gap-1.5 disabled:cursor-not-allowed"
        >
          {data.isLoading ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3" />
              <span>Run</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3 space-y-3">
        <div className="space-y-1.5">
          <label className="text-xs text-weavy-text-secondary font-medium">Model</label>
          <select
            value={localModel}
            onChange={(e) => setLocalModel(e.target.value)}
            disabled={data.isLoading}
            onKeyDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="w-full p-2 bg-weavy-bg-primary border border-weavy-border rounded text-weavy-text-primary text-xs font-sans transition-colors duration-200 focus:outline-none focus:border-weavy-accent disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash Lite (Free Tier - Recommended)</option>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="gemini-2.5-pro">Gemini 2.5 Pro</option>
            <option value="gemini-3-flash">Gemini 3 Flash Preview</option>
            <option value="gemini-3-pro-preview">Gemini 3 Pro Preview</option>
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Legacy)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Legacy)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-weavy-text-secondary font-medium">System Prompt (Optional)</label>
          <textarea
            value={localSystemPrompt}
            onChange={(e) => setLocalSystemPrompt(e.target.value)}
            disabled={data.isLoading}
            placeholder="Enter system prompt..."
            rows={2}
            onKeyDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="w-full p-2 bg-weavy-bg-primary border border-weavy-border rounded text-weavy-text-primary text-xs font-sans resize-y transition-colors duration-200 focus:outline-none focus:border-weavy-accent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs text-weavy-text-secondary font-medium">Prompt</label>
          <textarea
            value={localPrompt}
            onChange={(e) => setLocalPrompt(e.target.value)}
            disabled={data.isLoading}
            placeholder="Enter your prompt..."
            rows={4}
            onKeyDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="w-full p-2 bg-weavy-bg-primary border border-weavy-border rounded text-weavy-text-primary text-xs font-sans resize-y transition-colors duration-200 focus:outline-none focus:border-weavy-accent disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>

        {data.error && (
          <div 
            className="p-2 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-xs flex items-start gap-2 max-h-32 overflow-y-auto scrollbar-custom"
            onWheel={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span className="break-words">{data.error}</span>
          </div>
        )}

        {data.output && (
          <div 
            className="p-2 bg-weavy-bg-primary border border-weavy-border rounded max-h-64 overflow-y-auto scrollbar-custom"
            onWheel={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-weavy-text-secondary font-medium mb-1">Output:</div>
            <div className="text-xs text-weavy-text-primary whitespace-pre-wrap break-words">{data.output}</div>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-weavy-accent border-2 border-weavy-bg-secondary rounded-full hover:bg-weavy-accent-hover hover:scale-110 transition-all"
      />
    </div>
  )
}

export default memo(LLMNode)

