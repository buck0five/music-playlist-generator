// src/pages/OnDemandPlaylist.jsx
import React, { useState } from 'react';
import axios from 'axios';

function OnDemandPlaylist() {
  const [stationId, setStationId] = useState('');
  const [playlist, setPlaylist] = useState([]);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    if (!stationId) {
      setError('Please enter a station ID');
      return;
    }
    axios
      .post('/api/on-demand/generate', { stationId })
      .then((res) => {
        if (res.data.success) {
          setPlaylist(res.data.playlist || []);
          setError('');
        } else {
          setPlaylist([]);
          setError(res.data.error || 'Error generating playlist.');
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
        <label style={{ marginRight: '0.5rem' }}>Station ID:</label>
        <input
          type="text"
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={handleGenerate}>Generate</button>
      </div>

      {playlist.length === 0 && !error && (
        <p>No playlist items. Generate to see results.</p>
      )}
      {playlist.length > 0 && (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Content ID</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {playlist.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.id}</td>
                <td>{item.title || 'Unknown'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default OnDemandPlaylist;
