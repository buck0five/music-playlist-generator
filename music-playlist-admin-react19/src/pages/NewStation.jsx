// src/pages/NewStation.jsx
import React, { useState } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewStation() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [defaultClockTemplateId, setDefaultClockTemplateId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name,
      defaultClockTemplateId: defaultClockTemplateId || null,
    };

    axios
      .post('http://173.230.134.186:5000/api/stations', payload)
      .then((res) => {
        console.log('Created station:', res.data);
        navigate('/');
      })
      .catch((err) => {
        setError('Error creating station');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Create New Station</h2>
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

        <button type="submit">Create Station</button>
      </form>
    </div>
  );
}

export default NewStation;
