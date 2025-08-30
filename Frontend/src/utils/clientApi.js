// Client API utility functions
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL + '/api';

class ClientAPI {
  // Upload image to Cloudinary
  static async uploadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = reader.result;
          const response = await fetch(`${API_BASE_URL}/cloudinary/upload`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: base64,
              folder: 'clients',
              publicId: `client_${Date.now()}`
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            resolve({
              url: data.secure_url,
              publicId: data.public_id
            });
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to upload image');
          }
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  // Delete image from Cloudinary
  static async deleteImage(publicId) {
    try {
      const response = await fetch(`${API_BASE_URL}/cloudinary/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete image');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }

  // Create a new client
  static async createClient(clientData) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create client');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }

  // Get all clients with filters
  static async getClients(filters = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(key, value);
        }
      });

      const response = await fetch(`${API_BASE_URL}/clients?${queryParams}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch clients');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching clients:', error);
      throw error;
    }
  }

  // Get a single client by ID
  static async getClient(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch client');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching client:', error);
      throw error;
    }
  }

  // Update an existing client
  static async updateClient(id, clientData) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update client');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  // Delete a client
  static async deleteClient(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete client');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }



  // Get client statistics
  static async getStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/clients/stats/overview`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch statistics');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }

  // Validate client data before submission
  static validateClientData(data) {
    const errors = {};

    // Required fields
    if (!data.name?.trim()) {
      errors.name = 'Client name is required';
    } else if (data.name.length > 100) {
      errors.name = 'Client name must be less than 100 characters';
    }

    if (!data.logo && !data.logoPreview) {
      errors.logo = 'Client logo is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Format client data for API submission
  static formatClientData(formData) {
    return {
      name: formData.name?.trim(),
      logo: formData.logoPreview || formData.logo,
      logoPublicId: formData.logoPublicId || ''
    };
  }

  // Validate file before upload
  static validateFile(file) {
    const errors = [];

    // Check file type
    if (!file.type.startsWith('image/')) {
      errors.push('Please select a valid image file');
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      errors.push('Image file size must be less than 5MB');
    }

    // Check file format
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedFormats.includes(file.type)) {
      errors.push('Please select a JPEG, PNG, GIF, or WebP image');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export both default and named export for consistency
export const clientApi = {
  uploadImage: ClientAPI.uploadImage,
  deleteImage: ClientAPI.deleteImage,
  createClient: ClientAPI.createClient,
  getClients: ClientAPI.getClients,
  getClient: ClientAPI.getClient,
  updateClient: ClientAPI.updateClient,
  deleteClient: ClientAPI.deleteClient,
  getStats: ClientAPI.getStatistics, // Alias for consistency
  getStatistics: ClientAPI.getStatistics,
  validateClientData: ClientAPI.validateClientData,
  formatClientData: ClientAPI.formatClientData,
  validateFile: ClientAPI.validateFile
};

export default ClientAPI;