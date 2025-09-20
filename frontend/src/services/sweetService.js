import apiService from './apiService';
import { API_ENDPOINTS } from '../constants/api';
import { MESSAGES } from '../constants/app';
import { toast } from 'react-toastify';

export const sweetService = {
  /**
   * Get all sweets with optional pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.category - Filter by category
   * @param {number} params.minPrice - Minimum price filter
   * @param {number} params.maxPrice - Maximum price filter
   * @returns {Promise<Object>} Sweets data with pagination info
   */
  getAllSweets: async (params = {}) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.SWEETS.BASE, { params });

      // Handle API response structure: { data: [sweet1, sweet2, ...] }
      let sweets = [];
      if (response.data && Array.isArray(response.data.data)) {
        sweets = response.data.data;
      } else if (Array.isArray(response.data)) {
        sweets = response.data;
      }
      return {
        data: sweets,
        pagination: response.data.pagination || {
          page: 1,
          limit: sweets.length,
          total: sweets.length,
          totalPages: 1
        },
        total: response.data.total || sweets.length
      };
    } catch (error) {
      toast.error('Failed to fetch sweets');
      throw error;
    }
  },

  /**
   * Search sweets by name, category, or price range
   * @param {Object} searchParams - Search parameters
   * @param {string} searchParams.query - Search query
   * @param {string} searchParams.category - Filter by category
   * @param {number} searchParams.minPrice - Minimum price
   * @param {number} searchParams.maxPrice - Maximum price
   * @returns {Promise<Object>} Search results
   */
  searchSweets: async (searchParams) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.SWEETS.SEARCH, {
        params: {
          name: searchParams.query,    
          category: searchParams.category,
          minPrice: searchParams.minPrice,
          maxPrice: searchParams.maxPrice,
        }
      });

      // Handle search response structure
      let sweets = [];
      if (response.data && Array.isArray(response.data.data)) {
        sweets = response.data.data;
      } else if (Array.isArray(response.data)) {
        sweets = response.data;
      }

      return {
        data: sweets,
        pagination: response.data.pagination || {
          page: 1,
          limit: sweets.length,
          total: sweets.length,
          totalPages: 1
        },
        total: response.data.total || sweets.length
      };
    } catch (error) {
      toast.error('Search failed');
      throw error;
    }
  },

  /**
   * Get sweet by ID
   * @param {string|number} id - Sweet ID
   * @returns {Promise<Object>} Sweet data
   */
  getSweetById: async (id) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.SWEETS.BY_ID(id));

      // Handle single sweet response
      if (response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      toast.error('Failed to fetch sweet details');
      throw error;
    }
  },

  /**
   * Add a new sweet (Admin only)
   * @param {Object} sweetData - Sweet information
   * @param {string} sweetData.name - Sweet name
   * @param {string} sweetData.category - Sweet category
   * @param {number} sweetData.price - Sweet price
   * @param {number} sweetData.quantity - Initial quantity
   * @param {string} sweetData.description - Sweet description
   * @param {string} sweetData.image - Image URL
   * @returns {Promise<Object>} Created sweet data
   */
  addSweet: async (sweetData) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.SWEETS.BASE, sweetData);
      toast.success(MESSAGES.SWEET_ADDED);

      // Handle created sweet response
      if (response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add sweet';
      toast.error(message);
      throw error;
    }
  },

  /**
   * Update sweet details (Admin only)
   * @param {string|number} id - Sweet ID
   * @param {Object} sweetData - Updated sweet data
   * @returns {Promise<Object>} Updated sweet data
   */
  updateSweet: async (id, sweetData) => {
    try {
      const response = await apiService.put(API_ENDPOINTS.SWEETS.BY_ID(id), sweetData);
      toast.success(MESSAGES.SWEET_UPDATED);

      // Handle updated sweet response
      if (response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update sweet';
      toast.error(message);
      throw error;
    }
  },

  /**
   * Delete sweet (Admin only)
   * @param {string|number} id - Sweet ID
   * @returns {Promise<Object>} Delete confirmation
   */
  deleteSweet: async (id) => {
    try {
      const response = await apiService.delete(API_ENDPOINTS.SWEETS.BY_ID(id));
      toast.success(MESSAGES.SWEET_DELETED);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete sweet';
      toast.error(message);
      throw error;
    }
  },

  /**
   * Purchase a sweet (decrease quantity)
   * @param {string|number} id - Sweet ID
   * @param {number} quantity - Quantity to purchase
   * @returns {Promise<Object>} Purchase confirmation
   */
  purchaseSweet: async (id, quantity = 1) => {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.SWEETS.PURCHASE(id),
        { quantity }
      );
      toast.success(MESSAGES.PURCHASE_SUCCESS);

      // Handle purchase response
      if (response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || MESSAGES.PURCHASE_ERROR;
      toast.error(message);
      throw error;
    }
  },

  /**
   * Restock a sweet (Admin only)
   * @param {string|number} id - Sweet ID
   * @param {number} quantity - Quantity to add to stock
   * @returns {Promise<Object>} Restock confirmation
   */
  restockSweet: async (id, quantity) => {
    try {
      const response = await apiService.post(
        API_ENDPOINTS.SWEETS.RESTOCK(id),
        { quantity }
      );
      toast.success(MESSAGES.RESTOCK_SUCCESS);

      // Handle restock response
      if (response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || MESSAGES.RESTOCK_ERROR;
      toast.error(message);
      throw error;
    }
  }
};

export default sweetService;