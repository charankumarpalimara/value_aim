import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.valueaim.com/api';

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
      // Don't redirect to login if we're already on login page, if it's a login attempt, or if it's a public endpoint
      const isLoginPage = window.location.pathname === '/login';
      const isLoginAttempt = error.config?.url?.includes('/auth/login');
      const isPublicEndpoint = error.config?.url?.includes('/contact') || 
                               error.config?.url?.includes('/auth/register') ||
                               error.config?.url?.includes('/auth/check-email');
      
      if (!isLoginPage && !isLoginAttempt && !isPublicEndpoint) {
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('tokenExpiration');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== Auth APIs ====================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    // If userData is FormData, we need to override the Content-Type header
    const config = {};
    if (userData instanceof FormData) {
      config.headers = {
        'Content-Type': 'multipart/form-data',
      };
    }
    
    const response = await api.post('/auth/register', userData, config);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      // Store token expiration date (7 days from now)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    }
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.success && response.data.data.token) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data));
      // Store token expiration date (7 days from now)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      localStorage.setItem('tokenExpiration', expirationDate.toISOString());
    }
    return response.data;
  },

  // Check if email exists
  checkEmail: async (email) => {
    const response = await api.post('/auth/check-email', { email });
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
    localStorage.removeItem('tokenExpiration');
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
  },

  // Delete all services
  deleteAll: async () => {
    const response = await api.delete('/service/all');
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

// ==================== Suggestion APIs ====================

export const suggestionAPI = {
  // Create suggestion with optional file attachment
  create: async (formData) => {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    const response = await api.post('/suggestions', formData, config);
    return response.data;
  },

  // Get all user suggestions
  getAll: async () => {
    const response = await api.get('/suggestions');
    return response.data;
  },

  // Get single suggestion
  get: async (id) => {
    const response = await api.get(`/suggestions/${id}`);
    return response.data;
  },

  // Delete suggestion
  delete: async (id) => {
    const response = await api.delete(`/suggestions/${id}`);
    return response.data;
  },

  // Get all suggestions (Admin only - for future use)
  getAllAdmin: async (params = {}) => {
    const response = await api.get('/suggestions/admin/all', { params });
    return response.data;
  },

  // Update suggestion status (Admin only - for future use)
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/suggestions/${id}/status`, statusData);
    return response.data;
  }
};

// ==================== Contact APIs ====================

export const contactAPI = {
  // Create contact message (public endpoint)
  create: async (contactData) => {
    const response = await api.post('/contact', contactData);
    return response.data;
  },

  // Get all contacts (Admin only)
  getAll: async (params = {}) => {
    const response = await api.get('/contact', { params });
    return response.data;
  },

  // Get single contact (Admin only)
  get: async (id) => {
    const response = await api.get(`/contact/${id}`);
    return response.data;
  },

  // Update contact status (Admin only)
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/contact/${id}/status`, statusData);
    return response.data;
  },

  // Delete contact (Admin only)
  delete: async (id) => {
    const response = await api.delete(`/contact/${id}`);
    return response.data;
  }
};

export default api;

