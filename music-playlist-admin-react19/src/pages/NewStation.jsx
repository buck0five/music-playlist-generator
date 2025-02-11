// src/pages/NewStation.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewStation() {
  const navigate = useNavigate();
  const [stationName, setStationName] = useState('');
  const [defaultClockTemplateId, setDefaultClockTemplateId] = useState('');
  const [clockMapId, setClockMapId] = useState('');
  const [verticalId, setVerticalId] = useState('');
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [verticals, setVerticals] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchVerticals();
    fetchUsers();
  }, []);

  const fetchVerticals = () => {
    axios
      .get('http://173.230.134.186:5000/api/verticals')
      .then((res) => setVerticals(res.data || []))
      .catch((err) => console.error(err));
  };

  const fetchUsers = () => {
    axios
      .get('http://173.230.134.186:5000/api/users')
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error(err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!stationName) {
      setError('Station name is required.');
      return;
    }
    setSaving(true);

    axios
      .post('http://173.230.134.186:5000/api/stations', {
        name: stationName,
        defaultClockTemplateId: defaultClockTemplateId || null,
        clockMapId: clockMapId || null,
        verticalId: verticalId || null,
        userId: userId || null,
      })
      .then(() => {
        setSaving(false);
        navigate('/stations');
      })
      .catch((err) => {
        console.error(err);
        setError('Error creating station.');
        setSaving(false);
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Create New Station</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Station Name: </label>
          <input
            type="text"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Default Clock Template ID: </label>
          <input
            type="number"
            value={defaultClockTemplateId}
            onChange={(e) => setDefaultClockTemplateId(e.target.value)}
            style={{ marginLeft: '0.5rem', width: '80px' }}
          />
        </div>

        <div style={{ marginBottom: '0.5rem' }}>
          <label>Clock Map ID: </label>
          <input
            type="number"
            value={clockMapId}
            onChange={(e) => setClockMapId(e.target.value)}
            style={{ marginLeft: '0.5rem', width: '80px' }}
          />
        </div>

        {/* Vertical Dropdown */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label>Vertical: </label>
          <select
            value={verticalId}
            onChange={(e) => setVerticalId(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
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
          <label>User: </label>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="">(none)</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} (ID {u.id}, role={u.role})
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create Station'}
        </button>
      </form>
    </div>
  );
}

export default NewStation;
