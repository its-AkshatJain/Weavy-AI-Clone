import { useState } from 'react'
import './Sidebar.css'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  onAddNode?: (type: 'text' | 'image' | 'llm') => void
}

const Sidebar = ({ collapsed, onToggle, onAddNode }: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleNodeClick = (type: 'text' | 'image' | 'llm') => {
    // Dispatch custom event for WorkflowCanvas to listen
    const event = new CustomEvent('addNode', {
      detail: { type, position: { x: Math.random() * 500 + 100, y: Math.random() * 500 + 100 } }
    })
    window.dispatchEvent(event)
    onAddNode?.(type)
  }

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && <h2 className="sidebar-title">Weavy</h2>}
        <button className="sidebar-toggle" onClick={onToggle}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {!collapsed && (
        <>
          <div className="sidebar-search">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sidebar-section">
            <h3 className="section-title">Quick Access</h3>
            <div className="node-buttons">
              <button
                className="node-button"
                onClick={() => handleNodeClick('text')}
                title="Text Node"
              >
                <span className="node-icon">T</span>
                <span className="node-label">Text Node</span>
              </button>
              <button
                className="node-button"
                onClick={() => handleNodeClick('image')}
                title="Image Node"
              >
                <span className="node-icon">🖼️</span>
                <span className="node-label">Image Node</span>
              </button>
              <button
                className="node-button"
                onClick={() => handleNodeClick('llm')}
                title="Run Any LLM Node"
              >
                <span className="node-icon">🤖</span>
                <span className="node-label">Run Any LLM Node</span>
              </button>
            </div>
          </div>
        </>
      )}

      {collapsed && (
        <div className="sidebar-collapsed-buttons">
          <button
            className="node-button-collapsed"
            onClick={() => handleNodeClick('text')}
            title="Text Node"
          >
            <span className="node-icon">T</span>
          </button>
          <button
            className="node-button-collapsed"
            onClick={() => handleNodeClick('image')}
            title="Image Node"
          >
            <span className="node-icon">🖼️</span>
          </button>
          <button
            className="node-button-collapsed"
            onClick={() => handleNodeClick('llm')}
            title="Run Any LLM Node"
          >
            <span className="node-icon">🤖</span>
          </button>
        </div>
      )}
    </div>
  )
}

export default Sidebar

