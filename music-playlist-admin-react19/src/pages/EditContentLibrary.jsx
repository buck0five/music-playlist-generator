// src/pages/EditContentLibrary.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditContentLibrary() {
  const { id } = useParams(); // libraryId
  const navigate = useNavigate();

  const [library, setLibrary] = useState(null);
  const [slots, setSlots] = useState([]); // if you had "slots," ignore if not needed
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState('');
  const [verticalId, setVerticalId] = useState('');

  const [saving, setSaving] = useState(false);

  // The content in this library:
  const [libraryContents, setLibraryContents] = useState([]);

  useEffect(() => {
    fetchLibrary();
  }, [id]);

  const fetchLibrary = () => {
    setError('');
    setStatus('');
    axios
      .get(`http://173.230.134.186:5000/api/content-libraries/${id}`)
      .then((res) => {
        const lib = res.data;
        if (!lib || !lib.id) {
          setError('Library not found.');
          return;
        }
        setLibrary(lib);
        setName(lib.name || '');
        setDescription(lib.description || '');
        setUserId(lib.userId || '');
        setVerticalId(lib.verticalId || '');
        setLibraryContents(lib.Contents || []); // important: .Contents
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching library.');
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
        setStatus('Saved!');
        setSaving(false);
        fetchLibrary(); // re-fetch to update
      })
      .catch((err) => {
        console.error(err);
        setError('Error saving library.');
        setSaving(false);
      });
  };

  // Remove content from this library => set libraryId=null
  const handleRemoveContent = (contentId) => {
    axios
      .put(`http://173.230.134.186:5000/api/content/${contentId}`, {
        libraryId: null,
      })
      .then(() => {
        // filter out from local state
        setLibraryContents((prev) => prev.filter((c) => c.id !== contentId));
      })
      .catch((err) => {
        console.error(err);
        setError('Error removing content from library.');
      });
  };

  if (!library) return <p>{error || 'Loading library...'}</p>;

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Edit Content Library: {library.name} (ID {id})</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '0.5rem' }}>
        <label>Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginLeft: '0.5rem', marginRight: '1rem' }}
        />
        <label>Description: </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginLeft: '0.5rem', width: '300px' }}
        />
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <label>User ID: </label>
        <input
          type="number"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ marginLeft: '0.5rem', width: '80px', marginRight: '1rem' }}
        />

        <label>Vertical ID: </label>
        <input
          type="number"
          value={verticalId}
          onChange={(e) => setVerticalId(e.target.value)}
          style={{ marginLeft: '0.5rem', width: '80px' }}
        />
      </div>

      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Library'}
      </button>
      {status && <span style={{ marginLeft: '1rem' }}>{status}</span>}

      <hr />

      <h3>Library Contents</h3>
      <button
        onClick={() => navigate(`/content-libraries/${id}/add-content`)}
        style={{ marginBottom: '0.5rem' }}
      >
        Add Existing Content
      </button>

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {libraryContents.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>{c.contentType}</td>
                <td>{c.fileName || ''}</td>
                <td>
                  <button onClick={() => handleRemoveContent(c.id)}>
                    Remove
                  </button>
                </td>
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
