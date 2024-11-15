// src/components/ManageContent.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ManageContent() {
  const [contents, setContents] = useState([]);
  const [contentLibraries, setContentLibraries] = useState([]);
  const [newContent, setNewContent] = useState({
    title: '',
    contentType: '',
    file: null,
    duration: '',
    tags: '',
    contentLibraries: [],
  });

  useEffect(() => {
    fetchContents();
    fetchContentLibraries();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await api.get('/admin/contents');
      setContents(response.data);
    } catch (error) {
      console.error('Error fetching contents:', error.response?.data || error.message);
      alert('Failed to fetch contents.');
    }
  };

  const fetchContentLibraries = async () => {
    try {
      const response = await api.get('/admin/content-libraries');
      setContentLibraries(response.data);
    } catch (error) {
      console.error('Error fetching content libraries:', error.response?.data || error.message);
      alert('Failed to fetch content libraries.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContent({ ...newContent, [name]: value });
  };

  const handleFileChange = (e) => {
    setNewContent({ ...newContent, file: e.target.files[0] });
  };

  const handleContentLibrariesChange = (e) => {
    const options = e.target.options;
    const selectedLibraries = [];
    for (const option of options) {
      if (option.selected) {
        selectedLibraries.push(option.value);
      }
    }
    setNewContent({ ...newContent, contentLibraries: selectedLibraries });
  };

  const createContent = async () => {
    if (!newContent.title || !newContent.contentType || !newContent.file) {
      alert('Title, content type, and file are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', newContent.title);
    formData.append('contentType', newContent.contentType);
    formData.append('file', newContent.file);
    formData.append('duration', newContent.duration);
    formData.append('tags', newContent.tags);
    formData.append('contentLibraries', JSON.stringify(newContent.contentLibraries));

    try {
      await api.post('/admin/contents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setNewContent({
        title: '',
        contentType: '',
        file: null,
        duration: '',
        tags: '',
        contentLibraries: [],
      });
      fetchContents();
      alert('Content created successfully!');
    } catch (error) {
      console.error('Error creating content:', error.response?.data || error.message);
      alert('Failed to create content.');
    }
  };

  const deleteContent = async (contentId) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await api.delete(`/admin/contents/${contentId}`);
        fetchContents();
        alert('Content deleted successfully!');
      } catch (error) {
        console.error('Error deleting content:', error.response?.data || error.message);
        alert('Failed to delete content.');
      }
    }
  };

  return (
    <div>
      <h2>Manage Content</h2>
      <div>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newContent.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="contentType"
          placeholder="Content Type"
          value={newContent.contentType}
          onChange={handleInputChange}
        />
        <input type="file" name="file" onChange={handleFileChange} />
        <input
          type="text"
          name="duration"
          placeholder="Duration (optional)"
          value={newContent.duration}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated, optional)"
          value={newContent.tags}
          onChange={handleInputChange}
        />
        <select
          multiple
          value={newContent.contentLibraries}
          onChange={handleContentLibrariesChange}
        >
          {contentLibraries.map((library) => (
            <option key={library.id} value={library.id}>
              {library.name}
            </option>
          ))}
        </select>
        <button onClick={createContent}>Upload Content</button>
      </div>
      <h3>Existing Content</h3>
      <ul>
        {contents.map((content) => (
          <li key={content.id}>
            {content.title} ({content.contentType})
            <button onClick={() => deleteContent(content.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ManageContent;
