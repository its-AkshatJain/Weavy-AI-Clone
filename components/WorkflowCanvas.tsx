'use client'

import { useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  BackgroundVariant,
  ReactFlowInstance,
} from 'reactflow'
import 'reactflow/dist/style.css'
import TextNode from './nodes/TextNode'
import ImageNode from './nodes/ImageNode'
import LLMNode from './nodes/LLMNode'
import { useWorkflowStore } from '@/stores/workflow-store'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'
import { Node } from 'reactflow'

interface WorkflowCanvasProps {
  sidebarCollapsed: boolean
}

// Define nodeTypes outside component to avoid React Flow warning
const nodeTypes: NodeTypes = {
  text: TextNode,
  image: ImageNode,
  llm: LLMNode,
}

export default function WorkflowCanvas({ sidebarCollapsed }: WorkflowCanvasProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
  } = useWorkflowStore()

  // Handle keyboard shortcuts
  useKeyboardShortcuts()

  // Handle drag and drop from sidebar
  const onInit = useCallback((reactFlowInstance: ReactFlowInstance) => {
    // Store instance for drag & drop
    ;(window as any).reactFlowInstance = reactFlowInstance
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow')
      if (!type || !['text', 'image', 'llm'].includes(type)) {
        return
      }

      const reactFlowBounds = (event.target as HTMLElement).getBoundingClientRect()
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }

      const nodeId = `${type}-${Date.now()}`
      const baseNode: Node = {
        id: nodeId,
        type: type as 'text' | 'image' | 'llm',
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
    },
    [addNode]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  return (
    <div
      className={`flex-1 h-screen relative bg-[#0f0f0f] transition-all duration-300 ${
        sidebarCollapsed ? '' : ''
      }`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        className="react-flow-container"
        defaultEdgeOptions={{
          style: { stroke: '#6366f1', strokeWidth: 2 },
          animated: true,
        }}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2 }}
        snapToGrid={true}
        snapGrid={[20, 20]}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        selectNodesOnDrag={false}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="#6366f1"
          className="opacity-40"
        />
        <Controls
          className="react-flow-controls"
          showInteractive={false}
        />
        <MiniMap
          className="react-flow-minimap"
          nodeColor="#6366f1"
          maskColor="rgba(0, 0, 0, 0.5)"
          position="bottom-right"
        />
      </ReactFlow>
    </div>
  )
}

