// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
  },
  
  // Sweets endpoints
  SWEETS: {
    BASE: '/api/sweets',
    SEARCH: '/api/sweets/search',
    BY_ID: (id) => `/api/sweets/${id}`,
    PURCHASE: (id) => `/api/sweets/${id}/purchase`,
    RESTOCK: (id) => `/api/sweets/${id}/restock`,
  }
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
