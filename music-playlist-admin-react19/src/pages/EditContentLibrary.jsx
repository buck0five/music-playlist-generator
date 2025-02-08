// src/pages/EditContentLibrary.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditContentLibrary() {
  const { id } = useParams(); // libraryId
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [verticalId, setVerticalId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // For listing content in this library
  const [libraryContents, setLibraryContents] = useState([]);

  useEffect(() => {
    fetchLibrary();
  }, [id]);

  const fetchLibrary = () => {
    setLoading(true);
    axios
      .get(`http://173.230.134.186:5000/api/content-libraries/${id}`)
      .then((res) => {
        setLoading(false);
        if (!res.data || !res.data.id) {
          setError('Library not found');
          return;
        }
        const lib = res.data;
        setName(lib.name);
        setDescription(lib.description || '');
        setUserId(lib.userId || '');
        setVerticalId(lib.verticalId || '');
        // lib.Contents is the array of content in that library
        setLibraryContents(lib.Contents || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching library');
        setLoading(false);
      });
  };

  const handleSave = () => {
    setSaving(true);
    axios
      .put(`http://173.230.134.186:5000/api/content-libraries/${id}`, {
        name,
        description,
        userId: userId || null,
        verticalId: verticalId || null,
      })
      .then(() => {
        setSaving(false);
        navigate('/content-libraries');
      })
      .catch((err) => {
        console.error(err);
        setError('Error updating library');
        setSaving(false);
      });
  };

  if (loading) return <p style={{ margin: '1rem' }}>Loading library...</p>;
  if (error) return <p style={{ color: 'red', margin: '1rem' }}>{error}</p>;

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Edit Content Library (ID: {id})</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: '1rem' }}
        />
        <br />
        <label style={{ marginRight: '0.5rem' }}>Description: </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginRight: '1rem', width: '300px' }}
        />
        <br />
        <label style={{ marginRight: '0.5rem' }}>User ID: </label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ marginRight: '1rem', width: '80px' }}
        />
        <br />
        <label style={{ marginRight: '0.5rem' }}>Vertical ID: </label>
        <input
          type="number"
          value={verticalId}
          onChange={(e) => setVerticalId(e.target.value)}
          style={{ marginRight: '1rem', width: '80px' }}
        />
      </div>

      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Library'}
      </button>

      <hr />

      <h3>Library Contents</h3>
      {libraryContents.length === 0 ? (
        <p>No content in this library.</p>
      ) : (
        <table
          border="1"
          cellPadding="5"
          style={{ borderCollapse: 'collapse', marginTop: '0.5rem' }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Filename</th>
            </tr>
          </thead>
          <tbody>
            {libraryContents.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>{c.contentType}</td>
                <td>{c.fileName || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />
      <button onClick={() => navigate('/content-libraries')}>
        Back to Libraries
      </button>
    </div>
  );
}

export default EditContentLibrary;
