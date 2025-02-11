// src/pages/NewVertical.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewVertical() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setError('Vertical name is required.');
      return;
    }
    setSaving(true);
    axios
      .post('http://173.230.134.186:5000/api/verticals', { name, description })
      .then(() => {
        setSaving(false);
        navigate('/verticals');
      })
      .catch((err) => {
        console.error(err);
        setSaving(false);
        setError('Error creating vertical');
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Create New Vertical</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Vertical Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Description: </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create Vertical'}
        </button>
      </form>
    </div>
  );
}

export default NewVertical;
