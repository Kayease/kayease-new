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

export const contactApi = {
  // Submit contact form
  submit: async (contactData) => {
    const response = await retryFetch(`${API_BASE_URL}/api/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    });
    return handleResponse(response);
  },

  // Get all contacts with optional filters (Admin only)
  getAll: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const url = `${API_BASE_URL}/api/contacts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await retryFetch(url);
    return handleResponse(response);
  },

  // Get contact by ID (Admin only)
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`);
    return handleResponse(response);
  },

  // Update contact (Admin only)
  update: async (id, updateData) => {
    const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    return handleResponse(response);
  },

  // Mark contact as read/unread (Admin only)
  markAsRead: async (id, isRead = true) => {
    const response = await fetch(`${API_BASE_URL}/api/contacts/${id}/read`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isRead }),
    });
    return handleResponse(response);
  },

  // Delete contact (Admin only)
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/api/contacts/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  // Get contact statistics (Admin only)
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/api/contacts/stats/overview`);
    return handleResponse(response);
  },

  // Bulk update contacts (Admin only)
  bulkUpdate: async (ids, updateData) => {
    const response = await fetch(`${API_BASE_URL}/api/contacts/bulk/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids, updateData }),
    });
    return handleResponse(response);
  },

  // Bulk delete contacts (Admin only)
  bulkDelete: async (ids) => {
    const response = await fetch(`${API_BASE_URL}/api/contacts/bulk/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ids }),
    });
    return handleResponse(response);
  },

  // Get contact status options
  getStatusOptions: () => [
    { value: 'new', label: 'New', color: 'bg-blue-100 text-blue-800' },
    { value: 'contacted', label: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'in-progress', label: 'In Progress', color: 'bg-purple-100 text-purple-800' },
    { value: 'closed', label: 'Closed', color: 'bg-green-100 text-green-800' },
    { value: 'archived', label: 'Archived', color: 'bg-gray-100 text-gray-800' }
  ],

  // Get subject options
  getSubjectOptions: () => [
    { value: 'hire-us', label: 'Hire Us' },
    { value: 'join-us', label: 'Join Us' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'general-inquiry', label: 'General Inquiry' },
    { value: 'support', label: 'Support' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'other', label: 'Other' }
  ],

  // Helper function to format contact data
  formatContactData: (contact) => {
    const subjectLabels = {
      'hire-us': 'Hire Us',
      'join-us': 'Join Us',
      'partnership': 'Partnership',
      'general-inquiry': 'General Inquiry',
      'support': 'Support',
      'feedback': 'Feedback',
      'other': 'Other'
    };

    return {
      ...contact,
      subjectLabel: subjectLabels[contact.subject] || contact.subject,
      formattedDate: new Date(contact.createdAt).toLocaleDateString(),
      formattedDateTime: new Date(contact.createdAt).toLocaleString()
    };
  }
};

export default contactApi;