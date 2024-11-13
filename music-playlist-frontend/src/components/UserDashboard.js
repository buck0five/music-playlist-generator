// src/components/UserDashboard.js

import React from 'react';
import api from '../services/api';

function UserDashboard() {
  const generatePlaylist = async () => {
    try {
      const response = await api.get('/api/playlists/generate');
      alert('Playlist generated successfully!');
      console.log('Playlist path:', response.data.path);
      // Optionally, handle the playlist file or display it to the user
    } catch (error) {
      console.error('Error generating playlist:', error.response?.data || error.message);
      alert('Failed to generate playlist.');
    }
  };

  return (
    <div>
      <h2>User Dashboard</h2>
      <button onClick={generatePlaylist}>Generate Playlist</button>
      {/* Add more user functionalities here */}
    </div>
  );
}

export default UserDashboard;
