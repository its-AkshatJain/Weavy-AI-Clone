import { useEffect } from 'react'
import { useWorkflowStore } from '@/stores/workflow-store'

/**
 * Custom hook for handling keyboard shortcuts
 */
export function useKeyboardShortcuts() {
  const { nodes, edges, deleteNode, deleteEdge, undo, redo } = useWorkflowStore()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Delete or Backspace to remove selected nodes/edges
      if (
        (event.key === 'Delete' || event.key === 'Backspace') &&
        !event.metaKey &&
        !event.ctrlKey
      ) {
        const selectedNodes = nodes.filter((node) => node.selected)
        const selectedEdges = edges.filter((edge) => edge.selected)

        selectedNodes.forEach((node) => deleteNode(node.id))
        selectedEdges.forEach((edge) => deleteEdge(edge.id))
      }

      // Undo/Redo with Cmd/Ctrl + Z/Y
      if ((event.metaKey || event.ctrlKey) && event.key === 'z' && !event.shiftKey) {
        event.preventDefault()
        undo()
      }

      if (
        (event.metaKey || event.ctrlKey) &&
        (event.key === 'y' || (event.key === 'z' && event.shiftKey))
      ) {
        event.preventDefault()
        redo()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nodes, edges, deleteNode, deleteEdge, undo, redo])
}

