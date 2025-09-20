import apiService, { tokenManager, userManager } from './apiService';
import { API_ENDPOINTS } from '../constants/api';
import { MESSAGES } from '../constants/app';
import { toast } from 'react-toastify';

// Helper function to decode JWT token
const decodeJWTToken = (token) => {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

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
      // Transform credentials to match backend expectations
      const loginData = {
        usernameOrEmail: credentials.email, // Map email to usernameOrEmail
        password: credentials.password
      };

      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, loginData);

      const token = response.data.token;

      // Decode JWT to get role
      const decodedToken = decodeJWTToken(token);
      const role = decodedToken?.role || 'USER';

      // Create user object with role from JWT
      const user = {
        username: response.data.username,
        email: response.data.email,
        role: role // This comes from the JWT token
      };

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
   * @param {string} userData.name - User full name (will be mapped to username)
   * @param {string} userData.email - User email
   * @param {string} userData.password - User password
   * @returns {Promise<Object>} Registration response
   */
  register: async (userData) => {
    try {
      // Transform userData to match backend expectations
      const registerData = {
        username: userData.name || userData.username, // Map name to username
        email: userData.email,
        password: userData.password,
        role: (userData.role || 'USER').toUpperCase() // Default to USER role if not specified
      };

      const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, registerData);

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
    const user = userManager.getUser();

    // If user exists but doesn't have role, try to get it from token
    if (user && !user.role) {
      const token = tokenManager.getToken();
      if (token) {
        const decodedToken = decodeJWTToken(token);
        if (decodedToken?.role) {
          user.role = decodedToken.role;
          userManager.setUser(user); // Update stored user with role
        }
      }
    }

    return user;
  },

  /**
   * Check if current user is admin
   * @returns {boolean} Admin status
   */
  isAdmin: () => {
    const user = this.getCurrentUser();
    return user?.role === 'ADMIN';
  }
};

export default authService;