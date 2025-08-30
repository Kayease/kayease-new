import api from './axiosConfig';

export const jobApplicationApi = {
  // Submit a new job application
  submit: async (formData) => {
    try {
      const response = await api.post('/api/job-applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error submitting job application:', error);
      throw error;
    }
  },

  // Get all job applications (Admin only)
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/api/job-applications', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching job applications:', error);
      throw error;
    }
  },

  // Get single job application by ID
  getById: async (id) => {
    try {
      const response = await api.get(`/api/job-applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching job application:', error);
      throw error;
    }
  },

  // Update application status (Admin only)
  updateStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/api/job-applications/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Add admin note to application
  addNote: async (id, noteData) => {
    try {
      const response = await api.post(`/api/job-applications/${id}/notes`, noteData);
      return response.data;
    } catch (error) {
      console.error('Error adding note:', error);
      throw error;
    }
  },

  // Add communication to application
  addCommunication: async (id, communicationData) => {
    try {
      const response = await api.post(`/api/job-applications/${id}/communications`, communicationData);
      return response.data;
    } catch (error) {
      console.error('Error adding communication:', error);
      throw error;
    }
  },

  // Send custom email to applicant
  sendCustomEmail: async (emailData) => {
    try {
      const response = await api.post('/api/job-applications/send-email', emailData);
      return response.data;
    } catch (error) {
      console.error('Error sending custom email:', error);
      throw error;
    }
  },

  // Get application statistics (Admin only)
  getStats: async () => {
    try {
      const response = await api.get('/api/job-applications/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching application statistics:', error);
      throw error;
    }
  },

  // Delete job application (Admin only)
  delete: async (id) => {
    try {
      const response = await api.delete(`/api/job-applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting job application:', error);
      throw error;
    }
  },

  // Helper function to format application status
  formatStatus: (status) => {
    const statusMap = {
      pending: { label: 'Pending', color: 'yellow', icon: 'Clock' },
      reviewing: { label: 'Under Review', color: 'blue', icon: 'Eye' },
      shortlisted: { label: 'Shortlisted', color: 'purple', icon: 'Star' },
      interview_scheduled: { label: 'Interview Scheduled', color: 'orange', icon: 'Calendar' },
      interviewed: { label: 'Interviewed', color: 'indigo', icon: 'Users' },
      selected: { label: 'Selected', color: 'green', icon: 'CheckCircle' },
      rejected: { label: 'Rejected', color: 'red', icon: 'XCircle' },
      withdrawn: { label: 'Withdrawn', color: 'gray', icon: 'Minus' }
    };

    return statusMap[status] || { label: status, color: 'gray', icon: 'Circle' };
  },

  // Helper function to format experience level
  formatExperience: (experience) => {
    const experienceMap = {
      '0-1 years': 'Entry Level',
      '1-3 years': 'Junior',
      '3-5 years': 'Mid-Level',
      '5-10 years': 'Senior',
      '10+ years': 'Expert'
    };

    return experienceMap[experience] || experience;
  },

  // Helper function to format notice period
  formatNoticePeriod: (noticePeriod) => {
    if (noticePeriod === 'Immediate') return 'Available Immediately';
    return `${noticePeriod} Notice Period`;
  },

  // Helper function to validate application data
  validateApplication: (data) => {
    const errors = {};

    // Required fields validation
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone', 'jobId', 'jobTitle',
      'experience', 'currentLocation', 'availableFrom', 'noticePeriod', 'coverLetter'
    ];

    requiredFields.forEach(field => {
      if (!data[field] || data[field].toString().trim() === '') {
        errors[field] = `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} is required`;
      }
    });

    // Email validation
    if (data.email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (data.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    // URL validations
    const urlFields = ['portfolioUrl', 'linkedinUrl', 'githubUrl'];
    urlFields.forEach(field => {
      if (data[field] && !/^https?:\/\/.+/.test(data[field])) {
        errors[field] = `Please enter a valid URL for ${field.replace('Url', '')}`;
      }
    });

    // Cover letter length validation
    if (data.coverLetter && data.coverLetter.length < 50) {
      errors.coverLetter = 'Cover letter must be at least 50 characters long';
    }

    // Consent validation
    if (!data.consentToProcess) {
      errors.consentToProcess = 'Consent to process data is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};