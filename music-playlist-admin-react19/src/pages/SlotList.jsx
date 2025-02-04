// src/pages/SlotList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

function SlotList() {
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Optional: fetch only slots for a specific clockTemplateId if passed
  const clockTemplateId = searchParams.get('clockTemplateId') || '';

  useEffect(() => {
    let url = 'http://173.230.134.186:5000/api/clock-template-slots';
    if (clockTemplateId) {
      url += `?clockTemplateId=${clockTemplateId}`;
    }

    axios
      .get(url)
      .then((res) => {
        setSlots(res.data);
      })
      .catch((err) => {
        setError('Error fetching slots');
        console.error(err);
      });
  }, [refreshKey, clockTemplateId]);

  const handleDelete = (id) => {
    axios
      .delete(`http://173.230.134.186:5000/api/clock-template-slots/${id}`)
      .then((res) => {
        console.log('Deleted slot:', res.data);
        setRefreshKey((prev) => prev + 1);
      })
      .catch((err) => {
        setError('Error deleting slot');
        console.error(err);
      });
  };

  const goToNew = () => {
    navigate('/slots/new');
  };

  const goToEdit = (id) => {
    navigate(`/slots/${id}/edit`);
  };

  return (
    <div>
      <h2>Clock Template Slots</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={goToNew}>New Slot</button>

      {slots.length === 0 && !error && <p>No slots found.</p>}

      {slots.length > 0 && (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Clock Template ID</th>
              <th>Slot Type</th>
              <th>Minute Offset</th>
              <th>Cart ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id}>
                <td>{slot.id}</td>
                <td>{slot.clockTemplateId}</td>
                <td>{slot.slotType}</td>
                <td>{slot.minuteOffset}</td>
                <td>{slot.cartId || 'None'}</td>
                <td>
                  <button onClick={() => goToEdit(slot.id)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(slot.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SlotList;
