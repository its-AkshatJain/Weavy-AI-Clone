import { memo } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import './Node.css'

interface ImageNodeData {
  label?: string
  imageUrl?: string
}

function ImageNode({ data, selected }: NodeProps<ImageNodeData>) {
  return (
    <div className={`custom-node image-node ${selected ? 'selected' : ''}`}>
      <Handle type="target" position={Position.Top} className="node-handle" />
      <div className="node-header">
        <span className="node-icon">🖼️</span>
        <span className="node-title">{data.label || 'Image Node'}</span>
      </div>
      <div className="node-content">
        <div className="image-preview">
          {data.imageUrl ? (
            <img src={data.imageUrl} alt="Preview" className="preview-image" />
          ) : (
            <div className="image-placeholder">
              <span>No image</span>
            </div>
          )}
        </div>
        <input
          type="text"
          className="node-input"
          placeholder="Image URL or path..."
          defaultValue={data.imageUrl || ''}
        />
      </div>
      <Handle type="source" position={Position.Bottom} className="node-handle" />
    </div>
  )
}

export default memo(ImageNode)

