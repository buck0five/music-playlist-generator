// src/pages/UserList.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function UserList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setError('');
    axios
      .get('http://173.230.134.186:5000/api/users')
      .then((res) => {
        setUsers(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching users');
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Users</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Link to="/users/new">Create New User</Link>

      {users.length === 0 && !error && <p>No users found.</p>}

      {users.length > 0 && (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Role</th>
              <th>Stations Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.role || ''}</td>
                <td>{u.Stations ? u.Stations.length : 0}</td>
                <td>
                  <Link to={`/users/${u.id}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default UserList;
