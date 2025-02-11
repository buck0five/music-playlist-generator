// src/pages/StationCartsList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';

function StationCartsList() {
  const { stationId } = useParams();
  const navigate = useNavigate();

  const [carts, setCarts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCarts();
  }, [stationId]);

  const fetchCarts = () => {
    setError('');
    axios
      .get(`http://173.230.134.186:5000/api/carts?stationId=${stationId}`)
      .then((res) => {
        setCarts(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching carts');
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>All Carts for Station #{stationId}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Link to create new cart for this station */}
      <button
        onClick={() => navigate(`/stations/${stationId}/carts/new`)}
        style={{ marginBottom: '1rem' }}
      >
        Create New Cart
      </button>

      {carts.length === 0 && !error && <p>No carts found.</p>}

      {carts.length > 0 && (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cart Name</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => (
              <tr key={cart.id}>
                <td>{cart.id}</td>
                <td>{cart.name}</td>
                <td>{cart.category || ''}</td>
                <td>
                  <Link to={`/carts/${cart.id}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />
      <button onClick={() => navigate(`/stations/${stationId}/edit`)}>
        Back to Edit Station
      </button>
    </div>
  );
}

export default StationCartsList;
