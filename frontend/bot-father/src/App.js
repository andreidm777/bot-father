import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ControlButton,
} from 'reactflow';
 
import 'reactflow/dist/style.css';
 
import  NodeStep from './components/nodestep';

import Settings from './components/settings'
 
const nodeTypes = {
  counterNode: NodeStep,
};

const initialNodes = [
  { type: 'counterNode', id: '1', position: { x: 10, y: 500 }, data: { label: '1' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
 
  const addNode = () => {
    initialNodes.push({ id: '3', position: { x: 110, y: 110 }, data: { label: '3' } });
    setNodes(initialNodes);
  }

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
 
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Settings />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onConnect={onConnect}
      >
        <Controls />
        {/* <ControlButton onClick={() => addNode()}>
          добавить
        </ControlButton>
        </Controls> */}
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}