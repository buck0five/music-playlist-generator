import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewContentLibrary() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    userId: '',
    verticalId: '',
    libraryType: 'GLOBAL_MUSIC', // Default value
    contentTypes: [],
    isAdLibrary: false,
    adminOnly: false,
    restrictions: {},
    metadata: {}
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      setError('Library name is required.');
      return;
    }
    setSaving(true);

    // Prepare the data
    const submitData = {
      ...formData,
      userId: formData.userId || null,
      verticalId: formData.verticalId || null,
      contentTypes: [], // Default empty array
      restrictions: {}, // Default empty object
    };

    axios
      .post('http://173.230.134.186:5000/api/content-libraries', submitData)
      .then(() => {
        setSaving(false);
        navigate('/content-libraries');
      })
      .catch((err) => {
        console.error(err);
        setSaving(false);
        setError(err.response?.data?.error || 'Error creating library.');
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
            name="name"
            value={formData.name}
            onChange={handleChange}
            style={{ marginLeft: '0.5rem' }}
            required
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Description: </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={{ marginLeft: '0.5rem', width: '300px' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Library Type: </label>
          <select
            name="libraryType"
            value={formData.libraryType}
            onChange={handleChange}
            style={{ marginLeft: '0.5rem' }}
            required
          >
            <option value="GLOBAL_MUSIC">Global Music</option>
            <option value="VERTICAL_MUSIC">Vertical Music</option>
            <option value="VERTICAL_ADS">Vertical Ads</option>
            <option value="STATION_CUSTOM">Station Custom</option>
          </select>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>User ID: </label>
          <input
            type="number"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            style={{ marginLeft: '0.5rem', width: '80px' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Vertical ID: </label>
          <input
            type="number"
            name="verticalId"
            value={formData.verticalId}
            onChange={handleChange}
            style={{ marginLeft: '0.5rem', width: '80px' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            <input
              type="checkbox"
              name="isAdLibrary"
              checked={formData.isAdLibrary}
              onChange={handleChange}
              style={{ marginRight: '0.5rem' }}
            />
            Is Ad Library
          </label>
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>
            <input
              type="checkbox"
              name="adminOnly"
              checked={formData.adminOnly}
              onChange={handleChange}
              style={{ marginRight: '0.5rem' }}
            />
            Admin Only
          </label>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create Library'}
        </button>
      </form>
    </div>
  );
}

export default NewContentLibrary;
