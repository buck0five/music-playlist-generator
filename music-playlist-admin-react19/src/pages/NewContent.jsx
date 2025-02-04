// src/pages/NewContent.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewContent() {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('');
  const [formatId, setFormatId] = useState('');
  const [duration, setDuration] = useState('');
  const [score, setScore] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      title,
      contentType,
      formatId: formatId ? parseInt(formatId, 10) : null,
      duration: duration ? parseInt(duration, 10) : null,
      score: score ? parseFloat(score) : 0,
      fileName,
    };

    axios
      .post('http://173.230.134.186:5000/api/content', payload)
      .then((res) => {
        console.log('Created content:', res.data);
        navigate('/content');
      })
      .catch((err) => {
        console.error(err);
        setError('Error creating content');
      });
  };

  return (
    <div>
      <h2>Create New Content</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title: </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label>Content Type (e.g. "song", "ad", "jingle"): </label>
          <input
            type="text"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Format ID: </label>
          <input
            type="number"
            value={formatId}
            onChange={(e) => setFormatId(e.target.value)}
          />
        </div>

        <div>
          <label>Duration (seconds): </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div>
          <label>Score (optional numeric): </label>
          <input
            type="number"
            step="0.1"
            value={score}
            onChange={(e) => setScore(e.target.value)}
          />
        </div>

        <div>
          <label>File Name: </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default NewContent;
