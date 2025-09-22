import { makeAutoObservable } from "mobx";
import { authService } from "../api/api";

export class AuthStore {
  isAuthenticated = false;
  user: any = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    // Check if user is already authenticated on app load
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    // Check for existing authentication token in localStorage
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isAuthenticated = true;
      this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }
  }

  async login(email: string, password: string) {
    this.isLoading = true;
    this.error = null;
    try {
      // Use the real API for authentication
      const response = await authService.login(email, password);
      
      this.isAuthenticated = true;
      this.user = { email };
      // Store in localStorage for persistence
      localStorage.setItem('authToken', 'dummy-token'); // In a real implementation, we'd get the actual token
      localStorage.setItem('user', JSON.stringify(this.user));
      
      return response;
    } catch (error) {
      this.error = "Failed to login";
      console.error(error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async register(email: string, password: string, confirmPassword: string) {
    this.isLoading = true;
    this.error = null;
    try {
      // Use the real API for registration
      const response = await authService.register(email, password, confirmPassword);
      
      // After successful registration, automatically log in the user
      await this.login(email, password);
      
      return response;
    } catch (error) {
      this.error = "Failed to register";
      console.error(error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.isAuthenticated = false;
    this.user = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // In a real implementation, we would also call the logout API endpoint
  }
}

export const authStore = new AuthStore();