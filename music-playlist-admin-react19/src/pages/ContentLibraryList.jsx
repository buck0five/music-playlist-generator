// src/pages/ContentLibraryList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function ContentLibraryList() {
  const [libraries, setLibraries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = () => {
    setError('');
    axios
      .get('http://173.230.134.186:5000/api/content-libraries')
      .then((res) => {
        setLibraries(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching libraries');
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Content Libraries</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <Link to="/content-libraries/new">Create New Library</Link>

      {libraries.length === 0 && !error && <p>No libraries found.</p>}

      {libraries.length > 0 && (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Library Name</th>
              <th>User ID</th>
              <th>Vertical ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {libraries.map((lib) => (
              <tr key={lib.id}>
                <td>{lib.id}</td>
                <td>{lib.name}</td>
                <td>{lib.userId || ''}</td>
                <td>{lib.verticalId || ''}</td>
                <td>
                  <Link to={`/content-libraries/${lib.id}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ContentLibraryList;
