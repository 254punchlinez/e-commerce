import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
API.interceptors.request.use(
  (config) => {
    // You can add auth tokens here if using localStorage instead of cookies
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
const authAPI = {
  // Register user
  register: (userData) => API.post('/auth/register', userData),

  // Login user
  login: (credentials) => API.post('/auth/login', credentials),

  // Logout user
  logout: () => API.get('/auth/logout'),

  // Get user profile
  getProfile: () => API.get('/auth/me'),

  // Update user profile
  updateProfile: (userData) => API.put('/auth/me/update', userData),

  // Update password
  updatePassword: (passwordData) => API.put('/auth/password/update', passwordData),

  // Forgot password
  forgotPassword: (email) => API.post('/auth/password/forgot', { email }),

  // Reset password
  resetPassword: (token, passwordData) => API.put(`/auth/password/reset/${token}`, passwordData),

  // Add address
  addAddress: (addressData) => API.post('/auth/address/add', addressData),

  // Update address
  updateAddress: (addressId, addressData) => API.put(`/auth/address/${addressId}`, addressData),

  // Delete address
  deleteAddress: (addressId) => API.delete(`/auth/address/${addressId}`),
};

export default authAPI;