// src/pages/EditClockTemplate.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditClockTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://173.230.134.186:5000/api/clock-templates/${id}`)
      .then((res) => {
        const tmpl = res.data;
        setTemplateName(tmpl.templateName || '');
        setDescription(tmpl.description || '');
        setLoading(false);
      })
      .catch((err) => {
        setError('Error fetching template data');
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { templateName, description };

    axios
      .put(`http://173.230.134.186:5000/api/clock-templates/${id}`, payload)
      .then((res) => {
        console.log('Updated template:', res.data);
        navigate('/clock-templates');
      })
      .catch((err) => {
        setError('Error updating template');
        console.error(err);
      });
  };

  if (loading) {
    return <p>Loading template data...</p>;
  }

  return (
    <div>
      <h2>Edit Clock Template (ID: {id})</h2>
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

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default EditClockTemplate;
