import { Node, Edge } from 'reactflow'
import type { WorkflowExport } from '@/types'

/**
 * Creates the pre-built Product Listing Generator workflow
 */
export function createProductListingWorkflow(): WorkflowExport {
  const nodes: Node[] = [
    // Image Node: Product Photo
    {
      id: 'image-1',
      type: 'image',
      position: { x: 100, y: 100 },
      data: {
        label: 'Image Node',
        imageUrl: '',
      },
    },
    // LLM Node: Analyze product
    {
      id: 'llm-1',
      type: 'llm',
      position: { x: 400, y: 100 },
      data: {
        label: 'Run Any LLM Node',
        model: 'gemini-2.5-flash-lite',
        systemPrompt: 'You are a product analysis expert. Analyze the product image and provide detailed information.',
        prompt: 'Analyze this product image and provide: product name, key features, specifications, and target audience.',
        isLoading: false,
        error: null,
        output: null,
      },
    },
    // Text Node: Product name & specs
    {
      id: 'text-1',
      type: 'text',
      position: { x: 700, y: 100 },
      data: {
        label: 'Text Node',
        content: '',
      },
    },
    // LLM Node: Write Amazon listing
    {
      id: 'llm-2',
      type: 'llm',
      position: { x: 100, y: 400 },
      data: {
        label: 'Run Any LLM Node',
        model: 'gemini-2.5-flash-lite',
        systemPrompt: 'You are an expert copywriter specializing in Amazon product listings.',
        prompt: 'Write a compelling Amazon product listing based on the product information provided. Include title, bullet points, and description.',
        isLoading: false,
        error: null,
        output: null,
      },
    },
    // LLM Node: Write Instagram caption
    {
      id: 'llm-3',
      type: 'llm',
      position: { x: 400, y: 400 },
      data: {
        label: 'Run Any LLM Node',
        model: 'gemini-2.5-flash-lite',
        systemPrompt: 'You are a social media marketing expert.',
        prompt: 'Write an engaging Instagram caption for this product. Make it catchy, include relevant hashtags, and encourage engagement.',
        isLoading: false,
        error: null,
        output: null,
      },
    },
    // LLM Node: Write SEO meta description
    {
      id: 'llm-4',
      type: 'llm',
      position: { x: 700, y: 400 },
      data: {
        label: 'Run Any LLM Node',
        model: 'gemini-2.5-flash-lite',
        systemPrompt: 'You are an SEO specialist.',
        prompt: 'Write an SEO-optimized meta description for this product. Keep it under 160 characters and include relevant keywords.',
        isLoading: false,
        error: null,
        output: null,
      },
    },
    // Output Text Nodes
    {
      id: 'text-2',
      type: 'text',
      position: { x: 100, y: 700 },
      data: {
        label: 'Text Node',
        content: '',
      },
    },
    {
      id: 'text-3',
      type: 'text',
      position: { x: 400, y: 700 },
      data: {
        label: 'Text Node',
        content: '',
      },
    },
    {
      id: 'text-4',
      type: 'text',
      position: { x: 700, y: 700 },
      data: {
        label: 'Text Node',
        content: '',
      },
    },
  ]

  const edges: Edge[] = [
    { id: 'e1', source: 'image-1', target: 'llm-1' },
    { id: 'e2', source: 'llm-1', target: 'text-1' },
    { id: 'e3', source: 'text-1', target: 'llm-2' },
    { id: 'e4', source: 'text-1', target: 'llm-3' },
    { id: 'e5', source: 'text-1', target: 'llm-4' },
    { id: 'e6', source: 'llm-2', target: 'text-2' },
    { id: 'e7', source: 'llm-3', target: 'text-3' },
    { id: 'e8', source: 'llm-4', target: 'text-4' },
  ]

  return { nodes, edges }
}

/**
 * Exports workflow to JSON file
 */
export function exportWorkflowToFile(workflow: WorkflowExport, filename = 'weavy-workflow.json'): void {
  const dataStr = JSON.stringify(workflow, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Imports workflow from JSON file
 */
export function importWorkflowFromFile(
  file: File
): Promise<WorkflowExport> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const workflow = JSON.parse(event.target?.result as string)
        resolve(workflow)
      } catch (error) {
        reject(new Error('Failed to parse workflow file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

