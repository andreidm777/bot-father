import { makeAutoObservable, toJS } from "mobx";
import { Node, Edge, XYPosition } from "reactflow";
import { saveBotSchema, loadBotSchema, botApi } from "../api/api";

// Добавим типы шагов
export type StepType = 'wait_message' | 'send_message' | 'reaction';

export interface StepNodeData {
  label: string;
  type: StepType;
  payload?: string;
}

export interface BotSettings {
  id?: string;
  product_id: string;
  type: string;
  botToken: string;
  botGroup: string;
  callbackUrl: string;
  webhookSecret?: string;
}

export class BotBuilderStore {
  nodes: Node[] = [];
  edges: Edge[] = [];
  nextId = 1;

  botSettings: BotSettings = this.loadInitialSettings();

  isSettingsModalOpen = false;

  currentBot: BotSettings | null = null;

  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    //this.addInitialNode();
    this.loadFromServer();
    this.loadBot();
  }

  async loadBot() {
    this.isLoading = true;
    this.error = null;
    try {
      const bots = await botApi.listBots("1"); // product_id = 1
      this.currentBot = bots[0] || null;
    } catch (error) {
      this.error = "Failed to load bot settings";
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  async saveBotSettings(settings: BotSettings) {
    this.isLoading = true;
    this.error = null;
    try {
      if (settings.id) {
        // Обновляем существующего бота
        this.currentBot = await botApi.updateBot("1", settings.id, settings);
      } else {
        // Создаем нового бота
        this.currentBot = await botApi.createBot("1", {
          ...settings,
          type: "telegram", // или "vk" в зависимости от типа бота
          product_id: "1"
        });
      }
    } catch (error) {
      this.error = "Failed to save bot settings";
      console.error(error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async deleteBot() {
    if (!this.currentBot?.id) return;
    
    this.isLoading = true;
    this.error = null;
    try {
      await botApi.deleteBot("1", this.currentBot.id);
      this.currentBot = null;
    } catch (error) {
      this.error = "Failed to delete bot";
      console.error(error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  private loadInitialSettings(): BotSettings {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('bot-settings');
      return savedSettings 
        ? JSON.parse(savedSettings) 
        : {
            product_id: "1",
            type: "vk",
            botToken: '',
            botGroup: '',
            callbackUrl: ''
          };
    }
    return {
      product_id: "1",
            type: "vk",
            botToken: '',
            botGroup: '',
            callbackUrl: ''
    };
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

    const newNode: Node<StepNodeData> = {
      id: newNodeId,
      type: "step",
      position: { x: fromNode.position.x + 250, y: fromNode.position.y },
      data: {
        label: `Step ${newNodeId}`,
        type: 'wait_message', // тип по умолчанию
        payload: ''
      },
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

  updateNode(id: string, data: Partial<StepNodeData>) {
    this.nodes = this.nodes.map(node => {
      if (node.id === id) {
        return { ...node, data: { ...node.data, ...data } };
      }
      return node;
    });
  }

  deleteNode(nodeId: string) {
    // Находим удаляемый узел
    const nodeToDelete = this.nodes.find(n => n.id === nodeId);
    if (!nodeToDelete) return;

    // Находим входящие и исходящие связи
    const incomingEdges = this.edges.filter(e => e.target === nodeId);
    const outgoingEdges = this.edges.filter(e => e.source === nodeId);

    // Переносим связи (если есть что переносить)
    if (incomingEdges.length > 0 && outgoingEdges.length > 0) {
      const newEdges = outgoingEdges.map(outEdge => ({
        id: `e${incomingEdges[0].source}-${outEdge.target}`,
        source: incomingEdges[0].source,
        target: outEdge.target,
        animated: true
      }));

      this.edges = [
        ...this.edges.filter(e => e.source !== nodeId && e.target !== nodeId),
        ...newEdges
      ];
    } else {
      // Просто удаляем все связанные связи
      this.edges = this.edges.filter(e => e.source !== nodeId && e.target !== nodeId);
    }

    // Удаляем сам узел
    this.nodes = this.nodes.filter(n => n.id !== nodeId);
  }

  private async saveBotSettingsToApi(settings: BotSettings) {
    // Здесь реализация сохранения (localStorage или API)
    localStorage.setItem('bot-settings', JSON.stringify(settings));
  }

  async loadBotSettings() {
    this.isLoading = true;
    try {
      const settings = await this.loadFromLocalStorage('bot-settings');
      if (settings) {
        this.botSettings = settings;
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private async loadFromLocalStorage(key: string) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  // Управление модальным окном
  openSettingsModal() {
    this.isSettingsModalOpen = true;
  }

  closeSettingsModal() {
    this.isSettingsModalOpen = false;
  }


}

export const store = new BotBuilderStore();