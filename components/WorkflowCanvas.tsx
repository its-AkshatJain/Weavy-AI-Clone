'use client'

import { useEffect } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Connection,
  NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import TextNode from './nodes/TextNode'
import ImageNode from './nodes/ImageNode'
import LLMNode from './nodes/LLMNode'
import { useWorkflowStore } from '@/lib/store'

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
    deleteNode,
    deleteEdge,
  } = useWorkflowStore()

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Delete or Backspace to remove selected nodes/edges
      if ((event.key === 'Delete' || event.key === 'Backspace') && !event.metaKey && !event.ctrlKey) {
        const selectedNodes = nodes.filter((node) => node.selected)
        const selectedEdges = edges.filter((edge) => edge.selected)

        selectedNodes.forEach((node) => deleteNode(node.id))
        selectedEdges.forEach((edge) => deleteEdge(edge.id))
      }

      // Undo/Redo with Cmd/Ctrl + Z/Y
      if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        useWorkflowStore.getState().undo()
      }

      if ((event.metaKey || event.ctrlKey) && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault()
        useWorkflowStore.getState().redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, edges, deleteNode, deleteEdge])

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

