// src/pages/ClockTemplateList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ClockTemplateList() {
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://173.230.134.186:5000/api/clock-templates')
      .then((res) => {
        setTemplates(res.data);
      })
      .catch((err) => {
        setError('Error fetching clock templates');
        console.error(err);
      });
  }, [refreshKey]);

  const goToNew = () => {
    navigate('/clock-templates/new');
  };

  const goToEdit = (id) => {
    navigate(`/clock-templates/${id}/edit`);
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://173.230.134.186:5000/api/clock-templates/${id}`)
      .then((res) => {
        console.log('Deleted template:', res.data);
        setRefreshKey((prev) => prev + 1);
      })
      .catch((err) => {
        setError('Error deleting template');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>All Clock Templates</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={goToNew}>New Template</button>

      {templates.length === 0 && !error && <p>No templates found.</p>}

      {templates.length > 0 && (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Template Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tmpl) => (
              <tr key={tmpl.id}>
                <td>{tmpl.id}</td>
                <td>{tmpl.templateName}</td>
                <td>{tmpl.description}</td>
                <td>
                  <button onClick={() => goToEdit(tmpl.id)}>Edit</button>{' '}
                  <button onClick={() => handleDelete(tmpl.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ClockTemplateList;
