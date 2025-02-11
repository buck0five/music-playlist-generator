// src/pages/NewUser.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function NewUser() {
  const navigate = useNavigate();
  const location = useLocation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('store');
  const [parentUserId, setParentUserId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // On mount, parse "?parentId=xxx" if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pId = params.get('parentId');
    if (pId) {
      setParentUserId(pId);
    }
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setError('User name is required');
      return;
    }
    setSaving(true);

    axios
      .post('http://173.230.134.186:5000/api/users', {
        name,
        email: email || null,
        role: role || 'store',
        parentUserId: parentUserId ? parseInt(parentUserId, 10) : null,
      })
      .then(() => {
        setSaving(false);
        navigate('/users');
      })
      .catch((err) => {
        console.error(err);
        setSaving(false);
        setError('Error creating user');
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Create New User</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Role: </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="store">store</option>
            <option value="chain">chain</option>
            <option value="admin">admin</option>
          </select>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Parent User ID: </label>
          <input
            type="number"
            value={parentUserId}
            onChange={(e) => setParentUserId(e.target.value)}
            style={{ marginLeft: '0.5rem', width: '80px' }}
          />
          <span style={{ marginLeft: '0.5rem' }}>
            (Leave blank if top-level user)
          </span>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}

export default NewUser;
