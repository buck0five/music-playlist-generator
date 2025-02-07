// src/pages/ClockMapList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ClockMapList() {
  const [maps, setMaps] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get('http://173.230.134.186:5000/api/clock-maps')
      .then((res) => {
        setMaps(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching clock maps');
      });
  }, []);

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Clock Maps</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Link to="/clock-maps/new">New Clock Map</Link>
      {/* Optionally show "New" page if implemented */}

      {maps.length === 0 && !error && <p>No clock maps found.</p>}

      {maps.length > 0 && (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Map Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {maps.map((m) => (
              <tr key={m.id}>
                <td>{m.id}</td>
                <td>{m.name}</td>
                <td>{m.description}</td>
                <td>
                  <Link to={`/clock-maps/${m.id}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ClockMapList;
