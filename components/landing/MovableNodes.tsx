'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface NodePosition {
  x: number
  y: number
  isDragging: boolean
}

interface MovableNodesProps {
  isVisible: boolean
}

export default function MovableNodes({ isVisible }: MovableNodesProps) {
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([
    { x: 0, y: 0, isDragging: false },
    { x: 0, y: 0, isDragging: false },
    { x: 0, y: 0, isDragging: false },
    { x: 0, y: 0, isDragging: false },
    { x: 0, y: 0, isDragging: false },
    { x: 0, y: 0, isDragging: false },
  ])
  const [dragState, setDragState] = useState<{ index: number; offsetX: number; offsetY: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Nodes in order: 3D card, color reference, STABLE DIFFUSION, text, bird, screenshot
  const nodes = [
    { 
      type: 'IMAGE',
      image: '/images/landing/681cd65ba87c69df161752e5_3d_card.avif',
      width: 200,
      height: 200
    },
    { 
      type: 'IMAGE',
      image: '/images/landing/681cd77722078ff43fe428f3_hcard-color reference.avif',
      width: 300,
      height: 200
    },
    { 
      type: 'IMAGE',
      image: '/images/landing/681cd7cbc22419b32bb9d8d8_hcard - STABLE DIFFUSION.avif',
      width: 350, // Double size - single node
      height: 500 // Bigger in height
    },
    { 
      type: 'TEXT',
      image: null,
      text: 'a Great-Tailed Grackle bird is flying from the background and seating on the model\'s shoulder slowly and barely moves. the model looks at the camera. then bird flies away. cinematic.',
      width: 200,
      height: 200
    },
    { 
      type: 'IMAGE',
      image: '/images/landing/6837510acbe777269734b387_bird_desktop.avif',
      width: 200,
      height: 300
    },
    { 
      type: 'IMAGE',
      image: '/images/landing/Screenshot from 2025-12-21 19-31-50.png',
      width: 350, // Standard width
      height: 500 // Double height - single node vertically
    },
  ]

  useEffect(() => {
    // Initialize node positions - arranged left to right with vertical spacing
    if (containerRef.current) {
      const container = containerRef.current
      const containerWidth = container.offsetWidth
      const containerHeight = container.offsetHeight
      const standardNodeSize = 200
      const largeNodeSize = 400 // Double size for single nodes
      const verticalSpacing = 60 // Space between nodes on same line
      
      // Calculate positions from left to right:
      // 1. 3D card (left, top) - 200px
      // 2. Color reference (left, below 3D with spacing) - 200px
      // 3. STABLE DIFFUSION (center-left, taller and bigger) - 400px width, 300px height
      // 4. Text node (center-right, top) - 200px
      // 5. Bird desktop (center-right, below text with spacing) - 200px
      // 6. Screenshot (right, bigger) - 400px
      setNodePositions([
        // Node 4: 3D card (left, top)
        { x: containerWidth * 0.05, y: containerHeight * 0.15, isDragging: false },
        // Color reference (left, below 3D with vertical spacing)
        { x: containerWidth * 0.01, y: containerHeight * 0.15 + standardNodeSize + verticalSpacing, isDragging: false },
        // Node 1: STABLE DIFFUSION (center-left, double height - 400px height)
        { x: containerWidth * 0.3, y: containerHeight * 0.25, isDragging: false },
        // Text node (center-right, top)
        { x: containerWidth * 0.6, y: containerHeight * 0.2, isDragging: false },
        // Bird desktop (center-right, below text with vertical spacing)
        { x: containerWidth * 0.6, y: containerHeight * 0.2 + standardNodeSize + verticalSpacing, isDragging: false },
        // Screenshot (right, double height - 400px height)
        { x: containerWidth * 0.8, y: containerHeight * 0.25, isDragging: false },
      ])
    }
  }, [])

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!containerRef.current) return
    const container = containerRef.current.getBoundingClientRect()
    const node = nodePositions[index]
    setDragState({
      index,
      offsetX: e.clientX - container.left - node.x,
      offsetY: e.clientY - container.top - node.y,
    })
    setNodePositions((prev) =>
      prev.map((pos, i) => (i === index ? { ...pos, isDragging: true } : pos))
    )
  }

  useEffect(() => {
    if (!dragState || !containerRef.current) return

    let animationFrameId: number | null = null
    let lastUpdateTime = 0
    const throttleMs = 0 // No throttling - update every frame for smooth movement

    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault()
      
      const now = performance.now()
      if (now - lastUpdateTime < throttleMs) return
      lastUpdateTime = now

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }

      animationFrameId = requestAnimationFrame(() => {
        const container = containerRef.current!
        const containerRect = container.getBoundingClientRect()
        setNodePositions((prev) =>
          prev.map((pos, i) => {
            const nodeWidth = nodes[i]?.width || 200
            const nodeHeight = nodes[i]?.height || 200
            return i === dragState.index
              ? {
                  ...pos,
                  x: Math.max(0, Math.min(e.clientX - containerRect.left - dragState.offsetX, container.offsetWidth - nodeWidth)),
                  y: Math.max(0, Math.min(e.clientY - containerRect.top - dragState.offsetY, container.offsetHeight - nodeHeight)),
                }
              : pos
          })
        )
      })
    }

    const handleMouseUp = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      setDragState(null)
      setNodePositions((prev) => prev.map((pos) => ({ ...pos, isDragging: false })))
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: false })
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragState])

  // Connection order: 3D -> Color ref -> STABLE DIFFUSION -> Text -> Bird -> Screenshot
  const connectionOrder = [0, 1, 2, 3, 4, 5]

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-7xl mx-auto h-[700px] mb-20 px-8"
    >
      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {connectionOrder.map((nodeIndex, i) => {
          if (i === connectionOrder.length - 1) return null
          const currentIndex = connectionOrder[i]
          const nextIndex = connectionOrder[i + 1]
          const pos = nodePositions[currentIndex]
          const nextPos = nodePositions[nextIndex]
          const nodeWidth = nodes[currentIndex].width || 200
          const nodeHeight = nodes[currentIndex].height || 200
          const nextNodeWidth = nodes[nextIndex].width || 200
          const nextNodeHeight = nodes[nextIndex].height || 200
          
          // Check if any node in this connection is being dragged
          const isDragging = pos.isDragging || nextPos.isDragging
          
          // Calculate connection points at the center-right of current node and center-left of next node
          const startX = pos.x + nodeWidth
          const startY = pos.y + nodeHeight / 2
          const endX = nextPos.x
          const endY = nextPos.y + nextNodeHeight / 2
          
          return (
            <line
              key={i}
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#d1d5db"
              strokeWidth="2"
              style={{
                transition: isDragging ? 'none' : 'all 0.15s ease-out',
              }}
            />
          )
        })}
        {/* Connection dots at each node's connecting points */}
        {connectionOrder.map((nodeIndex, i) => {
          const pos = nodePositions[nodeIndex]
          const nodeWidth = nodes[nodeIndex].width || 200
          const nodeHeight = nodes[nodeIndex].height || 200
          
          return (
            <g key={`dots-${i}`}>
              {/* Dot on right side (output) - except for last node */}
              {i < connectionOrder.length - 1 && (
                <circle
                  cx={pos.x + nodeWidth}
                  cy={pos.y + nodeHeight / 2}
                  r="5"
                  fill="#9ca3af"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  style={{
                    transition: pos.isDragging ? 'none' : 'all 0.15s ease-out',
                  }}
                />
              )}
              {/* Dot on left side (input) - except for first node */}
              {i > 0 && (
                <circle
                  cx={pos.x}
                  cy={pos.y + nodeHeight / 2}
                  r="5"
                  fill="#9ca3af"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  style={{
                    transition: pos.isDragging ? 'none' : 'all 0.15s ease-out',
                  }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {/* Movable Nodes - No headers, no borders, just images with 8px border radius */}
      {nodes.map((node, index) => (
        <div
          key={index}
          className={`absolute rounded-lg shadow-xl cursor-move select-none overflow-hidden ${
            nodePositions[index].isDragging ? 'scale-105 shadow-2xl z-50' : 'z-10'
          }`}
          style={{
            left: `${nodePositions[index].x}px`,
            top: `${nodePositions[index].y}px`,
            width: `${node.width}px`,
            height: `${node.height}px`,
            borderRadius: '8px',
            transform: nodePositions[index].isDragging 
              ? 'scale(1.05) translateZ(0)' 
              : 'scale(1) translateZ(0)',
            transition: nodePositions[index].isDragging 
              ? 'transform 0.1s ease-out, box-shadow 0.1s ease-out' 
              : 'left 0.15s ease-out, top 0.15s ease-out, transform 0.15s ease-out, box-shadow 0.15s ease-out',
            willChange: nodePositions[index].isDragging ? 'transform, left, top' : 'auto',
          }}
          onMouseDown={(e) => handleMouseDown(index, e)}
        >
          {node.type === 'TEXT' ? (
            <div className="w-full h-full bg-white p-4 flex items-center justify-center" style={{ borderRadius: '8px' }}>
              <p className="text-xs text-gray-600 leading-relaxed text-center">
                {node.text}
              </p>
            </div>
          ) : node.image ? (
            <div className="relative w-full h-full">
              <Image
                src={node.image}
                alt={node.type}
                fill
                className="object-cover"
                style={{ borderRadius: '8px' }}
                sizes={`${node.width}px`}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}
