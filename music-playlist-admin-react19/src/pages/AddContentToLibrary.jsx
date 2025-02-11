// src/pages/AddContentToLibrary.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function AddContentToLibrary() {
  const { libraryId } = useParams();
  const navigate = useNavigate();

  const [allContent, setAllContent] = useState([]);
  const [error, setError] = useState('');
  const [libraryName, setLibraryName] = useState('');

  useEffect(() => {
    fetchLibraryName();
    fetchContentNotInLibrary();
  }, [libraryId]);

  // optional: get library name to display
  const fetchLibraryName = () => {
    axios
      .get(`http://173.230.134.186:5000/api/content-libraries/${libraryId}`)
      .then((res) => {
        if (res.data && res.data.name) {
          setLibraryName(res.data.name);
        }
      })
      .catch((err) => console.error(err));
  };

  const fetchContentNotInLibrary = () => {
    setError('');
    // fetch all content, then filter out those that are already in this libraryId
    axios
      .get('http://173.230.134.186:5000/api/content')
      .then((res) => {
        const contents = res.data || [];
        // filter out items that are in libraryId
        const filtered = contents.filter((c) => c.libraryId !== parseInt(libraryId, 10));
        setAllContent(filtered);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching content');
      });
  };

  // “Add” means set content.libraryId = this library
  const handleAdd = (contentId) => {
    axios
      .put(`http://173.230.134.186:5000/api/content/${contentId}`, {
        libraryId: parseInt(libraryId, 10),
      })
      .then(() => {
        // remove item from local allContent
        setAllContent((prev) => prev.filter((c) => c.id !== contentId));
      })
      .catch((err) => {
        console.error(err);
        setError('Error adding content to library');
      });
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Add Existing Content to Library (ID: {libraryId})</h2>
      {libraryName && <p>Library Name: {libraryName}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {allContent.length === 0 ? (
        <p>No available content to add. (All are in this library or another library.)</p>
      ) : (
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Current Library</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allContent.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.title}</td>
                <td>{c.contentType}</td>
                <td>{c.libraryId || '(none)'}</td>
                <td>
                  <button onClick={() => handleAdd(c.id)}>Add</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />
      <button onClick={() => navigate(`/content-libraries/${libraryId}/edit`)}>
        Back to Library
      </button>
    </div>
  );
}

export default AddContentToLibrary;
