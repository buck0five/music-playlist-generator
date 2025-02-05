import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewCart() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [stationId, setStationId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setError('Cart name is required');
      return;
    }
    if (!stationId) {
      setError('stationId is required');
      return;
    }

    axios
      .post('http://173.230.134.186:5000/api/carts', { name, category, stationId: parseInt(stationId, 10) })
      .then(() => {
        navigate('/carts');
      })
      .catch((err) => {
        setError('Error creating cart');
        console.error(err);
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Create New Cart</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Cart Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Cart Category: </label>
          <input
            type="text"
            placeholder="e.g. VEN1, NET1..."
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Station ID: </label>
          <input
            type="number"
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            required
          />
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default NewCart;
