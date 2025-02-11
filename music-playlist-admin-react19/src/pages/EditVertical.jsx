// src/pages/EditVertical.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditVertical() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVertical();
  }, [id]);

  const fetchVertical = () => {
    setLoading(true);
    axios
      .get(`http://173.230.134.186:5000/api/verticals/${id}`)
      .then((res) => {
        setLoading(false);
        if (!res.data || !res.data.id) {
          setError('Vertical not found');
          return;
        }
        const v = res.data;
        setName(v.name || '');
        setDescription(v.description || '');
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching vertical');
        setLoading(false);
      });
  };

  const handleSave = () => {
    if (!name) {
      setError('Vertical name is required.');
      return;
    }
    setSaving(true);
    axios
      .put(`http://173.230.134.186:5000/api/verticals/${id}`, {
        name,
        description,
      })
      .then(() => {
        setSaving(false);
        navigate('/verticals');
      })
      .catch((err) => {
        console.error(err);
        setError('Error updating vertical');
        setSaving(false);
      });
  };

  if (loading) return <p>Loading vertical...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Edit Vertical (ID: {id})</h2>
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
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Vertical'}
      </button>
      <hr />
      <button onClick={() => navigate('/verticals')}>Back to Verticals</button>
    </div>
  );
}

export default EditVertical;
