// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://173.230.134.186:5000', 
});

// Include token in request headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
