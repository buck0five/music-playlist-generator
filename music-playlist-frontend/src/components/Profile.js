// src/components/Profile.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Profile() {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    // password: '', // Only if you allow password change here
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/user/profile');
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error.response?.data || error.message);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/api/user/profile', profileData);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      alert('Failed to update profile.');
    }
  };

  return (
    <div>
      <h2>Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input name="username" type="text" value={profileData.username} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" type="email" value={profileData.email} onChange={handleChange} required />
        </div>
        {/* Add password field if needed */}
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
}

export default Profile;
