const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
};

// Upload image to Cloudinary
const uploadImage = async (file, folder = 'portfolio') => {
  try {
    const base64 = await fileToBase64(file);
    const response = await fetch(`${API_BASE_URL}/api/cloudinary/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64,
        folder: folder
      }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
};

// Upload multiple images
const uploadMultipleImages = async (files, folder = 'portfolio/gallery') => {
  try {
    const uploadPromises = files.map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Multiple images upload error:', error);
    throw error;
  }
};

// Portfolio API functions
export const portfolioApi = {
  // Create new portfolio project
  create: async (portfolioData) => {
    try {
      let mainImageData = null;
      let galleryImagesData = [];

      // Upload main image if it's a file
      if (portfolioData.mainImage && portfolioData.mainImage instanceof File) {
        mainImageData = await uploadImage(portfolioData.mainImage, 'portfolio/main');
      }

      // Upload gallery images if they are files
      if (portfolioData.galleryImages && portfolioData.galleryImages.length > 0) {
        const fileImages = portfolioData.galleryImages.filter(img => img instanceof File);
        if (fileImages.length > 0) {
          galleryImagesData = await uploadMultipleImages(fileImages, 'portfolio/gallery');
        }
      }

      // Prepare data for API
      const apiData = {
        ...portfolioData,
        mainImage: mainImageData ? mainImageData.secure_url : portfolioData.mainImage,
        mainImagePublicId: mainImageData ? mainImageData.public_id : '',
        galleryImages: [
          ...(portfolioData.galleryImages || []).filter(img => typeof img === 'string'),
          ...galleryImagesData.map(img => img.secure_url)
        ],
        galleryImagePublicIds: [
          ...(portfolioData.galleryImagePublicIds || []),
          ...galleryImagesData.map(img => img.public_id)
        ]
      };

      const response = await fetch(`${API_BASE_URL}/api/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Portfolio creation error:', error);
      throw error;
    }
  },

  // Get all portfolio projects with filtering
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });

      const url = `${API_BASE_URL}/api/portfolio?${queryParams}`;
      
      const response = await fetch(url);
      const data = await handleResponse(response);
      return data;
    } catch (error) {
      console.error('Portfolio fetch error:', error);
      throw error;
    }
  },

  // Get single portfolio project
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/portfolio/${id}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Portfolio fetch error:', error);
      throw error;
    }
  },

  // Get portfolio by slug
  getBySlug: async (slug) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/portfolio/slug/${slug}`);
      return handleResponse(response);
    } catch (error) {
      console.error('Portfolio fetch error:', error);
      throw error;
    }
  },

  // Update portfolio project
  update: async (id, portfolioData) => {
    try {
      let mainImageData = null;
      let galleryImagesData = [];
      let removedGalleryImages = [];
      let removedGalleryImagePublicIds = [];

      // Handle main image update
      if (portfolioData.mainImage && portfolioData.mainImage instanceof File) {
        mainImageData = await uploadImage(portfolioData.mainImage, 'portfolio/main');
      }

      // Handle gallery images update
      if (portfolioData.galleryImages && portfolioData.galleryImages.length > 0) {
        const fileImages = portfolioData.galleryImages.filter(img => img instanceof File);
        if (fileImages.length > 0) {
          galleryImagesData = await uploadMultipleImages(fileImages, 'portfolio/gallery');
        }
      }

      // Handle removed gallery images
      if (portfolioData.removedGalleryImages) {
        removedGalleryImages = portfolioData.removedGalleryImages;
        removedGalleryImagePublicIds = portfolioData.removedGalleryImagePublicIds || [];
      }

      // Prepare data for API
      const apiData = {
        ...portfolioData,
        mainImage: mainImageData ? mainImageData.secure_url : portfolioData.mainImage,
        mainImagePublicId: mainImageData ? mainImageData.public_id : portfolioData.mainImagePublicId,
        galleryImages: [
          ...(portfolioData.galleryImages || []).filter(img => typeof img === 'string'),
          ...galleryImagesData.map(img => img.secure_url)
        ],
        galleryImagePublicIds: [
          ...(portfolioData.galleryImagePublicIds || []),
          ...galleryImagesData.map(img => img.public_id)
        ],
        removedGalleryImages,
        removedGalleryImagePublicIds
      };

      const response = await fetch(`${API_BASE_URL}/api/portfolio/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Portfolio update error:', error);
      throw error;
    }
  },

  // Delete portfolio project
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/portfolio/${id}`, {
        method: 'DELETE',
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Portfolio delete error:', error);
      throw error;
    }
  },

  // Toggle featured status
  toggleFeatured: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/portfolio/${id}/featured`, {
        method: 'PATCH',
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Portfolio featured toggle error:', error);
      throw error;
    }
  },

  // Get portfolio statistics
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/portfolio/stats/overview`);
      return handleResponse(response);
    } catch (error) {
      console.error('Portfolio stats error:', error);
      throw error;
    }
  },

  // Bulk delete
  bulkDelete: async (ids) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/portfolio/bulk/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids }),
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Portfolio bulk delete error:', error);
      throw error;
    }
  }
};

export default portfolioApi;