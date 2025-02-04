// src/pages/ContentList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ContentList() {
  const [contents, setContents] = useState([]);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://173.230.134.186:5000/api/content')
      .then((res) => {
        setContents(res.data);
      })
      .catch((err) => {
        setError('Error fetching content');
        console.error(err);
      });
  }, [refreshKey]);

  const goToNew = () => {
    navigate('/content/new');
  };

  const goToEdit = (id) => {
    navigate(`/content/${id}/edit`);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://173.230.134.186:5000/api/content/${id}`)
      .then(() => {
        setRefreshKey((prev) => prev + 1);
      })
      .catch((err) => {
        setError('Error deleting content');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>All Content</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={goToNew}>New Content</button>

      {contents.length === 0 && !error && <p>No content found.</p>}

      {contents.length > 0 && (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Score</th>
              <th>File Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contents.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title || 'Untitled'}</td>
                <td>{c.contentType}</td>
                <td>{c.duration}</td>
                <td>{c.score}</td>
                <td>{c.fileName}</td>
                <td>
                  <button onClick={() => goToEdit(c.id)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(c.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ContentList;
