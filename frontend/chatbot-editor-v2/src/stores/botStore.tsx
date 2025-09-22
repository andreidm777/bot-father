import { makeAutoObservable } from "mobx";
import { botApi } from "../api/api";

export interface Bot {
  id?: string;
  product_id: string;
  type: string;
  botToken: string;
  botGroup: string;
  callbackUrl: string;
  webhookSecret?: string;
}

export class BotStore {
  bots: Bot[] = [];
  isLoading = false;
  error: string | null = null;
  needsAuthentication = false;

  constructor() {
    makeAutoObservable(this);
  }

  async loadBots(productId: string) {
    this.isLoading = true;
    this.error = null;
    this.needsAuthentication = false;
    try {
      this.bots = await botApi.listBots(productId);
    } catch (error: any) {
      // Handle unauthorized access
      if (error.message === 'UNAUTHORIZED') {
        this.needsAuthentication = true;
        return;
      }
      
      // Fallback to mock data if API is not available
      console.warn('API not available, using mock data');
      this.bots = [
        { 
          id: "1", 
          product_id: productId,
          type: "Telegram Bot", 
          botToken: "123456789:ABCDEFabcdef1234567890", 
          botGroup: "support", 
          callbackUrl: "https://example.com/callback"
        },
        { 
          id: "2", 
          product_id: productId,
          type: "VK Bot", 
          botToken: "vk_987654321", 
          botGroup: "sales", 
          callbackUrl: "https://example.com/vk-callback"
        }
      ];
      this.error = "Using mock data - API not available";
    } finally {
      this.isLoading = false;
    }
  }

  async createBot(productId: string, botData: Omit<Bot, 'id'>) {
    this.isLoading = true;
    this.error = null;
    try {
      const newBot = await botApi.createBot(productId, botData);
      this.bots = [...this.bots, newBot];
      return newBot;
    } catch (error: any) {
      // Handle unauthorized access
      if (error.message === 'UNAUTHORIZED') {
        this.needsAuthentication = true;
        throw error;
      }
      
      // Fallback to mock implementation if API is not available
      console.warn('API not available, using mock implementation');
      
      // Имитируем проверку существования продукта
      // В реальном API, если продукт не существует, возвращается ошибка
      if (!productId || productId === "invalid") {
        const error = new Error('mongo: no documents in result');
        console.error('Mock API error:', error.message);
        throw error;
      }
      
      // Удаляем product_id из botData, если он там есть, чтобы избежать дублирования
      const { product_id, ...cleanBotData } = botData;
      const newBot = {
        id: (this.bots.length + 1).toString(),
        product_id: productId,
        ...cleanBotData
      };
      this.bots = [...this.bots, newBot];
      this.error = "Using mock implementation - API not available";
      return newBot;
    } finally {
      this.isLoading = false;
    }
  }

  async updateBot(productId: string, botId: string, botData: Partial<Bot>) {
    this.isLoading = true;
    this.error = null;
    try {
      const updatedBot = await botApi.updateBot(productId, botId, botData);
      this.bots = this.bots.map(bot => 
        bot.id === botId ? updatedBot : bot
      );
      return updatedBot;
    } catch (error: any) {
      // Handle unauthorized access
      if (error.message === 'UNAUTHORIZED') {
        this.needsAuthentication = true;
        throw error;
      }
      
      // Fallback to mock implementation if API is not available
      console.warn('API not available, using mock implementation');
      this.bots = this.bots.map(bot => 
        bot.id === botId ? { ...bot, ...botData } : bot
      );
      this.error = "Using mock implementation - API not available";
      return this.bots.find(b => b.id === botId) || null;
    } finally {
      this.isLoading = false;
    }
  }

  async deleteBot(productId: string, botId: string) {
    this.isLoading = true;
    this.error = null;
    try {
      await botApi.deleteBot(productId, botId);
      this.bots = this.bots.filter(bot => bot.id !== botId);
    } catch (error: any) {
      // Handle unauthorized access
      if (error.message === 'UNAUTHORIZED') {
        this.needsAuthentication = true;
        throw error;
      }
      
      // Fallback to mock implementation if API is not available
      console.warn('API not available, using mock implementation');
      this.bots = this.bots.filter(bot => bot.id !== botId);
      this.error = "Using mock implementation - API not available";
    } finally {
      this.isLoading = false;
    }
  }
}

export const botStore = new BotStore();