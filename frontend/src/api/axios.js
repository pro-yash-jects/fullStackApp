import axios from 'axios';

// Simple API configuration
// In development: uses Vite proxy (/api -> http://localhost:3000)
// In production: set VITE_API_URL environment variable in Vercel
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Add auth token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
