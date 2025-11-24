import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://localhost:5000/api';

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

/**
 * Resource API functions
 */
export const resourceAPI = {
  // Get approved resources with filters
  getApproved: (params = {}) => api.get('/resource/approved', { params }),
  
  // Get single resource
  getById: (id) => api.get(`/resource/${id}`),
  
  // Download resource
  download: (id) => api.get(`/resource/download/${id}`),
  
  // Upload new resource
  upload: (formData) => api.post('/resource/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  
  // Get user's uploads
  getMyUploads: (params = {}) => api.get('/resource/my/uploads', { params }),
  
  // Admin functions
  adminUpload: (formData) => api.post('/resource/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getPending: (params = {}) => api.get('/resource/admin/pending', { params }),
  approve: (id, remark = '') => api.put(`/resource/approve/${id}`, { remark }),
  reject: (id, remark) => api.put(`/resource/reject/${id}`, { remark }),
  delete: (id) => api.delete(`/resource/${id}`),
  getStats: () => api.get('/resource/admin/stats'),
};

/**
 * Announcement API functions
 */
export const announcementAPI = {
  getAll: () => api.get('/announcements'),
  create: (title, content) => api.post('/announcements', { title, content }),
  createWithFile: (formData) => api.post('/announcements/with-file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/announcements/${id}`),
};

/**
 * Auth API functions
 */
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  forgotPassword: (email) => api.post('/auth/forgot', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset/${token}`, { password }),
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
};

/**
 * Helper function to handle API errors
 */
export const handleApiError = (error) => {
  const message = error.response?.data?.message || 'Something went wrong';
  toast.error(message);
  console.error('API Error:', error);
  return message;
};

export default api;