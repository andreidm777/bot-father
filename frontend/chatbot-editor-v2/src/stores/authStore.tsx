import { makeAutoObservable } from "mobx";

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
      // In a real implementation, we would make an API call to authenticate
      // For now, we'll simulate a successful login
      const response = await fetch('http://localhost:8082/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, passwd: password }),
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        this.isAuthenticated = true;
        this.user = { email };
        // Store in localStorage for persistence
        localStorage.setItem('authToken', 'dummy-token');
        localStorage.setItem('user', JSON.stringify(this.user));
        return data;
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      this.error = "Failed to login";
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