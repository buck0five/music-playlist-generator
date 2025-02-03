// src/pages/EditSchedule.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stationId, setStationId] = useState('');
  const [clockTemplateId, setClockTemplateId] = useState('');
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://173.230.134.186:5000/api/station-schedules/${id}`)
      .then((res) => {
        const sch = res.data;
        setStationId(sch.stationId || '');
        setClockTemplateId(sch.clockTemplateId || '');
        setDayOfWeek(sch.dayOfWeek || '');
        setStartHour(sch.startHour || '');
        setEndHour(sch.endHour || '');
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching schedule data');
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      stationId: parseInt(stationId, 10),
      clockTemplateId: parseInt(clockTemplateId, 10),
      dayOfWeek: parseInt(dayOfWeek, 10),
      startHour: parseInt(startHour, 10),
      endHour: parseInt(endHour, 10),
    };

    axios
      .put(`http://173.230.134.186:5000/api/station-schedules/${id}`, payload)
      .then((res) => {
        console.log('Updated schedule:', res.data);
        navigate('/schedules');
      })
      .catch((err) => {
        setError('Error updating schedule');
        console.error(err);
      });
  };

  if (loading) {
    return <p>Loading schedule data...</p>;
  }

  return (
    <div>
      <h2>Edit Schedule (ID: {id})</h2>
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
          <label>Day Of Week (0..6): </label>
          <input
            type="number"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Start Hour: </label>
          <input
            type="number"
            value={startHour}
            onChange={(e) => setStartHour(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Hour: </label>
          <input
            type="number"
            value={endHour}
            onChange={(e) => setEndHour(e.target.value)}
            required
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditSchedule;
