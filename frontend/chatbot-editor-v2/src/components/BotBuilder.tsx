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
//import '@antd/dist/antd.css';
import { store } from "../stores/store";
import { StepNode } from "./StepNode";
import "reactflow/dist/style.css";
import '@ant-design/v5-patch-for-react-19';
import { Button, Alert, Space, notification, Popconfirm } from "antd";
import { SaveOutlined, SyncOutlined, DeleteOutlined } from "@ant-design/icons";
import { BotSettingsModal } from "./BotSettingsModal";
import { useNavigate } from "react-router-dom";
import { productStore } from "../stores/productStore";
import { useEffect } from "react";
import { reaction } from "mobx";

const nodeTypes: NodeTypes = {
  step: StepNode,
};

const BotBuilder = observer(() => {
  const navigate = useNavigate();

  useEffect(() => {
    // If authentication is needed, redirect to login page
    const disposer = reaction(
      () => productStore.needsAuthentication,
      (needsAuth) => {
        if (needsAuth) {
          navigate('/login');
        }
      }
    );
    
    return disposer;
  }, [navigate]);

  notification.config({
    placement: 'topRight',
    duration: 3,
  });

  const onNodesChange: OnNodesChange = (changes: NodeChange[]) => {
    // Упрощенная обработка изменений без использования item
    store.nodes = applyNodeChanges(changes, toJS(store.nodes));
  };

  const onEdgesChange: OnEdgesChange = (changes: EdgeChange[]) => {
    store.edges = applyEdgeChanges(changes, toJS(store.edges));
  };

  // If authentication is needed, don't render the bot builder
  if (productStore.needsAuthentication) {
    return null;
  }

  return (
    <div style={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Панель управления */}
      <div style={{ padding: "10px", background: "#f0f0f0", display: "flex", gap: "10px" }}>
        <Space>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={() => store.saveToServer()}
            loading={store.isLoading}
          >
            Сохранить схему
          </Button>
          <Button
            icon={<SyncOutlined />}
            onClick={() => store.loadFromServer()}
            loading={store.isLoading}
          >
            Загрузить схему
          </Button>
          <Button onClick={() => store.openSettingsModal()}>
            {store.currentBot ? 'Редактировать бота' : 'Создать бота'}
          </Button>

          {store.currentBot && (
            <Popconfirm
              title="Удалить этого бота?"
              onConfirm={() => store.deleteBot()}
              okText="Да"
              cancelText="Нет"
            >
              <Button danger icon={<DeleteOutlined />}>
                Удалить бота
              </Button>
            </Popconfirm>
          )}
        </Space>

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
      <BotSettingsModal />
    </div>
  );
});

export default BotBuilder;