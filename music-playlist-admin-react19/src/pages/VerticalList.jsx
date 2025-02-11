// src/pages/VerticalList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function VerticalList() {
  const [verticals, setVerticals] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVerticals();
  }, []);

  const fetchVerticals = () => {
    setError('');
    axios
      .get('http://173.230.134.186:5000/api/verticals')
      .then((res) => {
        setVerticals(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching verticals');
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Verticals</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Link to="/verticals/new">Create New Vertical</Link>

      {verticals.length === 0 && !error && <p>No verticals found.</p>}

      {verticals.length > 0 && (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Vertical Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {verticals.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.name}</td>
                <td>
                  <Link to={`/verticals/${v.id}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default VerticalList;
