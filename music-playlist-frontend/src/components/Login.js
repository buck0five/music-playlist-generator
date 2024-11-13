// src/components/Login.js

import React, { useState } from 'react';
import api from '../services/api';

function Login({ setAuthToken, setUserRole }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      const { token } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', token);
      setAuthToken(token);

      // Decode token to get user role
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);

      alert('Login successful!');
      // Redirect to dashboard
      window.location.href = payload.role === 'admin' ? '/admin' : '/dashboard';
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
