// src/api.ts
import { Node, Edge } from 'reactflow';
import axios from 'axios';

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



interface Bot {
  id?: string;
  product_id: string;
  type: string;
  botToken: string;
  botGroup: string;
  callbackUrl: string;
  webhookSecret?: string;
}

interface Product {
  id?: string;
  name: string;
}

const API_BASE_URL = 'http://localhost:8081'; // Settings service URL

const api = axios.create({
  baseURL: 'http://localhost:8081',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Добавляем интерсепторы для обработки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // Обработка HTTP ошибок
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    }
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

export const botApi = {
  async listBots(productId: string): Promise<Bot[]> {
    try {
      const response = await api.get(`${API_BASE_URL}/product/${productId}/bots`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bots:', error);
      throw error;
    }
  },

  async createBot(productId: string, botData: Omit<Bot, 'id'>): Promise<Bot> {
    try {
      const response = await api.put(`${API_BASE_URL}/product/${productId}/bot`, botData);
      return response.data;
    } catch (error) {
      console.error('Error creating bot:', error);
      throw error;
    }
  },

  async updateBot(productId: string, botId: string, botData: Partial<Bot>): Promise<Bot> {
    try {
      const response = await api.post(
        `${API_BASE_URL}/product/${productId}/bot/${botId}`,
        botData
      );
      return response.data;
    } catch (error) {
      console.error('Error updating bot:', error);
      throw error;
    }
  },

  async deleteBot(productId: string, botId: string): Promise<void> {
    try {
      await api.delete(`${API_BASE_URL}/product/${productId}/bot/${botId}`);
    } catch (error) {
      console.error('Error deleting bot:', error);
      throw error;
    }
  }
}

export const productApi = {
  async listProducts(): Promise<Product[]> {
    try {
      // Note: This endpoint requires authentication, so we might need to handle that
      // For now, we'll implement a mock version
      console.log('Fetching products from server');
      return [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    try {
      const response = await api.put(`${API_BASE_URL}/product`, productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(productId: string, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await api.post(`${API_BASE_URL}/product/${productId}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    try {
      await api.delete(`${API_BASE_URL}/product/${productId}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};