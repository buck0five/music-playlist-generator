// src/pages/SchedulesList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SchedulesList() {
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://173.230.134.186:5000/api/station-schedules')
      .then((res) => {
        setSchedules(res.data);
      })
      .catch((err) => {
        setError('Error fetching schedules');
        console.error(err);
      });
  }, [refreshKey]);

  const handleDelete = (id) => {
    axios
      .delete(`http://173.230.134.186:5000/api/station-schedules/${id}`)
      .then((res) => {
        console.log('Deleted schedule:', res.data);
        setRefreshKey((prev) => prev + 1); // re-fetch
      })
      .catch((err) => {
        setError('Error deleting schedule');
        console.error(err);
      });
  };

  const goToNew = () => {
    navigate('/schedules/new');
  };

  const goToEdit = (id) => {
    navigate(`/schedules/${id}/edit`);
  };

  return (
    <div>
      <h2>All Schedules</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={goToNew}>New Schedule</button>

      {schedules.length === 0 && !error && <p>No schedules found.</p>}

      {schedules.length > 0 && (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Station ID</th>
              <th>Clock Template ID</th>
              <th>Day Of Week</th>
              <th>Start Hour</th>
              <th>End Hour</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((sch) => (
              <tr key={sch.id}>
                <td>{sch.id}</td>
                <td>{sch.stationId}</td>
                <td>{sch.clockTemplateId}</td>
                <td>{sch.dayOfWeek}</td>
                <td>{sch.startHour}</td>
                <td>{sch.endHour}</td>
                <td>
                  <button onClick={() => goToEdit(sch.id)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(sch.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SchedulesList;
