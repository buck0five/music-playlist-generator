// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Adjust the baseURL to your backend URL
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
