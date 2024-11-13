// src/components/ContentLibraries.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ContentLibraries() {
  const [libraries, setLibraries] = useState([]);
  const [newLibraryName, setNewLibraryName] = useState('');

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      const response = await api.get('/admin/content-libraries');
      setLibraries(response.data);
    } catch (error) {
      console.error('Error fetching content libraries:', error.response?.data || error.message);
      alert('Failed to fetch content libraries.');
    }
  };

  const createLibrary = async () => {
    try {
      await api.post('/admin/content-libraries', { name: newLibraryName });
      setNewLibraryName('');
      fetchLibraries();
      alert('Content library created successfully!');
    } catch (error) {
      console.error('Error creating content library:', error.response?.data || error.message);
      alert('Failed to create content library.');
    }
  };

  return (
    <div>
      <h2>Content Libraries</h2>
      <div>
        <input
          type="text"
          placeholder="New Content Library Name"
          value={newLibraryName}
          onChange={(e) => setNewLibraryName(e.target.value)}
        />
        <button onClick={createLibrary}>Create</button>
      </div>
      <ul>
        {libraries.map((library) => (
          <li key={library.id}>{library.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default ContentLibraries;
