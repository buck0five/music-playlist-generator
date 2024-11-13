// src/services/api.js

import axios from 'axios';

const api = axios.create({
  baseURL: 'http://173.230.134.186:5000', // Replace with your backend server's URL if different
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Add the token to the headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
