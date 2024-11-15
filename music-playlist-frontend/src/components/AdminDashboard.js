// src/components/AdminDashboard.js

import React from 'react';
import ManageUsers from './ManageUsers';
import ManageContent from './ManageContent';
import ManageStations from './ManageStations';
import ManageCompanies from './ManageCompanies';
import ContentLibraries from './ContentLibraries';

function AdminDashboard({ onLogout }) {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={onLogout}>Logout</button>
      <hr />
      <ManageUsers />
      <hr />
      <ManageContent />
      <hr />
      <ManageStations />
      <hr />
      <ManageCompanies />
      <hr />
      <ContentLibraries />
    </div>
  );
}

export default AdminDashboard;
