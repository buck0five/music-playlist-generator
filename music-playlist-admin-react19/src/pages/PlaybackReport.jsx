// src/pages/PlaybackReport.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PlaybackReport() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [stationId, setStationId] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = () => {
    setLoading(true);
    setError('');
    const q = stationId ? `?stationId=${stationId}` : '';
    // If no proxy, use the full URL: "http://173.230.134.186:5000/api/reports/playback"
    axios
      .get(`/api/reports/playback${q}`)
      .then((res) => {
        setLogs(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching playback logs.');
        setLoading(false);
      });
  };

  if (loading) return <p>Loading playback logs...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Playback Report</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label>Filter by Station ID: </label>
        <input
          type="text"
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
          style={{ marginRight: '0.5rem' }}
        />
        <button onClick={fetchLogs}>Apply Filter</button>
      </div>

      {logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Station</th>
              <th>Content</th>
              <th>Played At</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{log.Station ? log.Station.name : log.stationId}</td>
                <td>{log.Content ? log.Content.title : log.contentId}</td>
                <td>{new Date(log.playedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PlaybackReport;
