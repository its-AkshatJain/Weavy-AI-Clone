import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import './Node.css'

interface TextNodeData {
  label?: string
  content?: string
}

function TextNode({ data, selected }: NodeProps<TextNodeData>) {
  return (
    <div className={`custom-node text-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-header">
        <span className="node-icon">T</span>
        <span className="node-title">{data.label || 'Text Node'}</span>
      </div>
      <div className="node-content">
        <textarea
          className="node-textarea"
          placeholder="Enter text..."
          defaultValue={data.content || ''}
          rows={3}
        />
      </div>
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  )
}

export default memo(TextNode)




