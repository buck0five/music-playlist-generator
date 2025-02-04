// src/pages/EditContent.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditContent() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('');
  const [formatId, setFormatId] = useState('');
  const [duration, setDuration] = useState('');
  const [score, setScore] = useState('');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://173.230.134.186:5000/api/content/${id}`)
      .then((res) => {
        const c = res.data;
        setTitle(c.title || '');
        setContentType(c.contentType || '');
        setFormatId(c.formatId?.toString() || '');
        setDuration(c.duration?.toString() || '');
        setScore(c.score?.toString() || '');
        setFileName(c.fileName || '');
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching content');
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title,
      contentType,
      formatId: formatId !== '' ? parseInt(formatId, 10) : undefined,
      duration: duration !== '' ? parseInt(duration, 10) : undefined,
      score: score !== '' ? parseFloat(score) : undefined,
      fileName,
    };

    axios
      .put(`http://173.230.134.186:5000/api/content/${id}`, payload)
      .then((res) => {
        console.log('Updated content:', res.data);
        navigate('/content');
      })
      .catch((err) => {
        console.error(err);
        setError('Error updating content');
      });
  };

  if (loading) {
    return <p>Loading content...</p>;
  }

  return (
    <div>
      <h2>Edit Content (ID: {id})</h2>
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
          <label>Content Type: </label>
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
          <label>Duration: </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div>
          <label>Score: </label>
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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditContent;
