import axios from "./axiosConfig";

const CALLBACK_REQUESTS_API = "/api/callback-requests";

export const callbackRequestApi = {
  // Submit a new callback request
  submit: async (data) => {
    try {
      const response = await axios.post(CALLBACK_REQUESTS_API, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all callback requests (Admin)
  getAll: async (params = {}) => {
    try {
      const response = await axios.get(CALLBACK_REQUESTS_API, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get callback request by ID (Admin)
  getById: async (id) => {
    try {
      const response = await axios.get(`${CALLBACK_REQUESTS_API}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update callback request (Admin)
  update: async (id, data) => {
    try {
      const response = await axios.put(`${CALLBACK_REQUESTS_API}/${id}`, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk update callback requests (Admin)
  bulkUpdate: async (ids, updateData) => {
    try {
      const response = await axios.put(`${CALLBACK_REQUESTS_API}/bulk/update`, {
        ids,
        updateData,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete callback request (Admin)
  delete: async (id) => {
    try {
      const response = await axios.delete(`${CALLBACK_REQUESTS_API}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Bulk delete callback requests (Admin)
  bulkDelete: async (ids) => {
    try {
      const response = await axios.delete(`${CALLBACK_REQUESTS_API}/bulk/delete`, {
        data: { ids },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get callback request statistics (Admin)
  getStats: async () => {
    try {
      const response = await axios.get(`${CALLBACK_REQUESTS_API}/stats/overview`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Utility functions
export const getStatusOptions = () => [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-800 border-blue-200" },
  { value: "in-progress", label: "In Progress", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { value: "contacted", label: "Contacted", color: "bg-green-100 text-green-800 border-green-200" },
];

export const getStatusColor = (status) => {
  const statusColors = {
    new: "bg-blue-100 text-blue-800 border-blue-200",
    "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
    contacted: "bg-green-100 text-green-800 border-green-200",
  };
  return statusColors[status] || statusColors.new;
};

export const formatCallbackRequestData = (request) => {
  return {
    ...request,
    statusLabel: request.status === "new" ? "New" : 
                 request.status === "in-progress" ? "In Progress" : "Contacted",
    formattedDate: new Date(request.createdAt).toLocaleDateString(),
    formattedTime: new Date(request.preferredTime).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};
