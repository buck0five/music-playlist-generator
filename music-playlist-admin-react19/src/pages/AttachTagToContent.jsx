// src/pages/AttachTagToContent.jsx
import React, { useState } from 'react';
import axios from 'axios';

function AttachTagToContent() {
  const [contentId, setContentId] = useState('');
  const [tagId, setTagId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleAttach = () => {
    if (!contentId || !tagId) return;
    axios
      .post('http://173.230.134.186:5000/api/tags/attach', {
        contentId: parseInt(contentId, 10),
        tagId: parseInt(tagId, 10),
      })
      .then((res) => {
        setMessage('Tag attached successfully');
        setError('');
      })
      .catch((err) => {
        setError('Error attaching tag');
        setMessage('');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Attach Tag to Content</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label>Content ID: </label>
        <input
          type="number"
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>Tag ID: </label>
        <input
          type="number"
          value={tagId}
          onChange={(e) => setTagId(e.target.value)}
        />
      </div>

      <button onClick={handleAttach}>Attach Tag</button>
    </div>
  );
}

export default AttachTagToContent;
