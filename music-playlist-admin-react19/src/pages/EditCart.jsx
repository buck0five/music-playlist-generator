// src/pages/EditCart.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditCart() {
  const { id } = useParams(); // cartId
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [cartName, setCartName] = useState('');
  const [category, setCategory] = useState('');
  const [stationId, setStationId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fields for adding a new pivot item
  const [newContentId, setNewContentId] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newDaysOfWeek, setNewDaysOfWeek] = useState('');
  const [newStartHour, setNewStartHour] = useState('');
  const [newEndHour, setNewEndHour] = useState('');

  // For editing an existing pivot item
  const [editingItemId, setEditingItemId] = useState(null);
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editDaysOfWeek, setEditDaysOfWeek] = useState('');
  const [editStartHour, setEditStartHour] = useState('');
  const [editEndHour, setEditEndHour] = useState('');

  useEffect(() => {
    fetchCartData();
  }, [id, refreshKey]);

  const fetchCartData = () => {
    setLoading(true);
    axios
      .get(`http://173.230.134.186:5000/api/carts/${id}`)
      .then((res) => {
        const { cart, items } = res.data;
        if (!cart) {
          setError('Cart not found');
          setLoading(false);
          return;
        }
        setCart(cart);
        setItems(items || []);
        setCartName(cart.name);
        setCategory(cart.category || '');
        setStationId(cart.stationId || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching cart');
        setLoading(false);
      });
  };

  // Save the cart (name/category/station)
  const handleSaveCart = () => {
    axios
      .put(`http://173.230.134.186:5000/api/carts/${id}`, {
        name: cartName,
        category,
        stationId,
      })
      .then(() => {
        setRefreshKey((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
        setError('Error updating cart');
      });
  };

  // ADD new content to cart with scheduling
  const handleAddContent = () => {
    if (!newContentId) {
      setError('Content ID is required to add');
      return;
    }
    setError('');
    axios
      .post(`http://173.230.134.186:5000/api/carts/${id}/add-content`, {
        contentId: parseInt(newContentId, 10),
        startDate: newStartDate || null,
        endDate: newEndDate || null,
        daysOfWeek: newDaysOfWeek || null,
        startHour: newStartHour !== '' ? parseInt(newStartHour, 10) : null,
        endHour: newEndHour !== '' ? parseInt(newEndHour, 10) : null,
      })
      .then(() => {
        // clear fields
        setNewContentId('');
        setNewStartDate('');
        setNewEndDate('');
        setNewDaysOfWeek('');
        setNewStartHour('');
        setNewEndHour('');
        setRefreshKey((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
        setError('Error adding content');
      });
  };

  // Remove content from cart
  const handleRemoveItem = (contentId) => {
    axios
      .delete(`http://173.230.134.186:5000/api/carts/${id}/remove-content/${contentId}`)
      .then(() => {
        setError('');
        setRefreshKey((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
        setError('Error removing content from cart');
      });
  };

  // Begin editing an existing pivot item
  const startEditingItem = (item) => {
    setEditingItemId(item.id);
    setEditStartDate(item.startDate || '');
    setEditEndDate(item.endDate || '');
    setEditDaysOfWeek(item.daysOfWeek || '');
    setEditStartHour(item.startHour === null ? '' : item.startHour.toString());
    setEditEndHour(item.endHour === null ? '' : item.endHour.toString());
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingItemId(null);
    setEditStartDate('');
    setEditEndDate('');
    setEditDaysOfWeek('');
    setEditStartHour('');
    setEditEndHour('');
  };

  // Save pivot item scheduling
  const handleSaveItem = () => {
    if (!editingItemId) return;
    axios
      .put(`http://173.230.134.186:5000/api/carts/${id}/update-item/${editingItemId}`, {
        startDate: editStartDate || null,
        endDate: editEndDate || null,
        daysOfWeek: editDaysOfWeek || null,
        startHour: editStartHour !== '' ? parseInt(editStartHour, 10) : null,
        endHour: editEndHour !== '' ? parseInt(editEndHour, 10) : null,
      })
      .then(() => {
        cancelEditing();
        setRefreshKey((prev) => prev + 1);
      })
      .catch((err) => {
        console.error(err);
        setError('Error updating cart item scheduling');
      });
  };

  if (loading) return <p style={{ margin: '1rem' }}>Loading cart...</p>;
  if (!cart) return <p style={{ color: 'red' }}>{error || 'Cart not found.'}</p>;

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Edit Cart (ID: {cart.id})</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Cart Info */}
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
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />

        <label>Station ID: </label>
        <input
          type="number"
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
          style={{ width: '80px', marginRight: '0.5rem' }}
        />

        <button onClick={handleSaveCart}>Save Cart</button>
      </div>

      <hr />

      {/* Add Content to Cart */}
      <h3>Add Content to Cart</h3>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Content ID: </label>
        <input
          type="number"
          value={newContentId}
          onChange={(e) => setNewContentId(e.target.value)}
          style={{ width: '80px', marginRight: '0.5rem' }}
        />
      </div>
      {/* Scheduling fields */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Start Date: </label>
        <input
          type="date"
          value={newStartDate}
          onChange={(e) => setNewStartDate(e.target.value)}
          style={{ marginRight: '1rem' }}
        />

        <label>End Date: </label>
        <input
          type="date"
          value={newEndDate}
          onChange={(e) => setNewEndDate(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Days of Week (comma separated, 0=Sun..6=Sat): </label>
        <input
          type="text"
          value={newDaysOfWeek}
          onChange={(e) => setNewDaysOfWeek(e.target.value)}
          style={{ width: '80px', marginRight: '1rem' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Start Hour: </label>
        <input
          type="number"
          value={newStartHour}
          onChange={(e) => setNewStartHour(e.target.value)}
          style={{ width: '50px', marginRight: '1rem' }}
        />

        <label>End Hour: </label>
        <input
          type="number"
          value={newEndHour}
          onChange={(e) => setNewEndHour(e.target.value)}
          style={{ width: '50px', marginRight: '1rem' }}
        />
      </div>
      <button onClick={handleAddContent}>Add Content</button>

      <hr />

      <h3>Cart Items</h3>
      {items.length === 0 && <p>No items in this cart.</p>}
      {items.length > 0 && (
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: 'collapse', marginTop: '0.5rem' }}
        >
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Content ID</th>
              <th>Title</th>
              <th>Start/End Dates</th>
              <th>DaysOfWeek</th>
              <th>Hrs</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const contentObj = item.Content;
              const isEditing = editingItemId === item.id;

              return (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.contentId}</td>
                  <td>{contentObj ? contentObj.title : 'Unknown'}</td>
                  {isEditing ? (
                    <>
                      <td>
                        <input
                          type="date"
                          value={editStartDate}
                          onChange={(e) => setEditStartDate(e.target.value)}
                          style={{ marginRight: '0.3rem' }}
                        />
                        <input
                          type="date"
                          value={editEndDate}
                          onChange={(e) => setEditEndDate(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editDaysOfWeek}
                          onChange={(e) => setEditDaysOfWeek(e.target.value)}
                          style={{ width: '70px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={editStartHour}
                          onChange={(e) => setEditStartHour(e.target.value)}
                          style={{ width: '40px', marginRight: '0.3rem' }}
                        />
                        <input
                          type="number"
                          value={editEndHour}
                          onChange={(e) => setEditEndHour(e.target.value)}
                          style={{ width: '40px' }}
                        />
                      </td>
                      <td>
                        <button onClick={handleSaveItem}>Save</button>{' '}
                        <button onClick={cancelEditing}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>
                        {item.startDate || ''} - {item.endDate || ''}
                      </td>
                      <td>{item.daysOfWeek || ''}</td>
                      <td>
                        {item.startHour != null ? item.startHour : ''} -{' '}
                        {item.endHour != null ? item.endHour : ''}
                      </td>
                      <td>
                        <button onClick={() => startEditingItem(item)}>
                          Edit
                        </button>{' '}
                        <button onClick={() => handleRemoveItem(item.contentId)}>
                          Remove
                        </button>
                      </td>
                    </>
                  )}
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
