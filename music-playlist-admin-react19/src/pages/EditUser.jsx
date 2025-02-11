// src/pages/EditUser.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('store');
  const [parentUserId, setParentUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // child accounts and stations owned by this user
  const [children, setChildren] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = () => {
    setLoading(true);
    axios
      .get(`http://173.230.134.186:5000/api/users/${id}`)
      .then((res) => {
        setLoading(false);
        if (!res.data || !res.data.id) {
          setError('User not found');
          return;
        }
        const u = res.data;
        setName(u.name || '');
        setEmail(u.email || '');
        setRole(u.role || 'store');
        setParentUserId(u.parentUserId || '');
        setChildren(u.children || []);
        setStations(u.Stations || []);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching user');
        setLoading(false);
      });
  };

  const handleSave = () => {
    if (!name) {
      setError('User name is required');
      return;
    }
    setSaving(true);
    axios
      .put(`http://173.230.134.186:5000/api/users/${id}`, {
        name,
        email: email || null,
        role,
        parentUserId: parentUserId ? parseInt(parentUserId, 10) : null,
      })
      .then(() => {
        setSaving(false);
        navigate('/users');
      })
      .catch((err) => {
        console.error(err);
        setError('Error updating user');
        setSaving(false);
      });
  };

  if (loading) return <p>Loading user...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Edit User (ID: {id})</h2>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>User Name: </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Email: </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Role: </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          <option value="store">store</option>
          <option value="chain">chain</option>
          <option value="admin">admin</option>
        </select>
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Parent User ID: </label>
        <input
          type="number"
          value={parentUserId}
          onChange={(e) => setParentUserId(e.target.value)}
          style={{ marginLeft: '0.5rem', width: '80px' }}
        />
        <span style={{ marginLeft: '0.5rem' }}>
          (Leave blank if top-level user)
        </span>
      </div>
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save User'}
      </button>

      <hr />
      <button onClick={() => navigate('/users')}>Back to Users</button>

      <hr />
      <h3>Child Accounts</h3>
      {children.length === 0 && <p>No child accounts.</p>}
      {children.length > 0 && (
        <ul>
          {children.map((child) => (
            <li key={child.id}>
              [ID: {child.id}] {child.name} - role: {child.role}
            </li>
          ))}
        </ul>
      )}

      <h3>Stations Owned</h3>
      {stations.length === 0 && <p>No stations owned by this user.</p>}
      {stations.length > 0 && (
        <ul>
          {stations.map((st) => (
            <li key={st.id}>
              [ID: {st.id}] {st.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EditUser;
