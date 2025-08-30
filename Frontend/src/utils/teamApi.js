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

export const teamApi = {
  // Get all team members with optional filters
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const url = `${API_BASE_URL}/api/team${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await retryFetch(url);
    return handleResponse(response);
  },

  // Get team member by ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/team/${id}`);
    return handleResponse(response);
  },

  // Create new team member
  create: async (teamData) => {
    const response = await fetch(`${API_BASE_URL}/api/team`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });
    return handleResponse(response);
  },

  // Update team member
  update: async (id, teamData) => {
    const response = await fetch(`${API_BASE_URL}/api/team/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });
    return handleResponse(response);
  },

  // Delete team member
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/team/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Get team statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/team/stats/overview`);
    return handleResponse(response);
  },

  // Bulk update order
  updateOrder: async (updates) => {
    const response = await fetch(`${API_BASE_URL}/api/team/bulk/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ updates }),
    });
    return handleResponse(response);
  },

  // Get active team members for public display
  getActiveMembers: async () => {
    const response = await fetch(`${API_BASE_URL}/api/team?isActive=true&limit=100`);
    return handleResponse(response);
  },
};