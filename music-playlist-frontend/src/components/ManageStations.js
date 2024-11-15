// src/components/ManageStations.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ManageStations() {
  const [stations, setStations] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [newStation, setNewStation] = useState({
    name: '',
    companyId: '',
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStation({ ...newStation, [name]: value });
  };

  const createStation = async () => {
    if (!newStation.name.trim() || !newStation.companyId) {
      alert('Please provide station name and select a company.');
      return;
    }

    try {
      await api.post('/admin/stations', newStation);
      setNewStation({ name: '', companyId: '' });
      fetchStations();
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
      <div>
        <input
          type="text"
          name="name"
          placeholder="New Station Name"
          value={newStation.name}
          onChange={handleInputChange}
        />
        <select
          name="companyId"
          value={newStation.companyId}
          onChange={handleInputChange}
        >
          <option value="">Select Company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        <button onClick={createStation}>Create Station</button>
      </div>
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
