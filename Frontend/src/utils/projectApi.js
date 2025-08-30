import api from './axiosConfig';

export const projectApi = {
  // Get all projects
  getAllProjects: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      
      const response = await api.get(`/api/admin/projects?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  },

  // Get project by ID
  getProjectById: async (projectId) => {
    try {
      const response = await api.get(`/api/admin/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching project:', error);
      throw error;
    }
  },

  // Create new project
  createProject: async (projectData) => {
    try {
      const response = await api.post('/api/admin/projects', projectData);
      return response.data;
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project
  updateProject: async (projectId, projectData) => {
    try {
      const response = await api.put(`/api/admin/projects/${projectId}`, projectData);
      return response.data;
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  deleteProject: async (projectId) => {
    try {
      const response = await api.delete(`/api/admin/projects/${projectId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Get project statistics overview
  getProjectStats: async () => {
    try {
      const response = await api.get('/api/admin/projects/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching project stats:', error);
      throw error;
    }
  },

  // Get project statistics by status
  getProjectStatusStats: async () => {
    try {
      const response = await api.get('/api/admin/projects/stats/by-status');
      return response.data;
    } catch (error) {
      console.error('Error fetching project status stats:', error);
      throw error;
    }
  },

  // Get project statistics by priority
  getProjectPriorityStats: async () => {
    try {
      const response = await api.get('/api/admin/projects/stats/by-priority');
      return response.data;
    } catch (error) {
      console.error('Error fetching project priority stats:', error);
      throw error;
    }
  }
};
