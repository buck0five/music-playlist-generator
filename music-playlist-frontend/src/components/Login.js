// src/components/Login.js

import React, { useState } from 'react';
import api from '../services/api';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;

      // Store the token
      localStorage.setItem('token', token);

      // Store the user info, including role
      localStorage.setItem('user', JSON.stringify(user));

      // Notify the parent component
      onLogin(user);
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      alert('Invalid email or password.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
