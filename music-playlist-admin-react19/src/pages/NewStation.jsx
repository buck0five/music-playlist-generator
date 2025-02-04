// src/pages/NewSchedule.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewSchedule() {
  const navigate = useNavigate();
  const [stationId, setStationId] = useState('');
  const [clockTemplateId, setClockTemplateId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      stationId: parseInt(stationId, 10),
      clockTemplateId: parseInt(clockTemplateId, 10),
      dayOfWeek: dayOfWeek !== '' ? parseInt(dayOfWeek, 10) : null,
      startHour: startHour !== '' ? parseInt(startHour, 10) : 0,
      endHour: endHour !== '' ? parseInt(endHour, 10) : 23,
    };

    axios
      .post('http://173.230.134.186:5000/api/station-schedules', payload)
      .then((res) => {
        console.log('Created schedule:', res.data);
        navigate('/schedules');
      })
      .catch((err) => {
        setError('Error creating schedule');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Create New Schedule</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Station ID: </label>
          <input
            type="number"
            value={stationId}
            onChange={(e) => setStationId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Clock Template ID: </label>
          <input
            type="number"
            value={clockTemplateId}
            onChange={(e) => setClockTemplateId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Day of Week (0=Sun..6=Sat, blank=any): </label>
          <input
            type="number"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
          />
        </div>
        <div>
          <label>Start Hour (0..23): </label>
          <input
            type="number"
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
          />
        </div>
        <div>
          <label>End Hour (0..23): </label>
          <input
            type="number"
            value={endHour}
            onChange={(e) => setEndHour(e.target.value)}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default NewSchedule;
