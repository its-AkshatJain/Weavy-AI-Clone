import { useCallback, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import TextNode from './nodes/TextNode'
import ImageNode from './nodes/ImageNode'
import LLMNode from './nodes/LLMNode'
import './WorkflowCanvas.css'

interface WorkflowCanvasProps {
  sidebarCollapsed: boolean
}

const nodeTypes: NodeTypes = {
  text: TextNode,
  image: ImageNode,
  llm: LLMNode,
}

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

function WorkflowCanvas({ sidebarCollapsed }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // Listen for addNode events from Sidebar
  useEffect(() => {
    const handleAddNode = (event: Event) => {
      const customEvent = event as CustomEvent<{ type: 'text' | 'image' | 'llm'; position?: { x: number; y: number } }>
      const { type, position } = customEvent.detail
      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position: position || { x: Math.random() * 500 + 100, y: Math.random() * 500 + 100 },
        data: { 
          label: type === 'llm' ? 'Run Any LLM Node' : `${type.charAt(0).toUpperCase() + type.slice(1)} Node`
        },
      }
      setNodes((nds) => [...nds, newNode])
    }

    window.addEventListener('addNode', handleAddNode)
    return () => {
      window.removeEventListener('addNode', handleAddNode)
    }
  }, [setNodes])

  return (
    <div className={`workflow-canvas ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="react-flow-container"
      >
        <Background 
          variant="dots" 
          gap={20} 
          size={1}
          color="#2a2a2a"
          className="dot-grid-background"
        />
        <Controls 
          className="react-flow-controls"
          showInteractive={false}
        />
        <MiniMap 
          className="react-flow-minimap"
          nodeColor="#6366f1"
          maskColor="rgba(0, 0, 0, 0.5)"
        />
      </ReactFlow>
    </div>
  )
}

export default WorkflowCanvas

