'use client'

import { memo, useRef } from 'react'
import { Handle, Position, NodeProps } from 'reactflow'
import { Image as ImageIcon, Upload } from 'lucide-react'
import { useWorkflowStore } from '@/stores/workflow-store'
import type { ImageNodeData } from '@/types'

function ImageNode({ data, selected, id }: NodeProps<ImageNodeData>) {
  const updateNodeData = useWorkflowStore((state) => state.updateNodeData)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { imageUrl: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const result = event.target?.result as string
        updateNodeData(id, { imageFile: file, imageUrl: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const imageSrc = data.imageUrl || (data.imageFile ? URL.createObjectURL(data.imageFile) : null)

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
        <div className="w-6 h-6 flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500 rounded text-white">
          <ImageIcon className="w-3 h-3" />
        </div>
        <span className="text-sm font-medium text-weavy-text-primary">
          {data.label || 'Image Node'}
        </span>
      </div>
      <div className="p-3 space-y-3">
        <div className="w-full min-h-[120px] bg-weavy-bg-primary border border-weavy-border rounded overflow-hidden flex items-center justify-center">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Preview"
              className="w-full h-auto max-h-[200px] object-contain"
            />
          ) : (
            <div className="text-weavy-text-secondary text-xs">No image</div>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 p-2 bg-weavy-bg-primary border border-weavy-border rounded text-weavy-text-primary text-xs font-sans transition-colors duration-200 focus:outline-none focus:border-weavy-accent"
            placeholder="Image URL..."
            value={data.imageUrl || ''}
            onChange={handleImageUrlChange}
          />
          <button
            onClick={handleUploadClick}
            className="px-3 py-2 bg-weavy-bg-tertiary border border-weavy-border rounded text-weavy-text-primary hover:bg-weavy-bg-primary hover:border-weavy-accent transition-colors duration-200"
            title="Upload image"
          >
            <Upload className="w-4 h-4" />
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
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

export default memo(ImageNode)



