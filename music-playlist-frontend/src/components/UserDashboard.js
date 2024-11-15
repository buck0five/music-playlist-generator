// src/components/UserDashboard.js

import React from 'react';

function UserDashboard({ onLogout }) {
  return (
    <div>
      <h2>User Dashboard</h2>
      <button onClick={onLogout}>Logout</button>
      {/* Add user-specific components here */}
      <p>Welcome to your dashboard!</p>
    </div>
  );
}

export default UserDashboard;
