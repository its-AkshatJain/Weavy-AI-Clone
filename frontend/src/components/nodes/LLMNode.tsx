import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import './Node.css'

interface LLMNodeData {
  label?: string
  prompt?: string
  model?: string
}

function LLMNode({ data, selected }: NodeProps<LLMNodeData>) {
  return (
    <div className={`custom-node llm-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-header">
        <span className="node-icon">🤖</span>
        <span className="node-title">{data.label || 'Run Any LLM Node'}</span>
      </div>
      <div className="node-content">
        <div className="node-field">
          <label className="node-label">Model</label>
          <select className="node-select" defaultValue={data.model || 'gemini-pro'}>
            <option value="gemini-pro">Gemini Pro</option>
            <option value="gemini-pro-vision">Gemini Pro Vision</option>
          </select>
        </div>
        <div className="node-field">
          <label className="node-label">Prompt</label>
          <textarea
            className="node-textarea"
            placeholder="Enter your prompt..."
            defaultValue={data.prompt || ''}
            rows={4}
          />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  )
}

export default memo(LLMNode)




