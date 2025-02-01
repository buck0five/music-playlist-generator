// src/components/UserPlaylist.js

import React, { useEffect, useState } from 'react';
import api from '../services/api';

function UserPlaylist() {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const fetchPlaylist = async () => {
    try {
      const response = await api.get('/api/playlist');
      setContents(response.data.contents);
    } catch (error) {
      console.error(
        'Error fetching playlist:',
        error.response?.data || error.message
      );
      alert('Failed to fetch playlist.');
    }
  };

  return (
    <div>
      <h2>Your Playlist</h2>
      {contents.length === 0 ? (
        <p>No content available. Please contact your administrator.</p>
      ) : (
        <ul>
          {contents.map((content) => (
            <li key={content.id}>
              <div>
                <h3>{content.title}</h3>
                <p>Type: {content.contentType}</p>
                <p>Duration: {content.duration}</p>
                {content.contentType === 'song' && (
                  <audio controls>
                    <source
                      src={`http://173.230.134.186:5000/${content.file_path}`}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserPlaylist;
