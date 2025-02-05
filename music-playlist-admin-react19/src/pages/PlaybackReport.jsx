// src/pages/PlaybackReport.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PlaybackReport() {
  const [reportData, setReportData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/api/reports/playback')
      .then((res) => {
        // If your back end returns an array or an object, adapt accordingly
        // For now, assume it returns an object with message or data
        if (res.data.message) {
          // placeholder
          setReportData([{ message: res.data.message }]);
        } else {
          // or if it's an array, setReportData(res.data)
          setReportData([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching playback report');
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading Playback Report...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Playback Report</h2>
      {reportData.length === 0 && <p>No data or placeholder message found.</p>}
      {reportData.length > 0 && (
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, idx) => (
              <tr key={idx}>
                <td>{row.message || 'No message'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PlaybackReport;
