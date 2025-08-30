import api from './axiosConfig';

export const userApi = {
  // Get all users
  getAllUsers: async () => {
    try {
      const response = await api.get('/api/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await api.get(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData) => {
    try {
      const response = await api.post('/api/admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/api/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Replace roles for a user
  updateUserRoles: async (userId, roles) => {
    try {
      const response = await api.put(`/api/admin/users/${userId}/roles`, { roles });
      return response.data;
    } catch (error) {
      console.error('Error updating user roles:', error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/api/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Promote user to admin
  promoteToAdmin: async (userId) => {
    try {
      const response = await api.put(`/api/admin/users/${userId}/promote`);
      return response.data;
    } catch (error) {
      console.error('Error promoting user:', error);
      throw error;
    }
  },

  // Demote admin to user
  demoteToUser: async (userId) => {
    try {
      const response = await api.put(`/api/admin/users/${userId}/demote`);
      return response.data;
    } catch (error) {
      console.error('Error demoting user:', error);
      throw error;
    }
  },

  // Toggle user status (activate/deactivate)
  toggleUserStatus: async (userId) => {
    try {
      const response = await api.put(`/api/admin/users/${userId}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling user status:', error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await api.get('/api/admin/users/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  },

  // Get all roles
  getAllRoles: async () => {
    try {
      const response = await api.get('/api/admin/roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  },

  // Get new users (registered in last 7 days)
  getNewUsers: async () => {
    try {
      const response = await api.get('/api/admin/users/new');
      return response.data;
    } catch (error) {
      console.error('Error fetching new users:', error);
      throw error;
    }
  }
}; 