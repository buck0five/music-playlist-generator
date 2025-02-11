// src/pages/EditCart.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditCart() {
  const { id } = useParams(); // cartId
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [cartName, setCartName] = useState('');
  const [category, setCategory] = useState('');
  const [stationId, setStationId] = useState('');
  const [rotationIndex, setRotationIndex] = useState(0);

  // cart items
  const [items, setItems] = useState([]);

  // new item fields
  const [newContentId, setNewContentId] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newDaysOfWeek, setNewDaysOfWeek] = useState('');
  const [newStartHour, setNewStartHour] = useState('');
  const [newEndHour, setNewEndHour] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCartData();
  }, [id]);

  const fetchCartData = () => {
    setLoading(true);
    axios
      .get(`http://173.230.134.186:5000/api/carts/${id}`)
      .then((res) => {
        setLoading(false);
        if (!res.data || !res.data.cart) {
          setError('Cart not found');
          return;
        }
        const c = res.data.cart;
        const its = res.data.items || [];
        setCart(c);
        setItems(its);
        setCartName(c.name || '');
        setCategory(c.category || '');
        setStationId(c.stationId || '');
        setRotationIndex(c.rotationIndex || 0);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setError('Error fetching cart');
      });
  };

  const handleSaveCart = () => {
    setSaving(true);
    axios
      .put(`http://173.230.134.186:5000/api/carts/${id}`, {
        name: cartName,
        category,
        stationId: stationId || null,
        rotationIndex: parseInt(rotationIndex, 10) || 0,
      })
      .then(() => {
        setSaving(false);
        fetchCartData();
      })
      .catch((err) => {
        console.error(err);
        setSaving(false);
        setError('Error updating cart');
      });
  };

  // Add new content item to cart
  const handleAddContent = () => {
    if (!newContentId) {
      setError('Content ID is required');
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
        setNewContentId('');
        setNewStartDate('');
        setNewEndDate('');
        setNewDaysOfWeek('');
        setNewStartHour('');
        setNewEndHour('');
        fetchCartData();
      })
      .catch((err) => {
        console.error(err);
        setError('Error adding content to cart');
      });
  };

  // Remove pivot
  const handleRemoveItem = (contentId) => {
    axios
      .delete(`http://173.230.134.186:5000/api/carts/${id}/remove-content/${contentId}`)
      .then(() => {
        fetchCartData();
      })
      .catch((err) => {
        console.error(err);
        setError('Error removing content from cart');
      });
  };

  // Update item pivot scheduling
  const handleUpdateItem = (itemId, newFields) => {
    axios
      .put(`http://173.230.134.186:5000/api/carts/${id}/update-item/${itemId}`, newFields)
      .then(() => {
        fetchCartData();
      })
      .catch((err) => {
        console.error(err);
        setError('Error updating cart item');
      });
  };

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!cart) return <p>Cart not found</p>;

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Edit Cart (ID: {id})</h2>
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
          style={{ width: '70px', marginRight: '0.5rem' }}
        />

        <label>Rotation Index: </label>
        <input
          type="number"
          value={rotationIndex}
          onChange={(e) => setRotationIndex(e.target.value)}
          style={{ width: '50px', marginRight: '0.5rem' }}
        />

        <button onClick={handleSaveCart} disabled={saving}>
          {saving ? 'Saving...' : 'Save Cart'}
        </button>
      </div>

      <hr />

      <h3>Add Content to Cart</h3>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Content ID: </label>
        <input
          type="number"
          value={newContentId}
          onChange={(e) => setNewContentId(e.target.value)}
          style={{ width: '80px', marginRight: '1rem' }}
        />

        <label>Start Date: </label>
        <input
          type="date"
          value={newStartDate}
          onChange={(e) => setNewStartDate(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />

        <label>End Date: </label>
        <input
          type="date"
          value={newEndDate}
          onChange={(e) => setNewEndDate(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />

        <label>Days (comma): </label>
        <input
          type="text"
          value={newDaysOfWeek}
          onChange={(e) => setNewDaysOfWeek(e.target.value)}
          style={{ width: '70px', marginRight: '0.5rem' }}
        />

        <label>StartHr: </label>
        <input
          type="number"
          value={newStartHour}
          onChange={(e) => setNewStartHour(e.target.value)}
          style={{ width: '50px', marginRight: '0.5rem' }}
        />

        <label>EndHr: </label>
        <input
          type="number"
          value={newEndHour}
          onChange={(e) => setNewEndHour(e.target.value)}
          style={{ width: '50px', marginRight: '0.5rem' }}
        />

        <button onClick={handleAddContent}>Add Content</button>
      </div>

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
              <th>Scheduling</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((itm) => {
              const c = itm.Content;
              return (
                <tr key={itm.id}>
                  <td>{itm.id}</td>
                  <td>{itm.contentId}</td>
                  <td>{c ? c.title : '(unknown)'}</td>
                  <td>
                    {/* Scheduling info */}
                    Start: {itm.startDate || ''}, End: {itm.endDate || ''},
                    Days: {itm.daysOfWeek || ''}, Hrs: {itm.startHour || ''}-
                    {itm.endHour || ''}
                  </td>
                  <td>
                    <button
                      onClick={() => {
                        // example updating scheduling
                        const updatedFields = {
                          startDate: itm.startDate,
                          endDate: itm.endDate,
                          daysOfWeek: itm.daysOfWeek,
                          startHour: itm.startHour,
                          endHour: itm.endHour,
                        };
                        // Could pop up a small form or do inline editing
                        handleUpdateItem(itm.id, updatedFields);
                      }}
                    >
                      Update
                    </button>{' '}
                    <button onClick={() => handleRemoveItem(itm.contentId)}>
                      Remove
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <hr />
      {stationId && (
        <button onClick={() => navigate(`/stations/${stationId}/carts`)}>
          Back to Carts
        </button>
      )}
    </div>
  );
}

export default EditCart;
