import { create } from 'zustand'
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges, NodeChange, EdgeChange } from 'reactflow'

export interface WorkflowState {
  nodes: Node[]
  edges: Edge[]
  history: {
    past: Array<{ nodes: Node[]; edges: Edge[] }>
    future: Array<{ nodes: Node[]; edges: Edge[] }>
  }
}

interface WorkflowStore extends WorkflowState {
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addNode: (node: Node) => void
  deleteNode: (nodeId: string) => void
  deleteEdge: (edgeId: string) => void
  updateNodeData: (nodeId: string, data: Partial<Node['data']>) => void
  saveToHistory: () => void
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  reset: () => void
  loadWorkflow: (nodes: Node[], edges: Edge[]) => void
  exportWorkflow: () => { nodes: Node[]; edges: Edge[] }
  importWorkflow: (workflow: { nodes: Node[]; edges: Edge[] }) => void
}

const initialState: WorkflowState = {
  nodes: [],
  edges: [],
  history: {
    past: [],
    future: [],
  },
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  ...initialState,

  setNodes: (nodes) => {
    set({ nodes })
    get().saveToHistory()
  },

  setEdges: (edges) => {
    set({ edges })
    get().saveToHistory()
  },

  onNodesChange: (changes) => {
    const { nodes } = get()
    const newNodes = applyNodeChanges(changes, nodes)
    set({ nodes: newNodes })
    
    // Save to history only for significant changes
    const significantChanges = changes.filter(
      (change) => change.type === 'remove' || change.type === 'add' || change.type === 'position'
    )
    if (significantChanges.length > 0) {
      get().saveToHistory()
    }
  },

  onEdgesChange: (changes) => {
    const { edges } = get()
    const newEdges = applyEdgeChanges(changes, edges)
    set({ edges: newEdges })
    
    const significantChanges = changes.filter(
      (change) => change.type === 'remove' || change.type === 'add'
    )
    if (significantChanges.length > 0) {
      get().saveToHistory()
    }
  },

  onConnect: (connection) => {
    const { edges } = get()
    const newEdges = addEdge(connection, edges)
    set({ edges: newEdges })
    get().saveToHistory()
  },

  addNode: (node) => {
    const { nodes } = get()
    set({ nodes: [...nodes, node] })
    get().saveToHistory()
  },

  deleteNode: (nodeId) => {
    const { nodes, edges } = get()
    const newNodes = nodes.filter((node) => node.id !== nodeId)
    const newEdges = edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
    set({ nodes: newNodes, edges: newEdges })
    get().saveToHistory()
  },

  deleteEdge: (edgeId) => {
    const { edges } = get()
    const newEdges = edges.filter((edge) => edge.id !== edgeId)
    set({ edges: newEdges })
    get().saveToHistory()
  },

  updateNodeData: (nodeId, data) => {
    const { nodes } = get()
    const newNodes = nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    )
    set({ nodes: newNodes })
  },

  saveToHistory: () => {
    const { nodes, edges, history } = get()
    const newPast = [...history.past, { nodes: [...nodes], edges: [...edges] }]
    // Keep only last 50 states
    const trimmedPast = newPast.slice(-50)
    set({
      history: {
        past: trimmedPast,
        future: [], // Clear future when new action is performed
      },
    })
  },

  undo: () => {
    const { history } = get()
    if (history.past.length === 0) return

    const previous = history.past[history.past.length - 1]
    const newPast = history.past.slice(0, -1)
    const current = { nodes: get().nodes, edges: get().edges }

    set({
      nodes: previous.nodes,
      edges: previous.edges,
      history: {
        past: newPast,
        future: [current, ...history.future],
      },
    })
  },

  redo: () => {
    const { history } = get()
    if (history.future.length === 0) return

    const next = history.future[0]
    const newFuture = history.future.slice(1)
    const current = { nodes: get().nodes, edges: get().edges }

    set({
      nodes: next.nodes,
      edges: next.edges,
      history: {
        past: [...history.past, current],
        future: newFuture,
      },
    })
  },

  canUndo: () => {
    return get().history.past.length > 0
  },

  canRedo: () => {
    return get().history.future.length > 0
  },

  reset: () => {
    set(initialState)
  },

  loadWorkflow: (nodes, edges) => {
    set({ nodes, edges })
    get().saveToHistory()
  },

  exportWorkflow: () => {
    const { nodes, edges } = get()
    return { nodes, edges }
  },

  importWorkflow: (workflow) => {
    set({ nodes: workflow.nodes, edges: workflow.edges })
    get().saveToHistory()
  },
}))

