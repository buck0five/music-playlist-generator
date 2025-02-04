// src/pages/TagList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function TagList() {
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = () => {
    axios
      .get('http://173.230.134.186:5000/api/tags')
      .then((res) => {
        setTags(res.data);
      })
      .catch((err) => {
        setError('Error fetching tags');
        console.error(err);
      });
  };

  const handleCreateTag = () => {
    if (!newTagName) return;
    axios
      .post('http://173.230.134.186:5000/api/tags', { name: newTagName })
      .then((res) => {
        console.log('Created tag:', res.data);
        setNewTagName('');
        fetchTags();
      })
      .catch((err) => {
        setError('Error creating tag');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>All Tags</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="New tag name"
          value={newTagName}
          onChange={(e) => setNewTagName(e.target.value)}
        />
        <button onClick={handleCreateTag}>Create Tag</button>
      </div>

      {tags.length === 0 && !error && <p>No tags found.</p>}

      {tags.length > 0 && (
        <ul>
          {tags.map((tag) => (
            <li key={tag.id}>
              {tag.id} - {tag.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TagList;
