// src/components/AdminRoutes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ContentLibraries from './ContentLibraries';
import ManageUsers from './ManageUsers';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="content-libraries" element={<ContentLibraries />} />
      <Route path="users" element={<ManageUsers />} />
      {/* Add more admin routes as needed */}
    </Routes>
  );
}

export default AdminRoutes;
