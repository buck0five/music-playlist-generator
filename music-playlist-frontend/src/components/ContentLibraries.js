// src/components/ContentLibraries.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ContentLibraries() {
  const [libraries, setLibraries] = useState([]);
  const [newLibraryName, setNewLibraryName] = useState('');
  const [assignableType, setAssignableType] = useState('Platform');
  const [assignableId, setAssignableId] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchLibraries();
    fetchAssignables();
  }, []);

  const fetchLibraries = async () => {
    try {
      const response = await api.get('/admin/content-libraries');
      setLibraries(response.data);
    } catch (error) {
      console.error('Error fetching content libraries:', error.response?.data || error.message);
      alert('Failed to fetch content libraries.');
    }
  };

  const fetchAssignables = async () => {
    try {
      const [platformRes, companyRes, stationRes] = await Promise.all([
        api.get('/admin/platforms'),
        api.get('/admin/companies'),
        api.get('/admin/stations'),
      ]);
      setPlatforms(platformRes.data);
      setCompanies(companyRes.data);
      setStations(stationRes.data);
    } catch (error) {
      console.error('Error fetching assignables:', error.response?.data || error.message);
      alert('Failed to fetch assignable entities.');
    }
  };

  const createLibrary = async () => {
    if (!newLibraryName.trim()) {
      alert('Content library name cannot be empty.');
      return;
    }

    try {
      await api.post('/admin/content-libraries', { name: newLibraryName });
      setNewLibraryName('');
      fetchLibraries();
      alert('Content library created successfully!');
    } catch (error) {
      console.error('Error creating content library:', error.response?.data || error.message);
      alert('Failed to create content library.');
    }
  };

  const assignLibrary = async (libraryId) => {
    if (!assignableId) {
      alert('Please select an entity to assign the content library to.');
      return;
    }

    try {
      await api.post('/admin/content-library-assignments', {
        contentLibraryId: libraryId,
        assignableType,
        assignableId,
      });
      alert('Content library assigned successfully!');
    } catch (error) {
      console.error('Error assigning content library:', error.response?.data || error.message);
      alert('Failed to assign content library.');
    }
  };

  return (
    <div>
      <h2>Content Libraries</h2>
      <div>
        <input
          type="text"
          placeholder="New Content Library Name"
          value={newLibraryName}
          onChange={(e) => setNewLibraryName(e.target.value)}
        />
        <button onClick={createLibrary}>Create</button>
      </div>
      <h3>Assign Content Library</h3>
      <div>
        <label>Assignable Type:</label>
        <select value={assignableType} onChange={(e) => setAssignableType(e.target.value)}>
          <option value="Platform">Platform</option>
          <option value="Company">Company</option>
          <option value="Station">Station</option>
        </select>
      </div>
      <div>
        <label>Assignable Entity:</label>
        <select
          value={assignableId}
          onChange={(e) => setAssignableId(e.target.value)}
        >
          <option value="">Select an entity</option>
          {assignableType === 'Platform' &&
            platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          {assignableType === 'Company' &&
            companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          {assignableType === 'Station' &&
            stations.map((station) => (
              <option key={station.id} value={station.id}>
                {station.name}
              </option>
            ))}
        </select>
      </div>
      <ul>
        {libraries.map((library) => (
          <li key={library.id}>
            {library.name}
            <button onClick={() => assignLibrary(library.id)}>Assign</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContentLibraries;
