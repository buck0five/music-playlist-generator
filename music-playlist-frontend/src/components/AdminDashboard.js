// src/components/AdminDashboard.js

import React, { useState } from 'react';
import ManageUsers from './ManageUsers';
import ManageStations from './ManageStations';
import ContentLibraries from './ContentLibraries'; // Updated import
import ManageContent from './ManageContent';       // Updated import

function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <button onClick={onLogout}>Logout</button>
      <hr />
      <nav>
        <button onClick={() => setActiveTab('users')}>Users</button>
        <button onClick={() => setActiveTab('stations')}>Stations</button>
        <button onClick={() => setActiveTab('contentLibraries')}>Content Libraries</button>
        <button onClick={() => setActiveTab('contents')}>Contents</button>
      </nav>
      <div>
        {activeTab === 'users' && <ManageUsers />}
        {activeTab === 'stations' && <ManageStations />}
        {activeTab === 'contentLibraries' && <ContentLibraries />} // Updated component
        {activeTab === 'contents' && <ManageContent />}            // Updated component
      </div>
    </div>
  );
}

export default AdminDashboard;
