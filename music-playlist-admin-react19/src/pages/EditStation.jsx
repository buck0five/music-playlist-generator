// src/pages/EditStation.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditStation() {
  const { id } = useParams(); // station ID from the URL
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [defaultClockTemplateId, setDefaultClockTemplateId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch existing station data
    axios
      .get(`http://173.230.134.186:5000/api/stations/${id}`)
      .then((res) => {
        const station = res.data;
        setName(station.name || '');
        setDefaultClockTemplateId(
          station.defaultClockTemplateId ? station.defaultClockTemplateId : ''
        );
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching station data');
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name,
      defaultClockTemplateId: defaultClockTemplateId || null,
    };

    axios
      .put(`http://173.230.134.186:5000/api/stations/${id}`, payload)
      .then((res) => {
        console.log('Updated station:', res.data);
        // go back to stations list
        navigate('/');
      })
      .catch((err) => {
        setError('Error updating station');
        console.error(err);
      });
  };

  if (loading) {
    return <p>Loading station data...</p>;
  }

  return (
    <div>
      <h2>Edit Station (ID: {id})</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Station Name: </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label>Default Clock Template ID: </label>
          <input
            type="number"
            value={defaultClockTemplateId}
            onChange={(e) => setDefaultClockTemplateId(e.target.value)}
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditStation;
