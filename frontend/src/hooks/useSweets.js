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
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Clean query parameters helper
  const cleanParams = useCallback((params) => {
    const cleaned = { ...params };
    Object.keys(cleaned).forEach(key => {
      if (cleaned[key] === '' || cleaned[key] === null || cleaned[key] === undefined) {
        delete cleaned[key];
      }
    });
    return cleaned;
  }, []);

  // Fetch sweets with current filters and pagination
  const fetchSweets = useCallback(async (overrideParams = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
        ...overrideParams,
      };

      const cleanedParams = cleanParams(queryParams);
      const response = await sweetService.getAllSweets(cleanedParams);
      
      setSweets(response.data || []);
      setPagination(prev => ({
        ...prev,
        page: response.pagination?.page || prev.page,
        total: response.pagination?.total || 0,
        totalPages: response.pagination?.totalPages || 0,
      }));
      setIsSearchMode(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch sweets');
      setSweets([]);
    } finally {
      setLoading(false);
    }
  }, []); // Remove dependencies to avoid circular dependency

  // Search sweets - separate from fetchSweets
  const searchSweets = useCallback(async (searchParams = {}) => {
    setLoading(true);
    setError(null);
    setIsSearchMode(true);

    try {
      const queryParams = {
        ...filters,
        ...searchParams,
      };

      const cleanedParams = cleanParams(queryParams);
      const response = await sweetService.searchSweets(cleanedParams);
      
      setSweets(response.data || []);
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
  }, [filters, cleanParams]);

  // Update filters and trigger appropriate action
  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setPagination(prev => ({ ...prev, page: 1 }));

    // Determine if this is a search or regular fetch
    const hasSearchCriteria = updatedFilters.query || 
                             (updatedFilters.category && updatedFilters.category !== '') ||
                             updatedFilters.minPrice || 
                             updatedFilters.maxPrice;

    if (hasSearchCriteria) {
      // Use search endpoint
      searchSweets(updatedFilters);
    } else {
      // Use regular fetch
      fetchSweets(updatedFilters);
    }
  }, [filters, searchSweets]);

  // Change page
  const changePage = useCallback((newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    
    // Re-fetch with new page
    const queryParams = {
      ...filters,
      page: newPage,
      limit: pagination.limit,
    };

    if (isSearchMode) {
      searchSweets(queryParams);
    } else {
      fetchSweets(queryParams);
    }
  }, [filters, pagination.limit, isSearchMode, searchSweets]);

  // Change page size
  const changePageSize = useCallback((newPageSize) => {
    setPagination(prev => ({
      ...prev,
      limit: newPageSize,
      page: 1
    }));

    const queryParams = {
      ...filters,
      page: 1,
      limit: newPageSize,
    };

    if (isSearchMode) {
      searchSweets(queryParams);
    } else {
      fetchSweets(queryParams);
    }
  }, [filters, isSearchMode, searchSweets]);

  // Clear search and return to normal listing
  const clearSearch = useCallback(() => {
    setFilters({
      category: '',
      minPrice: null,
      maxPrice: null,
      query: '',
    });
    setIsSearchMode(false);
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchSweets({
      page: 1,
      limit: pagination.limit,
    });
  }, [pagination.limit]);

  // Refresh data - respects current mode (search or fetch)
  const refresh = useCallback(() => {
    const queryParams = {
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    };

    if (isSearchMode) {
      searchSweets(queryParams);
    } else {
      fetchSweets(queryParams);
    }
  }, [filters, pagination.page, pagination.limit, isSearchMode, searchSweets]);

  // Purchase sweet
  const purchaseSweet = useCallback(async (sweetId, quantity = 1) => {
    try {
      await sweetService.purchaseSweet(sweetId, quantity);
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
      // Only add to current list if not in search mode or if it matches current filters
      if (!isSearchMode) {
        setSweets(prev => [newSweet, ...prev]);
      } else {
        // Refresh search results to include new sweet if it matches
        refresh();
      }
      return newSweet;
    } catch (error) {
      throw error;
    }
  }, [isSearchMode, refresh]);

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
  }, []); // Only run once on mount

  return {
    sweets,
    loading,
    error,
    pagination,
    filters,
    isSearchMode,
    fetchSweets,
    searchSweets,
    updateFilters,
    changePage,
    changePageSize,
    refresh,
    clearSearch,
    purchaseSweet,
    addSweet,
    updateSweet,
    deleteSweet,
    restockSweet,
  };
};