// src/components/UserDashboard.js

import React from 'react';
import UserPlaylist from './UserPlaylist';

function UserDashboard({ onLogout }) {
  return (
    <div>
      <h2>User Dashboard</h2>
      <button onClick={onLogout}>Logout</button>
      <hr />
      <UserPlaylist />
    </div>
  );
}

export default UserDashboard;
