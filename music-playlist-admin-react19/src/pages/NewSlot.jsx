// src/pages/NewSlot.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewSlot() {
  const navigate = useNavigate();
  const [clockTemplateId, setClockTemplateId] = useState('');
  const [slotType, setSlotType] = useState('');
  const [minuteOffset, setMinuteOffset] = useState('');
  const [cartId, setCartId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      clockTemplateId: parseInt(clockTemplateId, 10),
      slotType,
      minuteOffset: parseInt(minuteOffset, 10),
      cartId: cartId ? parseInt(cartId, 10) : null,
    };

    axios
      .post('http://173.230.134.186:5000/api/clock-template-slots', payload)
      .then((res) => {
        console.log('Created slot:', res.data);
        // Go back to slot list
        navigate('/slots');
      })
      .catch((err) => {
        setError('Error creating slot');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Create New Slot</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Clock Template ID: </label>
          <input
            type="number"
            value={clockTemplateId}
            onChange={(e) => setClockTemplateId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Slot Type: </label>
          <input
            type="text"
            value={slotType}
            onChange={(e) => setSlotType(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Minute Offset: </label>
          <input
            type="number"
            value={minuteOffset}
            onChange={(e) => setMinuteOffset(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cart ID (optional): </label>
          <input
            type="number"
            value={cartId}
            onChange={(e) => setCartId(e.target.value)}
          />
        </div>
        <button type="submit">Create Slot</button>
      </form>
    </div>
  );
}

export default NewSlot;
