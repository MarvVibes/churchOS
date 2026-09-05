import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ReactFlow, Background, Controls } from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const initialNodes = [
  { id: '1', position: { x: 100, y: 50 }, data: { label: 'Faith as a Verb' }, style: { background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: 8, padding: 10 } },
  { id: '2', position: { x: 20, y: 150 }, data: { label: 'Hebrews 11:1' }, style: { background: 'var(--color-surface-2)', color: 'var(--color-text-1)', borderColor: 'var(--color-border)', borderRadius: 8, padding: 10 } },
  { id: '3', position: { x: 180, y: 150 }, data: { label: 'James 2:17' }, style: { background: 'var(--color-surface-2)', color: 'var(--color-text-1)', borderColor: 'var(--color-border)', borderRadius: 8, padding: 10 } },
  { id: '4', position: { x: 100, y: 250 }, data: { label: 'Action despite doubt' }, style: { background: 'var(--color-accent)', color: '#fff', border: 'none', borderRadius: 8, padding: 10 } },
]

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: 'var(--color-text-3)' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: 'var(--color-text-3)' } },
  { id: 'e3-4', source: '3', target: '4', style: { stroke: 'var(--color-text-3)' } },
]

export default function RevelationMap() {
  const navigate = useNavigate()

  return (
    <div className="flex-col h-full bg-surface" style={{ height: '100vh', width: '100vw', margin: '-var(--space-lg)', position: 'relative' }}>
      
      {/* Header Overlay */}
      <div className="absolute top-0 left-0 w-full p-md z-10 flex items-center gap-md" style={{ background: 'linear-gradient(to bottom, var(--color-bg) 40%, transparent)' }}>
        <button className="btn-icon" onClick={() => navigate(-1)} style={{ background: 'var(--color-surface)', border: 'none' }}>
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-lg">Revelation Map</h2>
      </div>

      <div style={{ width: '100%', height: '100%' }}>
        <ReactFlow 
          nodes={initialNodes} 
          edges={initialEdges}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="var(--color-border-light)" gap={20} />
          <Controls showInteractive={false} style={{ display: 'flex', flexDirection: 'column', gap: 4, fill: 'var(--color-text-2)', button: { backgroundColor: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderBottom: 'none' } }} />
        </ReactFlow>
      </div>

    </div>
  )
}
