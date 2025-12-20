import { Node, Edge } from 'reactflow'

export interface TextNodeData {
  label?: string
  content?: string
}

export interface ImageNodeData {
  label?: string
  imageUrl?: string
  imageFile?: File | null
}

export interface LLMNodeData {
  label?: string
  model?: string
  systemPrompt?: string
  prompt?: string
  isLoading?: boolean
  error?: string | null
  output?: string | null
}

export type NodeData = TextNodeData | ImageNodeData | LLMNodeData

export interface WorkflowExport {
  nodes: Node[]
  edges: Edge[]
}

export interface GeminiApiRequest {
  model: string
  prompt: string
  systemPrompt?: string
  images?: string[]
}

export interface GeminiApiResponse {
  text: string
  error?: string
}

