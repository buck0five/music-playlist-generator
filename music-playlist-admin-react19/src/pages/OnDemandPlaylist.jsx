// src/pages/OnDemandPlaylist.jsx

import React, { useState } from 'react';
import axios from 'axios';

function OnDemandPlaylist() {
  const [stationId, setStationId] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    if (!stationId) {
      setError('Station ID required');
      return;
    }
    // Use the full URL so it goes to :5000, not :3000
    axios
      .post('http://173.230.134.186:5000/api/on-demand/generate', { stationId })
      .then((res) => {
        if (res.data.success) {
          setError('');
          setPlaylist(res.data.playlist || []);
        } else {
          setError(res.data.error || 'No playlist generated.');
          setPlaylist([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Error generating playlist');
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>On-Demand Playlist</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Station ID:</label>
        <input
          style={{ marginLeft: '0.5rem' }}
          type="text"
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
        />
        <button style={{ marginLeft: '0.5rem' }} onClick={handleGenerate}>
          Generate
        </button>
      </div>

      {playlist.length === 0 && !error && (
        <p>No playlist items. Click Generate.</p>
      )}
      {playlist.length > 0 && (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>#</th>
              <th>ID</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {playlist.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.id}</td>
                <td>{item.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OnDemandPlaylist;
