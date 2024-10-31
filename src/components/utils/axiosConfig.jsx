import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Adjust this to match your backend URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userAuthToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;