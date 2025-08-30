import { useState, useEffect, useCallback } from 'react';
import { portfolioApi } from '../utils/portfolioApi';

export const usePortfolio = (initialFilters = {}) => {
  const [portfolios, setPortfolios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  const [stats, setStats] = useState(null);
  
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    featured: '',
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    ...initialFilters
  });

  const loadPortfolios = useCallback(async (customFilters = {}) => {
    setIsLoading(true);
    setError('');
    
    try {
      const queryFilters = { ...filters, ...customFilters };
      const response = await portfolioApi.getAll(queryFilters);
      setPortfolios(response.portfolios || []);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error loading portfolios:', error);
      setError('Failed to load portfolio projects. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  const loadStats = useCallback(async () => {
    try {
      const response = await portfolioApi.getStats();
      setStats(response);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1 // Reset to first page unless page is specifically set
    }));
  }, []);

  const createPortfolio = useCallback(async (portfolioData) => {
    try {
      const response = await portfolioApi.create(portfolioData);
      await loadPortfolios();
      await loadStats();
      return response;
    } catch (error) {
      console.error('Error creating portfolio:', error);
      throw error;
    }
  }, [loadPortfolios, loadStats]);

  const updatePortfolio = useCallback(async (id, portfolioData) => {
    try {
      const response = await portfolioApi.update(id, portfolioData);
      await loadPortfolios();
      await loadStats();
      return response;
    } catch (error) {
      console.error('Error updating portfolio:', error);
      throw error;
    }
  }, [loadPortfolios, loadStats]);

  const deletePortfolio = useCallback(async (id) => {
    try {
      const response = await portfolioApi.delete(id);
      await loadPortfolios();
      await loadStats();
      return response;
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      throw error;
    }
  }, [loadPortfolios, loadStats]);

  const bulkDeletePortfolios = useCallback(async (ids) => {
    try {
      const response = await portfolioApi.bulkDelete(ids);
      await loadPortfolios();
      await loadStats();
      return response;
    } catch (error) {
      console.error('Error bulk deleting portfolios:', error);
      throw error;
    }
  }, [loadPortfolios, loadStats]);

  const toggleFeatured = useCallback(async (id) => {
    try {
      const response = await portfolioApi.toggleFeatured(id);
      await loadPortfolios();
      await loadStats();
      return response;
    } catch (error) {
      console.error('Error toggling featured status:', error);
      throw error;
    }
  }, [loadPortfolios, loadStats]);

  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  return {
    // State
    portfolios,
    isLoading,
    error,
    pagination,
    stats,
    filters,
    
    // Actions
    loadPortfolios,
    loadStats,
    updateFilters,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
    bulkDeletePortfolios,
    toggleFeatured,
    
    // Utilities
    setError,
    clearError: () => setError('')
  };
};

export const usePortfolioDetail = (identifier) => {
  const [portfolio, setPortfolio] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPortfolio = useCallback(async () => {
    if (!identifier) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await portfolioApi.getBySlug(identifier);
      setPortfolio(response.portfolio || response);
    } catch (error) {
      console.error('Error loading portfolio:', error);
      setError('Portfolio project not found.');
    } finally {
      setIsLoading(false);
    }
  }, [identifier]);

  useEffect(() => {
    loadPortfolio();
  }, [loadPortfolio]);

  return {
    portfolio,
    isLoading,
    error,
    loadPortfolio,
    setError,
    clearError: () => setError('')
  };
};

export default usePortfolio;