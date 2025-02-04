// src/pages/EditSlot.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditSlot() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clockTemplateId, setClockTemplateId] = useState('');
  const [slotType, setSlotType] = useState('');
  const [minuteOffset, setMinuteOffset] = useState('');
  const [cartId, setCartId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://173.230.134.186:5000/api/clock-template-slots/${id}`)
      .then((res) => {
        const slot = res.data;
        setClockTemplateId(slot.clockTemplateId?.toString() || '');
        setSlotType(slot.slotType || '');
        setMinuteOffset(slot.minuteOffset?.toString() || '');
        setCartId(slot.cartId?.toString() || '');
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching slot data');
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      clockTemplateId: parseInt(clockTemplateId, 10),
      slotType,
      minuteOffset: parseInt(minuteOffset, 10),
      cartId: cartId ? parseInt(cartId, 10) : null,
    };

    axios
      .put(`http://173.230.134.186:5000/api/clock-template-slots/${id}`, payload)
      .then((res) => {
        console.log('Updated slot:', res.data);
        navigate('/slots');
      })
      .catch((err) => {
        setError('Error updating slot');
        console.error(err);
      });
  };

  if (loading) {
    return <p>Loading slot data...</p>;
  }

  return (
    <div>
      <h2>Edit Slot (ID: {id})</h2>
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
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditSlot;
