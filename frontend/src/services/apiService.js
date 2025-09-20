import axios from 'axios';
import { API_BASE_URL } from '../constants/api';
import { STORAGE_KEYS, MESSAGES } from '../constants/app';
import { toast } from 'react-toastify';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management utilities
export const tokenManager = {
  getToken: () => localStorage.getItem(STORAGE_KEYS.TOKEN),
  setToken: (token) => localStorage.setItem(STORAGE_KEYS.TOKEN, token),
  removeToken: () => localStorage.removeItem(STORAGE_KEYS.TOKEN),
  isTokenValid: () => {
    const token = tokenManager.getToken();
    if (!token) return false;

    try {
      // Simple JWT validation - check if token is not expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }
};

// User management utilities
export const userManager = {
  getUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user) => localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user)),
  removeUser: () => localStorage.removeItem(STORAGE_KEYS.USER),
  isAdmin: () => {
    const user = userManager.getUser();
    return user?.role === 'admin';
  }
};

// Request interceptor to add token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token && tokenManager.isTokenValid()) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      // Token expired or invalid
      tokenManager.removeToken();
      userManager.removeUser();
      toast.error(MESSAGES.UNAUTHORIZED);
      window.location.href = '/login';
    } else if (response?.status >= 500) {
      toast.error(MESSAGES.NETWORK_ERROR);
    } else if (!response) {
      toast.error(MESSAGES.NETWORK_ERROR);
    }

    return Promise.reject(error);
  }
);

// Generic API methods
const apiService = {
  get: (url, config = {}) => apiClient.get(url, config),
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),
  delete: (url, config = {}) => apiClient.delete(url, config),
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
};

export default apiService;
