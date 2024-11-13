// src/components/Register.js

import React, { useState } from 'react';
import api from '../services/api';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'end_user', // Default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! Please log in.');
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input name="username" type="text" value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} required />
        </div>
        {/* Uncomment if you want to allow role selection during registration */}
        {/* <div>
          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="end_user">End User</option>
            <option value="admin">Admin</option>
          </select>
        </div> */}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
