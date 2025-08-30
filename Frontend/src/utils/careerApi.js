const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;
// Helper function to handle API responses
const handleResponse = async (response) => {
  
  if (!response.ok) {
    let errorMessage = `HTTP error! status: ${response.status}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
      console.error('API Error Response:', errorData);
    } catch (parseError) {
      console.warn('Failed to parse error response:', parseError);
      errorMessage = response.status === 404 ? 'Resource not found' :
                    response.status === 500 ? 'Server error' :
                    response.status === 403 ? 'Access forbidden' :
                    response.status === 0 ? 'Network connection failed' :
                    'Network error occurred';
    }
    
    throw new Error(errorMessage);
  }
  
  try {
    const data = await response.json();
    return data;
  } catch (parseError) {
    console.warn('Failed to parse response JSON:', parseError);
    throw new Error('Invalid response format from server');
  }
};

// Helper function to retry failed requests
const retryRequest = async (requestFn, maxRetries = 2, delay = 1000) => {
  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      console.warn(`Request attempt ${attempt + 1} failed:`, error.message);
      
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2; // Exponential backoff
      }
    }
  }
  
  throw lastError;
};

export const careerApi = {
  // Get all careers with optional filters
  getAll: async (filters = {}) => {
    return retryRequest(async () => {
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      
      const url = `${API_BASE_URL}/api/careers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });
        
        clearTimeout(timeoutId);
        return await handleResponse(response);
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please check your connection and try again');
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Unable to connect to server - please check your internet connection');
        }
        throw error;
      }
    });
  },

  // Get career by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/careers/${id}`);
    return handleResponse(response);
  },

  // Get career by slug
  getBySlug: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/api/careers/slug/${slug}`);
    return handleResponse(response);
  },

  // Create new career
  create: async (careerData) => {
    const response = await fetch(`${API_BASE_URL}/api/careers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(careerData),
    });
    return handleResponse(response);
  },

  // Update career
  update: async (id, careerData) => {
    const response = await fetch(`${API_BASE_URL}/api/careers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(careerData),
    });
    return handleResponse(response);
  },

  // Delete career
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/careers/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Toggle active status
  toggleActive: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/careers/${id}/toggle-status`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  // Get career statistics
  getStats: async () => {
    return retryRequest(async () => {
      const url = `${API_BASE_URL}/api/careers/stats/overview`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      try {
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          mode: 'cors',
        });
        
        clearTimeout(timeoutId);
        return await handleResponse(response);
      } catch (error) {
        clearTimeout(timeoutId);
        
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - please check your connection and try again');
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Unable to connect to server - please check your internet connection');
        }
        throw error;
      }
    });
  },

  // Bulk delete careers
  bulkDelete: async (ids) => {
    const response = await fetch(`${API_BASE_URL}/api/careers/bulk-delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });
    return handleResponse(response);
  },

  // Get active careers
  getActive: async (limit = 10) => {
    const response = await fetch(`${API_BASE_URL}/api/careers?status=active&limit=${limit}&sortBy=createdAt&sortOrder=desc`);
    return handleResponse(response);
  },

  // Get recent careers
  getRecent: async (limit = 5) => {
    const response = await fetch(`${API_BASE_URL}/api/careers?limit=${limit}&sortBy=createdAt&sortOrder=desc`);
    return handleResponse(response);
  },

  // Search careers
  search: async (query, filters = {}) => {
    const searchFilters = { ...filters, search: query };
    return this.getAll(searchFilters);
  },

  // Get applications for a career
  getApplications: async (careerId, filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const url = `${API_BASE_URL}/api/careers/${careerId}/applications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  // Submit application
  submitApplication: async (careerId, applicationData) => {
    const response = await fetch(`${API_BASE_URL}/api/careers/${careerId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });
    return handleResponse(response);
  }
};

export default careerApi;