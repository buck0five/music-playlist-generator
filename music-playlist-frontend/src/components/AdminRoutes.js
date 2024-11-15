// src/components/AdminRoutes.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import ContentLibraries from './ContentLibraries';
import ManageUsers from './ManageUsers';
import ManageContent from './ManageContent';
import ManageClockTemplates from './ManageClockTemplates';
import ManageCompanies from './ManageCompanies';
import ManageStations from './ManageStations';

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="content-libraries" element={<ContentLibraries />} />
      <Route path="contents" element={<ManageContent />} />
      <Route path="users" element={<ManageUsers />} />
      <Route path="companies" element={<ManageCompanies />} />
      <Route path="stations" element={<ManageStations />} />
      {/* Add more admin routes as needed */}
    </Routes>
  );
}

export default AdminRoutes;
