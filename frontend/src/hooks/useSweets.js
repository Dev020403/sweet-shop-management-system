import { useState, useEffect, useCallback } from 'react';
import sweetService from '../services/sweetService';
import { PAGINATION } from '../constants/app';

export const useSweets = (initialParams = {}) => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: PAGINATION.DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    category: '',
    minPrice: null,
    maxPrice: null,
    query: '',
    ...initialParams,
  });

  // Fetch sweets with current filters and pagination
  const fetchSweets = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...params,
      };

      // Remove empty or null values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const response = await sweetService.getAllSweets(queryParams);

      setSweets(response.sweets || []);
      setPagination({
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || PAGINATION.DEFAULT_PAGE_SIZE,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch sweets');
      setSweets([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filters]);

  // Search sweets
  const searchSweets = useCallback(async (searchParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        ...filters,
        ...searchParams,
      };

      // Remove empty or null values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key];
        }
      });

      const response = await sweetService.searchSweets(queryParams);
      setSweets(response.sweets || []);
      setPagination({
        page: 1,
        limit: PAGINATION.DEFAULT_PAGE_SIZE,
        total: response.total || 0,
        totalPages: Math.ceil((response.total || 0) / PAGINATION.DEFAULT_PAGE_SIZE),
      });
    } catch (err) {
      setError(err.message || 'Search failed');
      setSweets([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  }, []);

  // Change page
  const changePage = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  // Change page size
  const changePageSize = useCallback((newPageSize) => {
    setPagination(prev => ({
      ...prev,
      limit: newPageSize,
      page: 1 // Reset to first page
    }));
  }, []);

  // Refresh data
  const refresh = useCallback(() => {
    fetchSweets();
  }, [fetchSweets]);

  // Purchase sweet
  const purchaseSweet = useCallback(async (sweetId, quantity = 1) => {
    try {
      await sweetService.purchaseSweet(sweetId, quantity);
      // Update the sweet in local state
      setSweets(prev => prev.map(sweet =>
        sweet.id === sweetId
          ? { ...sweet, quantity: sweet.quantity - quantity }
          : sweet
      ));
      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  // Add sweet (admin only)
  const addSweet = useCallback(async (sweetData) => {
    try {
      const newSweet = await sweetService.addSweet(sweetData);
      setSweets(prev => [newSweet, ...prev]);
      return newSweet;
    } catch (error) {
      throw error;
    }
  }, []);

  // Update sweet (admin only)
  const updateSweet = useCallback(async (sweetId, sweetData) => {
    try {
      const updatedSweet = await sweetService.updateSweet(sweetId, sweetData);
      setSweets(prev => prev.map(sweet =>
        sweet.id === sweetId ? updatedSweet : sweet
      ));
      return updatedSweet;
    } catch (error) {
      throw error;
    }
  }, []);

  // Delete sweet (admin only)
  const deleteSweet = useCallback(async (sweetId) => {
    try {
      await sweetService.deleteSweet(sweetId);
      setSweets(prev => prev.filter(sweet => sweet.id !== sweetId));
      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  // Restock sweet (admin only)
  const restockSweet = useCallback(async (sweetId, quantity) => {
    try {
      await sweetService.restockSweet(sweetId, quantity);
      // Update the sweet in local state
      setSweets(prev => prev.map(sweet =>
        sweet.id === sweetId
          ? { ...sweet, quantity: sweet.quantity + quantity }
          : sweet
      ));
      return true;
    } catch (error) {
      throw error;
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  return {
    sweets,
    loading,
    error,
    pagination,
    filters,
    fetchSweets,
    searchSweets,
    updateFilters,
    changePage,
    changePageSize,
    refresh,
    purchaseSweet,
    addSweet,
    updateSweet,
    deleteSweet,
    restockSweet,
  };
};
