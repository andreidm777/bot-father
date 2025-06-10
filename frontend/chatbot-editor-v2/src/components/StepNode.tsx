import { observer } from "mobx-react-lite";
import { useState, useRef, useEffect } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { store } from "../stores/store";
import { FiMoreVertical } from "react-icons/fi";

interface StepNodeData {
  label: string;
}

export const StepNode = observer(({ id, data, xPos, yPos }: NodeProps<StepNodeData>) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
        {/* Добавляем хэндлы для соединений */}
      <Handle 
        type="source" 
        position={Position.Right} 
        id={`${id}-source`} 
      />
      <Handle 
        type="target" 
        position={Position.Left} 
        id={`${id}-target`} 
      />

      <div className="node-header">
        <div className="node-label">{data.label}</div>
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

      {menuOpen && (
        <div ref={menuRef} className="context-menu">
          <button onClick={handleAddStep}>Добавить шаг</button>
        </div>
      )}
    </div>
  );
});