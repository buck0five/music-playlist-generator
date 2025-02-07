// src/pages/NewClockMap.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewClockMap() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setError('Name is required');
      return;
    }
    setSaving(true);
    // If no proxy, use the full URL:
    axios
      .post('http://173.230.134.186:5000/api/clock-maps', { name, description })
      .then((res) => {
        setSaving(false);
        navigate(`/clock-maps/${res.data.id}/edit`);
      })
      .catch((err) => {
        setSaving(false);
        console.error(err);
        setError('Error creating clock map');
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Create New Clock Map</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Map Name:</label>
          <input
            type="text"
            style={{ marginLeft: '0.5rem' }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Description:</label>
          <input
            type="text"
            style={{ marginLeft: '0.5rem' }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create'}
        </button>
      </form>
    </div>
  );
}

export default NewClockMap;
