import { makeAutoObservable, toJS } from "mobx";
import { Node, Edge, XYPosition } from "reactflow";
import { saveBotSchema, loadBotSchema } from "../api/api";

export class BotBuilderStore {
  nodes: Node[] = [];
  edges: Edge[] = [];
  nextId = 1;
  
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    //this.addInitialNode();
    this.loadFromServer();
  }

    // Загрузка схемы с сервера
    async loadFromServer() {
        this.isLoading = true;
        this.error = null;
        
        try {
          const schema = await loadBotSchema();
          if (schema) {
            this.nodes = schema.nodes;
            this.edges = schema.edges;
            this.nextId = (++this.nextId);
          } else {
            this.addInitialNode();
          }
        } catch (err) {
          this.error = 'Failed to load schema';
          console.error(err);
          this.addInitialNode();
        } finally {
          this.isLoading = false;
        }
      }
    
      // Сохранение схемы на сервер
      async saveToServer() {
        this.isLoading = true;
        this.error = null;
        
        try {
          const success = await saveBotSchema({
            nodes: toJS(this.nodes),
            edges: toJS(this.edges)
          });
          
          if (!success) {
            throw new Error('Save failed');
          }
        } catch (err) {
          this.error = 'Failed to save schema';
          console.error(err);
        } finally {
          this.isLoading = false;
        }
      }

  get nodesForFlow() {
    return toJS(this.nodes); // Конвертируем в plain JS объект
  }

  get edgesForFlow() {
    return toJS(this.edges); // Конвертируем в plain JS объект
  }

  addInitialNode() {
    this.nodes = [{
      id: "1",
      type: "step",
      position: { x: 100, y: 100 },
      data: { label: "Start" },
    }];
  }

  addNode(fromNodeId: string) {
    const newNodeId = (++this.nextId).toString();
    const fromNode = this.nodes.find(n => n.id === fromNodeId);
    
    if (!fromNode) return;

    const newNode: Node = {
      id: newNodeId,
      type: "step",
      position: { 
        x: fromNode.position.x + 250, 
        y: fromNode.position.y 
      },
      data: { label: `Step ${newNodeId}` },
      draggable: true
    };

    const newEdge: Edge = {
      id: `e${fromNodeId}-${newNodeId}`,
      source: fromNodeId,
      target: newNodeId,
      sourceHandle: `${fromNodeId}-source`,
      targetHandle: `${newNodeId}-target`,
      animated: true,
      style: { stroke: '#555' }
    };

    this.nodes = [...this.nodes, newNode];
    this.edges = [...this.edges, newEdge];
  }

  updateNodePosition(nodeId: string, position: XYPosition) {
    this.nodes = this.nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, position };
      }
      return node;
    });
  }
}

export const store = new BotBuilderStore();