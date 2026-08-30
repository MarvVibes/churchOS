import { useEffect, useState, useMemo  } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { supabase } from '../lib/supabase';
import { ReactFlow, Controls, Background, type Node, type Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const RevelationMap = () => {
  const navigate = useNavigate();
  const { activeSession } = useAppStore();
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMap = async () => {
      if (!activeSession) return;
      const { data, error } = await supabase
        .from('revelation_maps')
        .select('*')
        .eq('session_id', activeSession.id)
        .single();
        
      if (!error && data) {
        // Transform data to ReactFlow format
        const rawNodes: any[] = Array.isArray(data.nodes) ? data.nodes : [];
        const rawEdges: any[] = Array.isArray(data.edges) ? data.edges : [];

        // Very basic layout algorithm for MVP (Circle layout)
        const radius = 120;
        const centerX = window.innerWidth / 2 - 50;
        const centerY = 200;

        const rfNodes = rawNodes.map((n, i) => {
          let x, y;
          if (n.type === 'main_theme') {
            x = centerX;
            y = centerY;
          } else {
            const angle = (i / (rawNodes.length - 1)) * 2 * Math.PI;
            x = centerX + radius * Math.cos(angle);
            y = centerY + radius * Math.sin(angle);
          }

          let bgColor = 'var(--color-surface)';
          let borderColor = 'var(--color-border)';
          let color = 'var(--color-text-primary)';
          
          if (n.type === 'main_theme') {
            bgColor = 'var(--color-primary)';
            color = 'var(--color-background)';
            borderColor = 'var(--color-primary)';
          } else if (n.type === 'scripture') {
            borderColor = 'var(--color-accent)';
          } else if (n.type === 'personal_insight') {
            borderColor = 'var(--color-warning)';
          }

          return {
            id: n.id,
            position: { x, y },
            data: { label: n.label, fullData: n },
            style: {
              background: bgColor,
              color: color,
              border: `2px solid ${borderColor}`,
              borderRadius: '8px',
              padding: '10px 15px',
              fontWeight: 500,
              boxShadow: 'var(--shadow-sm)'
            }
          };
        });

        const rfEdges = rawEdges.map((e, i) => ({
          id: `e-${i}`,
          source: e.source,
          target: e.target,
          animated: true,
          style: { stroke: 'var(--color-border)', strokeWidth: 2 }
        }));

        setNodes(rfNodes);
        setEdges(rfEdges);
      }
      setIsLoading(false);
    };

    fetchMap();
  }, [activeSession]);

  const onNodeClick = (_: any, node: Node) => {
    setSelectedNode(node.data.fullData);
  };

  if (isLoading) return <div className="flex justify-center items-center h-full">Loading map...</div>;

  return (
    <div className="flex-col h-full" style={{ paddingBottom: '0', position: 'relative' }}>
      <header className="mb-2 mt-4" style={{ padding: '0 24px' }}>
        <h1 className="mb-2" style={{ fontSize: '1.5rem' }}>Revelation Map</h1>
        <p style={{ fontSize: '0.9rem' }}>Tap a node to explore connections.</p>
      </header>

      <div style={{ flex: 1, width: '100%', position: 'relative' }}>
        <ReactFlow 
          nodes={nodes} 
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
          attributionPosition="bottom-right"
        >
          <Background color="#ccc" gap={16} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {/* Bottom Sheet for Node Details */}
      {selectedNode && (
        <div 
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--color-surface)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
            padding: '24px',
            boxShadow: '0 -4px 24px rgba(0,0,0,0.1)',
            zIndex: 10,
            animation: 'slideUp 0.3s ease'
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <div style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
              {selectedNode.type.replace('_', ' ')}
            </div>
            <button className="btn-ghost" style={{ padding: '4px' }} onClick={() => setSelectedNode(null)}>
              ✕
            </button>
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{selectedNode.label}</h2>
          <p>
            {selectedNode.description || (
              selectedNode.type === 'main_theme' ? 'The core message of today.' : 
              selectedNode.type === 'scripture' ? 'The foundational text.' : 
              'A key concept explored in the sermon.'
            )}
          </p>
        </div>
      )}

      {!selectedNode && (
        <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px', zIndex: 5 }}>
          <button 
            className="btn btn-primary w-full shadow-lg"
            onClick={() => navigate('/connection')}
          >
            CONTINUE
          </button>
        </div>
      )}
    </div>
  );
};

export default RevelationMap;
