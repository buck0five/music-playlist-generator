// src/pages/NewClockTemplate.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function NewClockTemplate() {
  const navigate = useNavigate();
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      templateName,
      description,
    };

    // Replace with your real IP or domain
    axios
      .post('http://173.230.134.186:5000/api/clock-templates', payload)
      .then((res) => {
        console.log('Created template:', res.data);
        navigate('/clock-templates');
      })
      .catch((err) => {
        setError('Error creating template');
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Create New Clock Template</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Template Name: </label>
          <input
            type="text"
            required
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
          />
        </div>
        <div>
          <label>Description: </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <button type="submit">Create</button>
      </form>
    </div>
  );
}

export default NewClockTemplate;
