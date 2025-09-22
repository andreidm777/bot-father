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
const AUTH_BASE_URL = 'http://localhost:8082'; // Auth service URL

// Create separate axios instances for auth and settings services
const authApiInstance = axios.create({
  baseURL: AUTH_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // This is important for cookie-based authentication
});

const settingsApiInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // This is important for cookie-based authentication
});

// Add interceptors for error handling
const addErrorInterceptor = (apiInstance: any) => {
  apiInstance.interceptors.response.use(
    (response: any) => response,
    (error: any) => {
      if (error.response) {
        // Обработка HTTP ошибок
        console.error('API Error:', error.response.data);
        return Promise.reject(error.response.data);
      }
      console.error('API Error:', error.message);
      return Promise.reject(error);
    }
  );
};

addErrorInterceptor(authApiInstance);
addErrorInterceptor(settingsApiInstance);

// Auth API
export const authService = {
  async register(email: string, passwd1: string, passwd2: string) {
    try {
      const response = await authApiInstance.put('/register', { email, passwd1, passwd2 });
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  async login(email: string, passwd: string) {
    try {
      const response = await authApiInstance.post('/login', { email, passwd });
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }
};

export const botApi = {
  async listBots(productId: string): Promise<Bot[]> {
    try {
      const response = await settingsApiInstance.get(`/product/${productId}/bots`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bots:', error);
      throw error;
    }
  },

  async createBot(productId: string, botData: Omit<Bot, 'id'>): Promise<Bot> {
    try {
      const response = await settingsApiInstance.put(`/product/${productId}/bot`, botData);
      return response.data;
    } catch (error) {
      console.error('Error creating bot:', error);
      throw error;
    }
  },

  async updateBot(productId: string, botId: string, botData: Partial<Bot>): Promise<Bot> {
    try {
      const response = await settingsApiInstance.post(
        `/product/${productId}/bot/${botId}`,
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
      await settingsApiInstance.delete(`/product/${productId}/bot/${botId}`);
    } catch (error) {
      console.error('Error deleting bot:', error);
      throw error;
    }
  }
};

export const productApi = {
  async listProducts(): Promise<Product[]> {
    try {
      const response = await settingsApiInstance.get(`/products`);
      return response.data.products || [];
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getProduct(productId: string): Promise<Product> {
    try {
      const response = await settingsApiInstance.get(`/product/${productId}`);
      return response.data.product;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  async createProduct(productData: Omit<Product, 'id'>): Promise<Product> {
    try {
      const response = await settingsApiInstance.put(`/product`, productData);
      return response.data.product;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  async updateProduct(productId: string, productData: Partial<Product>): Promise<Product> {
    try {
      const response = await settingsApiInstance.post(`/product/${productId}`, productData);
      return response.data.product;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },

  async deleteProduct(productId: string): Promise<void> {
    try {
      await settingsApiInstance.delete(`/product/${productId}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
};