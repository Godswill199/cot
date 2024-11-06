import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper function to validate token
const isValidToken = (token) => {
  return token && typeof token === 'string' && token.startsWith('Bearer ');
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userAuthToken');
    if (token) {
      config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    } else {
      console.warn('No auth token found');
      // Only remove token if not a login request
      if (!config.url.includes('/auth/login')) {
        localStorage.removeItem('userAuthToken');
      }
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Authentication error:', error.response?.data?.message);
      // Clear auth data
      localStorage.removeItem('userAuthToken');
      localStorage.removeItem('user');
      
      // Redirect to login if on admin pages
      if (window.location.pathname.includes('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;