import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token } = response.data;
        localStorage.setItem('token', token);
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Resource API functions
export const resourceAPI = {
  getApproved: (params = {}) => api.get('/resource/approved', { params }),
  getById: (id) => api.get(`/resource/${id}`),
  upload: (formData) => api.post('/resource/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getMyUploads: (params = {}) => api.get('/resource/my/uploads', { params }),
  
  // Admin functions
  getPending: async (params = {}) => {
    try {
      console.log('API: Requesting pending resources...');
      const response = await api.get('/resource/admin/pending', { params });
      console.log('API: Pending resources response:', response.data);
      return response;
    } catch (error) {
      console.error('API: Error getting pending resources:', error.response?.data || error.message);
      throw error;
    }
  },
  approve: (id, remark = '') => api.put(`/resource/approve/${id}`, { remark }),
  reject: (id, remark) => api.put(`/resource/reject/${id}`, { remark }),
  delete: (id) => api.delete(`/resource/${id}`),
  getStats: () => api.get('/resource/admin/stats')
};

// Announcement API functions
export const announcementAPI = {
  getAll: () => api.get('/announcements'),
  create: (formData) => api.post('/announcements', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/announcements/${id}`)
};

// Auth API functions
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password })
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  const message = error.response?.data?.message || 'Something went wrong';
  toast.error(message);
  return message;
};

export default api;