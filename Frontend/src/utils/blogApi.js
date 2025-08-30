const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to retry API calls
const retryFetch = async (url, options = {}, maxRetries = 3) => {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      lastError = error;
      if (i < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  
  throw lastError;
};

export const blogApi = {
  // Get all blogs with optional filters
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const url = `${API_BASE_URL}/api/blogs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await retryFetch(url);
    return handleResponse(response);
  },

  // Get blog by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`);
    return handleResponse(response);
  },

  // Get blog by slug
  getBySlug: async (slug) => {
    const response = await fetch(`${API_BASE_URL}/api/blogs/slug/${slug}`);
    return handleResponse(response);
  },

  // Create new blog
  create: async (blogData) => {
    const response = await fetch(`${API_BASE_URL}/api/blogs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });
    return handleResponse(response);
  },

  // Update blog
  update: async (id, blogData) => {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });
    return handleResponse(response);
  },

  // Delete blog
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Toggle featured status
  toggleFeatured: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${id}/featured`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  // Toggle published status
  togglePublished: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/blogs/${id}/publish`, {
      method: 'PATCH',
    });
    return handleResponse(response);
  },

  // Get blog statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/blogs/stats/overview`);
    return handleResponse(response);
  },

  // Bulk delete blogs
  bulkDelete: async (ids) => {
    const response = await fetch(`${API_BASE_URL}/api/blogs/bulk/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });
    return handleResponse(response);
  },

  // Get featured blogs
  getFeatured: async (limit = 5) => {
    const response = await fetch(`${API_BASE_URL}/api/blogs?featured=true&limit=${limit}&sortBy=createdAt&sortOrder=desc`);
    return handleResponse(response);
  },

  // Get recent blogs
  getRecent: async (limit = 5) => {
    const response = await fetch(`${API_BASE_URL}/api/blogs?limit=${limit}&sortBy=createdAt&sortOrder=desc`);
    return handleResponse(response);
  },

  // Search blogs
  search: async (query, filters = {}) => {
    const searchFilters = { ...filters, search: query };
    return this.getAll(searchFilters);
  }
};

export default blogApi;