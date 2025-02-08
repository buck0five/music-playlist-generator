// src/pages/NewContentLibrary.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewContentLibrary() {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [verticalId, setVerticalId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setError('Library name is required.');
      return;
    }
    setSaving(true);
    axios
      .post('http://173.230.134.186:5000/api/content-libraries', {
        name,
        description,
        userId: userId || null,
        verticalId: verticalId || null,
      })
      .then(() => {
        setSaving(false);
        navigate('/content-libraries');
      })
      .catch((err) => {
        console.error(err);
        setSaving(false);
        setError('Error creating library.');
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Create New Content Library</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Library Name: </label>
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
            style={{ marginLeft: '0.5rem', width: '300px' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>User ID: </label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ marginLeft: '0.5rem', width: '80px' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Vertical ID: </label>
          <input
            type="number"
            value={verticalId}
            onChange={(e) => setVerticalId(e.target.value)}
            style={{ marginLeft: '0.5rem', width: '80px' }}
          />
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create Library'}
        </button>
      </form>
    </div>
  );
}

export default NewContentLibrary;
