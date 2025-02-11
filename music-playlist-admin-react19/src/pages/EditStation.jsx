// src/pages/EditStation.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

function EditStation() {
  const { id } = useParams(); // stationId
  const navigate = useNavigate();

  // Station fields
  const [stationName, setStationName] = useState('');
  const [defaultClockTemplateId, setDefaultClockTemplateId] = useState('');
  const [clockMapId, setClockMapId] = useState('');
  const [verticalId, setVerticalId] = useState('');
  const [userId, setUserId] = useState('');

  // Additional station fields if you have them...

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // For listing verticals and users
  const [verticals, setVerticals] = useState([]);
  const [users, setUsers] = useState([]);

  // == NEW: station carts logic ==
  const [carts, setCarts] = useState([]);
  const [loadingCarts, setLoadingCarts] = useState(false);

  useEffect(() => {
    fetchStationData();
    fetchVerticals();
    fetchUsers();
    fetchStationCarts();
  }, [id]);

  // ---------------------------------------------------------------------------
  // Fetch existing station data
  const fetchStationData = () => {
    setLoading(true);
    axios
      .get(`http://173.230.134.186:5000/api/stations/${id}`)
      .then((res) => {
        setLoading(false);
        if (!res.data || !res.data.id) {
          setError('Station not found');
          return;
        }
        const st = res.data;
        setStationName(st.name || '');
        setDefaultClockTemplateId(st.defaultClockTemplateId || '');
        setClockMapId(st.clockMapId || '');
        setVerticalId(st.verticalId || '');
        setUserId(st.userId || '');
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching station');
        setLoading(false);
      });
  };

  // ---------------------------------------------------------------------------
  // Fetch verticals
  const fetchVerticals = () => {
    axios
      .get('http://173.230.134.186:5000/api/verticals')
      .then((res) => setVerticals(res.data || []))
      .catch((err) => console.error(err));
  };

  // ---------------------------------------------------------------------------
  // Fetch users
  const fetchUsers = () => {
    axios
      .get('http://173.230.134.186:5000/api/users')
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error(err));
  };

  // ---------------------------------------------------------------------------
  // Fetch station's carts
  const fetchStationCarts = () => {
    setLoadingCarts(true);
    axios
      .get(`http://173.230.134.186:5000/api/carts?stationId=${id}`)
      .then((res) => {
        setLoadingCarts(false);
        setCarts(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching station carts');
        setLoadingCarts(false);
      });
  };

  // ---------------------------------------------------------------------------
  // Save station updates
  const handleSaveStation = () => {
    if (!stationName) {
      setError('Station name is required.');
      return;
    }
    setSaving(true);
    axios
      .put(`http://173.230.134.186:5000/api/stations/${id}`, {
        name: stationName,
        defaultClockTemplateId: defaultClockTemplateId || null,
        clockMapId: clockMapId || null,
        verticalId: verticalId || null,
        userId: userId || null,
      })
      .then(() => {
        setSaving(false);
        // optionally navigate or do something
      })
      .catch((err) => {
        console.error(err);
        setError('Error updating station');
        setSaving(false);
      });
  };

  if (loading) return <p>Loading station...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Edit Station (ID: {id})</h2>

      {/* Station fields */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Name:</label>
        <input
          type="text"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ marginRight: '0.5rem' }}>
          Default Clock Template ID:
        </label>
        <input
          type="number"
          value={defaultClockTemplateId}
          onChange={(e) => setDefaultClockTemplateId(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Clock Map ID:</label>
        <input
          type="number"
          value={clockMapId}
          onChange={(e) => setClockMapId(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
      </div>
      {/* Vertical Dropdown */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Vertical:</label>
        <select
          value={verticalId}
          onChange={(e) => setVerticalId(e.target.value)}
          style={{ marginRight: '1rem' }}
        >
          <option value="">(none)</option>
          {verticals.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} (ID {v.id})
            </option>
          ))}
        </select>
      </div>
      {/* User Dropdown */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={{ marginRight: '0.5rem' }}>User:</label>
        <select
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ marginRight: '1rem' }}
        >
          <option value="">(none)</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} (ID {u.id}, role={u.role})
            </option>
          ))}
        </select>
      </div>
      <button onClick={handleSaveStation} disabled={saving}>
        {saving ? 'Saving...' : 'Save Station'}
      </button>

      <hr />

      <h3>Station Carts</h3>
      {loadingCarts ? (
        <p>Loading carts...</p>
      ) : carts.length === 0 ? (
        <p>No carts found for this station.</p>
      ) : (
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: 'collapse', marginTop: '0.5rem' }}
        >
          <thead>
            <tr>
              <th>Cart ID</th>
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
                  <Link to={`/carts/${cart.id}/edit`}>Edit Cart</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={() => navigate(`/stations/${id}/carts/new`)}>
        Create New Cart
      </button>

      <hr />
      <button onClick={() => navigate('/stations')}>Back to Stations</button>
    </div>
  );
}

export default EditStation;
