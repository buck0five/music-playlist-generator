// src/components/ManageStations.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ManageStations() {
  const [stations, setStations] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchStations();
    fetchCompanies();
  }, []);

  const fetchStations = async () => {
    try {
      const response = await api.get('/admin/stations');
      setStations(response.data);
    } catch (error) {
      console.error('Error fetching stations:', error.response?.data || error.message);
      alert('Failed to fetch stations.');
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/admin/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error.response?.data || error.message);
      alert('Failed to fetch companies.');
    }
  };

  const createStation = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const companyId = form.companyId.value;

    try {
      await api.post('/admin/stations', { name, companyId });
      fetchStations();
      form.reset();
      alert('Station created successfully!');
    } catch (error) {
      console.error('Error creating station:', error.response?.data || error.message);
      alert('Failed to create station.');
    }
  };

  const deleteStation = async (stationId) => {
    if (window.confirm('Are you sure you want to delete this station?')) {
      try {
        await api.delete(`/admin/stations/${stationId}`);
        fetchStations();
        alert('Station deleted successfully!');
      } catch (error) {
        console.error('Error deleting station:', error.response?.data || error.message);
        alert('Failed to delete station.');
      }
    }
  };

  return (
    <div>
      <h2>Manage Stations</h2>
      <form onSubmit={createStation}>
        <input type="text" name="name" placeholder="Station Name" required />
        <select name="companyId" required>
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        <button type="submit">Create Station</button>
      </form>
      <ul>
        {stations.map((station) => (
          <li key={station.id}>
            {station.name} (Company ID: {station.companyId})
            <button onClick={() => deleteStation(station.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageStations;
