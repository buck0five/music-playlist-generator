// src/components/ProtectedRoute.js

import React from 'react';
import { Route, Navigate } from 'react-router-dom';

function ProtectedRoute({ element: Element, allowedRoles, onLogout, ...rest }) {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Route
      {...rest}
      element={
        user && allowedRoles.includes(user.role) ? (
          <Element onLogout={onLogout} />
        ) : (
          <Navigate to="/login" replace />
        )
      }
    />
  );
}

export default ProtectedRoute;
