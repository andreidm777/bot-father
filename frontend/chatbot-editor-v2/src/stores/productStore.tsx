import { makeAutoObservable } from "mobx";
import { productApi } from "../api/api";

export interface Product {
  id?: string;
  name: string;
}

export class ProductStore {
  products: Product[] = [];
  currentProduct: Product | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async loadProducts() {
    this.isLoading = true;
    this.error = null;
    try {
      this.products = await productApi.listProducts();
    } catch (error) {
      // Fallback to mock data if API is not available
      console.warn('API not available, using mock data');
      this.products = [
        { id: "1", name: "Sample Product 1" },
        { id: "2", name: "Sample Product 2" },
        { id: "3", name: "Sample Product 3" }
      ];
      this.error = "Using mock data - API not available";
    } finally {
      this.isLoading = false;
    }
  }

  async createProduct(productData: Omit<Product, 'id'>) {
    this.isLoading = true;
    this.error = null;
    try {
      const newProduct = await productApi.createProduct(productData);
      this.products = [...this.products, newProduct];
      return newProduct;
    } catch (error) {
      // Fallback to mock implementation if API is not available
      console.warn('API not available, using mock implementation');
      const newProduct = {
        id: (this.products.length + 1).toString(),
        ...productData
      };
      this.products = [...this.products, newProduct];
      this.error = "Using mock implementation - API not available";
      return newProduct;
    } finally {
      this.isLoading = false;
    }
  }

  async updateProduct(productId: string, productData: Partial<Product>) {
    this.isLoading = true;
    this.error = null;
    try {
      const updatedProduct = await productApi.updateProduct(productId, productData);
      this.products = this.products.map(product => 
        product.id === productId ? updatedProduct : product
      );
      
      if (this.currentProduct && this.currentProduct.id === productId) {
        this.currentProduct = updatedProduct;
      }
      
      return updatedProduct;
    } catch (error) {
      // Fallback to mock implementation if API is not available
      console.warn('API not available, using mock implementation');
      this.products = this.products.map(product => 
        product.id === productId ? { ...product, ...productData } : product
      );
      
      if (this.currentProduct && this.currentProduct.id === productId) {
        this.currentProduct = { ...this.currentProduct, ...productData };
      }
      
      this.error = "Using mock implementation - API not available";
      return this.products.find(p => p.id === productId) || null;
    } finally {
      this.isLoading = false;
    }
  }

  async deleteProduct(productId: string) {
    this.isLoading = true;
    this.error = null;
    try {
      await productApi.deleteProduct(productId);
      this.products = this.products.filter(product => product.id !== productId);
      
      if (this.currentProduct && this.currentProduct.id === productId) {
        this.currentProduct = null;
      }
    } catch (error) {
      // Fallback to mock implementation if API is not available
      console.warn('API not available, using mock implementation');
      this.products = this.products.filter(product => product.id !== productId);
      
      if (this.currentProduct && this.currentProduct.id === productId) {
        this.currentProduct = null;
      }
      
      this.error = "Using mock implementation - API not available";
    } finally {
      this.isLoading = false;
    }
  }

  setCurrentProduct(product: Product | null) {
    this.currentProduct = product;
  }

  getProductById(id: string) {
    return this.products.find(product => product.id === id) || null;
  }
}

export const productStore = new ProductStore();