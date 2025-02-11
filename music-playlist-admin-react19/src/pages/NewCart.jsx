// src/pages/NewCart.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function NewCart() {
  const { stationId } = useParams();
  const navigate = useNavigate();

  const [cartName, setCartName] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cartName) {
      setError('Cart name is required.');
      return;
    }
    setSaving(true);

    axios
      .post('http://173.230.134.186:5000/api/carts', {
        name: cartName,
        category: category || null,
        stationId: stationId, // tie to this station
      })
      .then(() => {
        setSaving(false);
        navigate(`/stations/${stationId}/carts`);
      })
      .catch((err) => {
        console.error(err);
        setError('Error creating cart.');
        setSaving(false);
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Create New Cart for Station #{stationId}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Cart Name: </label>
          <input
            type="text"
            value={cartName}
            onChange={(e) => setCartName(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Category: </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create Cart'}
        </button>
      </form>

      <hr />
      <button onClick={() => navigate(`/stations/${stationId}/carts`)}>
        Back to Carts
      </button>
    </div>
  );
}

export default NewCart;
