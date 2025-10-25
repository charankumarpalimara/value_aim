import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://value-aim-backend.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== Auth APIs ====================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
    }
    return response.data;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update onboarding status
  updateOnboarding: async (data) => {
    const response = await api.put('/auth/onboarding', data);
    return response.data;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }
};

// ==================== Company APIs ====================

export const companyAPI = {
  // Create or update company details
  createOrUpdate: async (companyData) => {
    const response = await api.post('/company', companyData);
    return response.data;
  },

  // Get company details
  get: async () => {
    const response = await api.get('/company');
    return response.data;
  },

  // Delete company details
  delete: async () => {
    const response = await api.delete('/company');
    return response.data;
  }
};

// ==================== Service APIs ====================

export const serviceAPI = {
  // Create service
  create: async (serviceData) => {
    const response = await api.post('/service', serviceData);
    return response.data;
  },

  // Get all services
  getAll: async () => {
    const response = await api.get('/service');
    return response.data;
  },

  // Get single service
  get: async (id) => {
    const response = await api.get(`/service/${id}`);
    return response.data;
  },

  // Update service
  update: async (id, serviceData) => {
    const response = await api.put(`/service/${id}`, serviceData);
    return response.data;
  },

  // Delete service
  delete: async (id) => {
    const response = await api.delete(`/service/${id}`);
    return response.data;
  },

  // Bulk create/update services
  bulkCreate: async (services) => {
    const response = await api.post('/service/bulk', { services });
    return response.data;
  }
};

// ==================== User APIs ====================

export const userAPI = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/user/profile');
    return response.data;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await api.put('/user/profile', userData);
    if (response.data.success) {
      // Update local storage
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...currentUser, ...response.data.data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return response.data;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await api.put('/user/password', passwordData);
    return response.data;
  },

  // Update user plan
  updatePlan: async (plan) => {
    const response = await api.put('/user/plan', { plan });
    return response.data;
  }
};

export default api;

