import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewCart() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      setError('Cart name is required');
      return;
    }

    axios
      .post('/api/carts', { name })
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
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default NewCart;
