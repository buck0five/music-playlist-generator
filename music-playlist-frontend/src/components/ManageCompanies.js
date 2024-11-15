// src/components/ManageCompanies.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ManageCompanies() {
  const [companies, setCompanies] = useState([]);
  const [newCompanyName, setNewCompanyName] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/admin/companies');
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error.response?.data || error.message);
      alert('Failed to fetch companies.');
    }
  };

  const createCompany = async () => {
    if (!newCompanyName.trim()) {
      alert('Company name cannot be empty.');
      return;
    }

    try {
      await api.post('/admin/companies', { name: newCompanyName });
      setNewCompanyName('');
      fetchCompanies();
      alert('Company created successfully!');
    } catch (error) {
      console.error('Error creating company:', error.response?.data || error.message);
      alert('Failed to create company.');
    }
  };

  const deleteCompany = async (companyId) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await api.delete(`/admin/companies/${companyId}`);
        fetchCompanies();
        alert('Company deleted successfully!');
      } catch (error) {
        console.error('Error deleting company:', error.response?.data || error.message);
        alert('Failed to delete company.');
      }
    }
  };

  return (
    <div>
      <h2>Manage Companies</h2>
      <div>
        <input
          type="text"
          placeholder="New Company Name"
          value={newCompanyName}
          onChange={(e) => setNewCompanyName(e.target.value)}
        />
        <button onClick={createCompany}>Create Company</button>
      </div>
      <ul>
        {companies.map((company) => (
          <li key={company.id}>
            {company.name}
            <button onClick={() => deleteCompany(company.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageCompanies;
