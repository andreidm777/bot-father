import { makeAutoObservable } from "mobx";

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
      // For now, we'll use mock data since the actual API requires authentication
      // In a real implementation, we would call productApi.listProducts()
      this.products = [
        { id: "1", name: "Sample Product 1" },
        { id: "2", name: "Sample Product 2" },
        { id: "3", name: "Sample Product 3" }
      ];
    } catch (error) {
      this.error = "Failed to load products";
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  async createProduct(productData: Omit<Product, 'id'>) {
    this.isLoading = true;
    this.error = null;
    try {
      // In a real implementation, we would call productApi.createProduct(productData)
      // For now, we'll simulate the API call
      const newProduct = {
        id: (this.products.length + 1).toString(),
        ...productData
      };
      
      this.products = [...this.products, newProduct];
      return newProduct;
    } catch (error) {
      this.error = "Failed to create product";
      console.error(error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async updateProduct(productId: string, productData: Partial<Product>) {
    this.isLoading = true;
    this.error = null;
    try {
      // In a real implementation, we would call productApi.updateProduct(productId, productData)
      // For now, we'll simulate the API call
      this.products = this.products.map(product => 
        product.id === productId ? { ...product, ...productData } : product
      );
      
      if (this.currentProduct && this.currentProduct.id === productId) {
        this.currentProduct = { ...this.currentProduct, ...productData };
      }
    } catch (error) {
      this.error = "Failed to update product";
      console.error(error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  async deleteProduct(productId: string) {
    this.isLoading = true;
    this.error = null;
    try {
      // In a real implementation, we would call productApi.deleteProduct(productId)
      // For now, we'll simulate the API call
      this.products = this.products.filter(product => product.id !== productId);
      
      if (this.currentProduct && this.currentProduct.id === productId) {
        this.currentProduct = null;
      }
    } catch (error) {
      this.error = "Failed to delete product";
      console.error(error);
      throw error;
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