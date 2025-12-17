import { useState } from 'react'
import Sidebar from './components/Sidebar'
import WorkflowCanvas from './components/WorkflowCanvas'
import './App.css'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="app">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <WorkflowCanvas sidebarCollapsed={sidebarCollapsed} />
    </div>
  )
}

export default App

