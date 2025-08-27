import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthResponse, Product, Category, ApiResponse, CreateTransactionRequest, HardwareStatus } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('swiftpos_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('swiftpos_token');
      localStorage.removeItem('swiftpos_user');
      window.location.href = '/login';
    }
    
    const message = error.response?.data?.error || 'An error occurred';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

// Products API
export const productsAPI = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>('/products');
    return response.data.data || [];
  },
  
  getById: async (id: number): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data!;
  },
  
  search: async (query: string): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>(`/products?search=${encodeURIComponent(query)}`);
    return response.data.data || [];
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data.data || [];
  },
};

// Transactions API
export const transactionsAPI = {
  create: async (transaction: CreateTransactionRequest): Promise<any> => {
    const response = await api.post('/transactions', transaction);
    return response.data;
  },
  
  getAll: async (): Promise<any[]> => {
    const response = await api.get('/transactions');
    return response.data.data || [];
  },
};

// Hardware API
export const hardwareAPI = {
  getStatus: async (): Promise<HardwareStatus> => {
    const response = await api.get<ApiResponse<HardwareStatus>>('/hardware/status');
    return response.data.data!;
  },
};

export default api;
