'use client'

import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import TextNode from './nodes/TextNode'
import ImageNode from './nodes/ImageNode'
import LLMNode from './nodes/LLMNode'
import { useWorkflowStore } from '@/stores/workflow-store'
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts'

interface WorkflowCanvasProps {
  sidebarCollapsed: boolean
}

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
  } = useWorkflowStore()

  // Handle keyboard shortcuts
  useKeyboardShortcuts()

  return (
    <div
      className={`flex-1 h-screen relative bg-weavy-bg-primary transition-all duration-300 ${
        sidebarCollapsed ? '' : ''
      }`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
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
      >
        <Background
          variant="dots"
          gap={20}
          size={1}
          color="#2a2a2a"
          className="opacity-30"
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

