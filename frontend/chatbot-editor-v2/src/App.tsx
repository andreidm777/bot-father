import { observer } from "mobx-react-lite";
import { toJS } from "mobx";
import ReactFlow, {
  Background,
  Controls,
  NodeTypes,
  ConnectionMode,
  OnNodesChange,
  applyNodeChanges,
  OnEdgesChange,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
  MarkerType
} from "reactflow";
import { store } from "./stores/store";
import { StepNode } from "./components/StepNode";
import "reactflow/dist/style.css";
import '@ant-design/v5-patch-for-react-19';
import { Button, Alert } from "antd";
import { SaveOutlined, SyncOutlined } from "@ant-design/icons";

const nodeTypes: NodeTypes = {
  step: StepNode,
};

const BotBuilder = observer(() => {
  const onNodesChange: OnNodesChange = (changes: NodeChange[]) => {
    // Упрощенная обработка изменений без использования item
    store.nodes = applyNodeChanges(changes, toJS(store.nodes));
  };

  const onEdgesChange: OnEdgesChange = (changes: EdgeChange[]) => {
    store.edges = applyEdgeChanges(changes, toJS(store.edges));
  };

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Панель управления */}
      <div style={{ padding: "10px", background: "#f0f0f0", display: "flex", gap: "10px" }}>
        <Button 
          type="primary" 
          icon={<SaveOutlined />}
          onClick={() => store.saveToServer()}
          loading={store.isLoading}
        >
          Сохранить
        </Button>
        <Button 
          icon={<SyncOutlined />}
          onClick={() => store.loadFromServer()}
          loading={store.isLoading}
        >
          Загрузить
        </Button>
        {store.error && (
          <Alert message={store.error} type="error" showIcon style={{ marginLeft: "auto" }} />
        )}
      </div>
      <div style={{ flex: 1 }}>
      <ReactFlow
        nodes={toJS(store.nodes)} // Явное преобразование в plain JS
        edges={toJS(store.edges)} // Явное преобразование в plain JS
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: '#555', strokeWidth: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#555' },
        }}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      </div>
    </div>
  );
});

export default BotBuilder;