import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditCart() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [cartName, setCartName] = useState('');
  const [category, setCategory] = useState('');
  const [stationId, setStationId] = useState('');
  const [contentId, setContentId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    axios
      .get(`http://173.230.134.186:5000/api/carts/${id}`)
      .then((res) => {
        const { cart, items } = res.data;
        setCart(cart);
        setItems(items || []);
        setCartName(cart.name);
        setCategory(cart.category || '');
        setStationId(cart.stationId || '');
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching cart');
        console.error(err);
        setLoading(false);
      });
  }, [id, refreshKey]);

  const handleRename = () => {
    axios
      .put(`http://173.230.134.186:5000/api/carts/${id}`, {
        name: cartName,
        category,
        stationId: parseInt(stationId, 10),
      })
      .then(() => {
        setRefreshKey((prev) => prev + 1);
      })
      .catch((err) => {
        setError('Error updating cart');
        console.error(err);
      });
  };

  const handleAddContent = () => {
    if (!contentId) {
      setError('Content ID is required to add');
      return;
    }
    axios
      .post(`http://173.230.134.186:5000/api/carts/${id}/add-content`, {
        contentId: parseInt(contentId, 10),
      })
      .then(() => {
        setError('');
        setContentId('');
        setRefreshKey((prev) => prev + 1);
      })
      .catch((err) => {
        setError('Error adding content to cart');
        console.error(err);
      });
  };

  const handleRemoveItem = (cid) => {
    axios
      .delete(`http://173.230.134.186:5000/api/carts/${id}/remove-content/${cid}`)
      .then(() => {
        setError('');
        setRefreshKey((prev) => prev + 1);
      })
      .catch((err) => {
        setError('Error removing content');
        console.error(err);
      });
  };

  if (loading) return <p style={{ margin: '1rem' }}>Loading cart...</p>;
  if (!cart)
    return <p style={{ color: 'red', margin: '1rem' }}>{error || 'Cart not found'}</p>;

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Edit Cart (ID: {cart.id})</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label>Cart Name: </label>
        <input
          type="text"
          value={cartName}
          onChange={(e) => setCartName(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />

        <label>Category: </label>
        <input
          type="text"
          placeholder="VEN1, NET1, etc."
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />

        <label>Station ID: </label>
        <input
          type="number"
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
          style={{ marginRight: '0.5rem', width: '70px' }}
        />

        <button onClick={handleRename}>Update</button>
      </div>

      <h3>Cart Items</h3>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Content ID to Add: </label>
        <input
          type="number"
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
          style={{ marginRight: '0.5rem', width: '70px' }}
        />
        <button onClick={handleAddContent}>Add</button>
      </div>

      {items.length === 0 && <p>No items in this cart.</p>}
      {items.length > 0 && (
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: 'collapse', marginTop: '0.5rem' }}
        >
          <thead>
            <tr>
              <th>contentId</th>
              <th>Title</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const contentObj = item.Content;
              return (
                <tr key={`${item.cartId}-${item.contentId}`}>
                  <td>{item.contentId}</td>
                  <td>{contentObj ? contentObj.title : 'Unknown'}</td>
                  <td>{contentObj ? contentObj.contentType : 'Unknown'}</td>
                  <td>
                    <button onClick={() => handleRemoveItem(item.contentId)}>
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <hr style={{ margin: '1rem 0' }} />
      <button onClick={() => navigate('/carts')}>Back to Cart List</button>
    </div>
  );
}

export default EditCart;
