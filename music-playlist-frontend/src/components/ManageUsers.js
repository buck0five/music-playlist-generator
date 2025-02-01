// src/components/ManageUsers.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchStations();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error.response?.data || error.message);
      alert('Failed to fetch users.');
    }
  };

  const fetchStations = async () => {
    try {
      const response = await api.get('/admin/stations');
      setStations(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error.response?.data || error.message);
      alert('Failed to fetch stations.');
    }
  };

  const deleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
        alert('User deleted successfully!');
      } catch (error) {
        console.error('Error deleting user:', error.response?.data || error.message);
        alert('Failed to delete user.');
      }
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}`, { role: newRole });
      fetchUsers();
      alert('User role updated successfully!');
    } catch (error) {
      console.error('Error updating user role:', error.response?.data || error.message);
      alert('Failed to update user role.');
    }
  };

  const updateUserStations = async (userId, e) => {
    const options = e.target.options;
    const selectedStationIds = [];
    for (const option of options) {
      if (option.selected) {
        selectedStationIds.push(option.value);
      }
    }

    try {
      await api.put(`/admin/users/${userId}/stations`, { stationIds: selectedStationIds });
      fetchUsers();
      alert('User stations updated successfully!');
    } catch (error) {
      console.error('Error updating user stations:', error.response?.data || error.message);
      alert('Failed to update user stations.');
    }
  };

  return (
    <div>
      <h2>Manage Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.email}) - Role:
            <select
              value={user.role}
              onChange={(e) => updateUserRole(user.id, e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="end_user">End User</option>
            </select>
            <br />
            Assign Stations:
            <select
              multiple
              value={user.UserStations ? user.UserStations.map((s) => s.id.toString()) : []}
              onChange={(e) => updateUserStations(user.id, e)}
            >
              {stations.map((station) => (
                <option key={station.id} value={station.id}>
                  {station.name}
                </option>
              ))}
            </select>
            <br />
            <button onClick={() => deleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageUsers;
