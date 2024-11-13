// src/components/AdminDashboard.js

import React from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        <li><Link to="/admin/users">Manage Users</Link></li>
        <li><Link to="/admin/content-libraries">Manage Content Libraries</Link></li>
        {/* Add more admin functionalities here */}
      </ul>
    </div>
  );
}

export default AdminDashboard;
