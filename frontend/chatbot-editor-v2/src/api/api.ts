// src/api.ts
import { Node, Edge } from 'reactflow';

// Типы для API
export interface BotSchema {
    nodes: Node[];
    edges: Edge[];
  }
  
  // Mock функция для сохранения схемы на сервер
  export const saveBotSchema = async (schema: BotSchema): Promise<boolean> => {
    console.log('Saving schema to server:', schema);
    localStorage.setItem('bot-schema', JSON.stringify(schema));
    return true;
  };
  
  // Mock функция для загрузки схемы с сервера
  export const loadBotSchema = async (): Promise<BotSchema | null> => {
    const savedSchema = localStorage.getItem('bot-schema');
    if (!savedSchema) return null;
    
    console.log('Loading schema from server:', savedSchema);
    return JSON.parse(savedSchema);
  };