// src/App.js

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';

import Register from './components/Register';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import ContentLibraries from './components/ContentLibraries';
import AdminRoutes from './components/AdminRoutes'; // We'll create this next
import ManageUsers from './components/ManageUsers'; // We'll create this too

function App() {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setAuthToken(token);

    if (token) {
      // Decode token to get user role
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.role);
    }
  }, []);

  const isAuthenticated = !!authToken;

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUserRole(null);
    window.location.href = '/';
  };

  return (
    <Router>
      <div>
        {/* Navigation Menu */}
        <nav>
          <ul>
            {!isAuthenticated && (
              <>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
            {isAuthenticated && (
              <>
                <li><Link to="/profile">Profile</Link></li>
                {userRole === 'admin' ? (
                  <>
                    <li><Link to="/admin">Admin Dashboard</Link></li>
                    <li><Link to="/admin/content-libraries">Content Libraries</Link></li>
                    <li><Link to="/admin/users">Manage Users</Link></li>
                  </>
                ) : (
                  <li><Link to="/dashboard">Dashboard</Link></li>
                )}
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            )}
          </ul>
        </nav>

        {/* Routing */}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={<Login setAuthToken={setAuthToken} setUserRole={setUserRole} />}
          />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              isAuthenticated ? <Profile /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/dashboard"
            element={
              isAuthenticated && userRole !== 'admin' ? (
                <UserDashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/admin/*"
            element={
              isAuthenticated && userRole === 'admin' ? (
                <AdminRoutes />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Catch-all Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

// Define the Home and NotFound components
const Home = () => <h1>Welcome to the Music Playlist Generator</h1>;
const NotFound = () => <h2>404 - Page Not Found</h2>;

export default App;
