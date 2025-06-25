import { observer } from "mobx-react-lite";
import { useState, useRef, useEffect } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { store } from "../stores/store";
import { FiMoreVertical, FiSettings, FiTrash2 } from "react-icons/fi";
import { StepSettingsModal } from './StepSettingsModal';

interface StepNodeData {
  label: string;
  type: string;
}

export const StepNode = observer(({ id, data }: NodeProps<StepNodeData>) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // В компоненте StepNode добавим обработчик:
  const handleDeleteStep = () => {
    store.deleteNode(id);
    setMenuOpen(false);
  };

  const handleAddStep = () => {
    store.addNode(id);
    setMenuOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="step-node">
      <Handle type="target" position={Position.Left} id={`${id}-target`} />
      <Handle type="source" position={Position.Right} id={`${id}-source`} />

      <div className="node-header">
        <div className="node-label">{data.label}</div>
        <div className="node-actions">
          <button
            className="menu-button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <FiMoreVertical />
          </button>
        </div>
      </div>

      <div className="node-type-badge">
        {data.type === 'wait_message' && 'Ожидание'}
        {data.type === 'send_message' && 'Отправка'}
        {data.type === 'reaction' && 'Реакция'}
      </div>

      {menuOpen && (
        <div ref={menuRef} className="context-menu">
          <button onClick={handleAddStep}>Добавить шаг</button>
          <button onClick={() => {
            setSettingsOpen(true);
            setMenuOpen(false);
          }}>
            <FiSettings style={{ marginRight: 5 }} />
            Настройки
          </button>
          <button onClick={handleDeleteStep} className="delete-btn">
            <FiTrash2 style={{ marginRight: 5 }} />
            Удалить шаг
          </button>
        </div>
      )}

      <StepSettingsModal
        nodeId={id}
        visible={settingsOpen}
        onCancel={() => setSettingsOpen(false)}
        initialData={data}
      />
    </div>
  );
});