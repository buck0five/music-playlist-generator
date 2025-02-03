// src/pages/StationsList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // we can use navigate if we want a programmatic nav

function StationsList() {
  const [stations, setStations] = useState([]);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://173.230.134.186:5000/api/stations')
      .then((res) => {
        setStations(res.data);
      })
      .catch((err) => {
        setError('Error fetching stations');
        console.error(err);
      });
  }, [refreshKey]);

  const handleDelete = (id) => {
    axios
      .delete(`http://173.230.134.186:5000/api/stations/${id}`)
      .then((res) => {
        console.log('Deleted station:', res.data);
        setRefreshKey((prev) => prev + 1); // re-fetch after deletion
      })
      .catch((err) => {
        setError('Error deleting station');
        console.error(err);
      });
  };

  const goToEdit = (id) => {
    // Navigate to /stations/123/edit
    navigate(`/stations/${id}/edit`);
  };

  return (
    <div>
      <h2>All Stations</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {stations.length === 0 && !error && (
        <p>No stations found or server has none yet.</p>
      )}

      {stations.length > 0 && (
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: 'collapse', marginTop: '1rem' }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Default Clock Template</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stations.map((station) => (
              <tr key={station.id}>
                <td>{station.id}</td>
                <td>{station.name}</td>
                <td>{station.defaultClockTemplateId || 'None'}</td>
                <td>
                  <button onClick={() => goToEdit(station.id)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(station.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StationsList;
