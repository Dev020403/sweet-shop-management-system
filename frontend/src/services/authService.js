import apiService, { tokenManager, userManager } from './apiService';
import { API_ENDPOINTS } from '../constants/api';
import { MESSAGES } from '../constants/app';
import { toast } from 'react-toastify';

export const authService = {
  /**
   * Login user with email and password
   * @param {Object} credentials - User login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response with user data and token
   */
  login: async (credentials) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      const { token, user } = response.data;
      
      // Store token and user data
      tokenManager.setToken(token);
      userManager.setUser(user);
      
      toast.success(MESSAGES.LOGIN_SUCCESS);
      
      return { success: true, user, token };
    } catch (error) {
      const message = error.response?.data?.message || MESSAGES.LOGIN_ERROR;
      toast.error(message);
      throw error;
    }
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @param {string} userData.name - User full name
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @returns {Promise<Object>} Registration response
   */
  register: async (userData) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      toast.success(MESSAGES.REGISTER_SUCCESS);
      
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || MESSAGES.REGISTER_ERROR;
      toast.error(message);
      throw error;
    }
  },

  /**
   * Logout current user
   */
  logout: () => {
    tokenManager.removeToken();
    userManager.removeUser();
    toast.success(MESSAGES.LOGOUT_SUCCESS);
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    return tokenManager.isTokenValid();
  },

  /**
   * Get current user data
   * @returns {Object|null} Current user data
   */
  getCurrentUser: () => {
    return userManager.getUser();
  },

  /**
   * Check if current user is admin
   * @returns {boolean} Admin status
   */
  isAdmin: () => {
    return userManager.isAdmin();
  }
};

export default authService;
