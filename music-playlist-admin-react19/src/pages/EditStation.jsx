// src/pages/EditStation.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditStation() {
  const { id } = useParams(); // stationId
  const navigate = useNavigate();

  const [stationName, setStationName] = useState('');
  const [defaultClockTemplateId, setDefaultClockTemplateId] = useState('');
  const [clockMapId, setClockMapId] = useState('');
  const [verticalId, setVerticalId] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // We'll store the entire station object if needed:
  const [station, setStation] = useState(null);

  // For listing verticals
  const [verticals, setVerticals] = useState([]);

  useEffect(() => {
    fetchStationData();
    fetchVerticals();
  }, [id]);

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
        setStation(st);
        setStationName(st.name || '');
        setDefaultClockTemplateId(st.defaultClockTemplateId || '');
        setClockMapId(st.clockMapId || '');
        setVerticalId(st.verticalId || '');
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching station');
        setLoading(false);
      });
  };

  const fetchVerticals = () => {
    axios
      .get('http://173.230.134.186:5000/api/verticals')
      .then((res) => {
        setVerticals(res.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleSave = () => {
    setSaving(true);
    axios
      .put(`http://173.230.134.186:5000/api/stations/${id}`, {
        name: stationName,
        defaultClockTemplateId: defaultClockTemplateId || null,
        clockMapId: clockMapId || null,
        verticalId: verticalId || null,
      })
      .then(() => {
        setSaving(false);
        navigate('/stations');
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
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Name:</label>
        <input
          type="text"
          value={stationName}
          onChange={(e) => setStationName(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <br />

        <label style={{ marginRight: '0.5rem' }}>
          Default Clock Template ID:
        </label>
        <input
          type="number"
          value={defaultClockTemplateId}
          onChange={(e) => setDefaultClockTemplateId(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <br />

        <label style={{ marginRight: '0.5rem' }}>Clock Map ID:</label>
        <input
          type="number"
          value={clockMapId}
          onChange={(e) => setClockMapId(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <br />

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

      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Station'}
      </button>
      <hr />
      <button onClick={() => navigate('/stations')}>Back to Stations</button>
    </div>
  );
}

export default EditStation;
