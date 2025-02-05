// src/pages/CartList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CartList() {
  const [carts, setCarts] = useState([]);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://173.230.134.186:5000/api/carts')
      .then((res) => {
        setCarts(res.data);
      })
      .catch((err) => {
        setError('Error fetching carts');
        console.error(err);
      });
  }, [refreshKey]);

  const goToNew = () => {
    navigate('/carts/new');
  };

  const goToEdit = (id) => {
    navigate(`/carts/${id}/edit`);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://173.230.134.186:5000/api/carts/${id}`)
      .then(() => {
        setRefreshKey((prev) => prev + 1);
      })
      .catch((err) => {
        setError('Error deleting cart');
        console.error(err);
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>All Carts</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={goToNew} style={{ marginBottom: '1rem' }}>
        New Cart
      </button>

      {carts.length === 0 && !error && <p>No carts found.</p>}
      {carts.length > 0 && (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Cart Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {carts.map((cart) => (
              <tr key={cart.id}>
                <td>{cart.id}</td>
                <td>{cart.name}</td>
                <td>
                  <button onClick={() => goToEdit(cart.id)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(cart.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CartList;
