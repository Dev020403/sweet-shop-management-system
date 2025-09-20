// Sweet Categories
export const SWEET_CATEGORIES = [
  'Chocolate',
  'Gummy',
  'Hard Candy',
  'Lollipops',
  'Caramel',
  'Sour Candy',
  'Mints',
  'Toffee',
  'Marshmallow',
  'Cookies',
  'Cakes',
  'Other'
];

// User Roles
export const USER_ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN'
};

// Toast Messages
export const MESSAGES = {
  LOGIN_SUCCESS: 'Login successful! Welcome back!',
  LOGIN_ERROR: 'Invalid credentials. Please try again.',
  REGISTER_SUCCESS: 'Registration successful! Please log in.',
  REGISTER_ERROR: 'Registration failed. Please try again.',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  SWEET_ADDED: 'Sweet added successfully!',
  SWEET_UPDATED: 'Sweet updated successfully!',
  SWEET_DELETED: 'Sweet deleted successfully!',
  PURCHASE_SUCCESS: 'Purchase completed successfully!',
  PURCHASE_ERROR: 'Purchase failed. Please try again.',
  RESTOCK_SUCCESS: 'Inventory restocked successfully!',
  RESTOCK_ERROR: 'Restocking failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Access denied. Please log in.',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'sweet_shop_token',
  USER: 'sweet_shop_user',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48],
};

// Price Ranges for Filtering
export const PRICE_RANGES = [
  { label: 'Under $5', min: 0, max: 5 },
  { label: '$5 - $10', min: 5, max: 10 },
  { label: '$10 - $20', min: 10, max: 20 },
  { label: '$20 - $50', min: 20, max: 50 },
  { label: 'Over $50', min: 50, max: null },
];
