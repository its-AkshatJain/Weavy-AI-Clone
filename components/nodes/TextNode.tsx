'use client'

import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Type } from 'lucide-react'
import { useWorkflowStore } from '@/lib/store'

interface TextNodeData {
  label?: string
  content?: string
}

function TextNode({ data, selected, id }: NodeProps<TextNodeData>) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { content: e.target.value })
  }

  return (
    <div
      className={`bg-weavy-bg-secondary border rounded-lg min-w-[200px] shadow-lg transition-all duration-200 ${
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
        <div className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-weavy-accent to-purple-600 rounded text-white font-bold text-xs">
          <Type className="w-3 h-3" />
        </div>
        <span className="text-sm font-medium text-weavy-text-primary">
          {data.label || 'Text Node'}
        </span>
      </div>
      <div className="p-3">
        <textarea
          className="w-full p-2 bg-weavy-bg-primary border border-weavy-border rounded text-weavy-text-primary text-xs font-sans resize-y min-h-[60px] transition-colors duration-200 focus:outline-none focus:border-weavy-accent"
          placeholder="Enter text..."
          value={data.content || ''}
          onChange={handleContentChange}
          rows={3}
        />
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 bg-weavy-accent border-2 border-weavy-bg-secondary rounded-full hover:bg-weavy-accent-hover hover:scale-110 transition-all"
      />
    </div>
  )
}

export default memo(TextNode)

