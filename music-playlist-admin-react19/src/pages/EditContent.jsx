// src/pages/EditContent.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function EditContent() {
  const { id } = useParams(); // contentId
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('');
  const [formatId, setFormatId] = useState('');
  const [duration, setDuration] = useState('');
  const [score, setScore] = useState('');
  const [fileName, setFileName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dailyStartHour, setDailyStartHour] = useState('');
  const [dailyEndHour, setDailyEndHour] = useState('');
  const [visibility, setVisibility] = useState('');

  // For library checkboxes
  const [allLibraries, setAllLibraries] = useState([]);
  const [checkedLibraries, setCheckedLibraries] = useState([]); // array of library IDs

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAllLibraries();
    fetchContentItem();
  }, [id]);

  const fetchAllLibraries = () => {
    axios
      .get('http://173.230.134.186:5000/api/content-libraries')
      .then((res) => setAllLibraries(res.data || []))
      .catch((err) => console.error(err));
  };

  const fetchContentItem = () => {
    setLoading(true);
    axios
      .get(`http://173.230.134.186:5000/api/content/${id}?include=ContentLibraries`)
      .then((res) => {
        setLoading(false);
        if (!res.data || !res.data.id) {
          setError('Content not found');
          return;
        }
        const c = res.data;
        setTitle(c.title || '');
        setContentType(c.contentType || '');
        setFormatId(c.formatId || '');
        setDuration(c.duration || '');
        setScore(c.score !== undefined ? c.score : '');
        setFileName(c.fileName || '');
        setStartDate(c.startDate || '');
        setEndDate(c.endDate || '');
        setDailyStartHour(c.dailyStartHour !== null ? c.dailyStartHour : '');
        setDailyEndHour(c.dailyEndHour !== null ? c.dailyEndHour : '');
        setVisibility(c.visibility || '');

        // c.ContentLibraries might be an array of library objects
        const libIds = (c.ContentLibraries || []).map((lib) => lib.id);
        setCheckedLibraries(libIds);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching content');
        setLoading(false);
      });
  };

  const handleCheckboxChange = (libraryId) => {
    if (checkedLibraries.includes(libraryId)) {
      // remove
      setCheckedLibraries((prev) => prev.filter((id) => id !== libraryId));
    } else {
      // add
      setCheckedLibraries((prev) => [...prev, libraryId]);
    }
  };

  const handleSave = () => {
    if (!title || !contentType) {
      setError('Title and contentType are required');
      return;
    }
    setSaving(true);

    // First update the basic content fields:
    axios
      .put(`http://173.230.134.186:5000/api/content/${id}`, {
        title,
        contentType,
        formatId: formatId !== '' ? parseInt(formatId, 10) : null,
        duration: duration !== '' ? parseInt(duration, 10) : null,
        score: score !== '' ? parseFloat(score) : null,
        fileName: fileName || null,
        startDate: startDate || null,
        endDate: endDate || null,
        dailyStartHour:
          dailyStartHour !== '' ? parseInt(dailyStartHour, 10) : null,
        dailyEndHour:
          dailyEndHour !== '' ? parseInt(dailyEndHour, 10) : null,
        visibility: visibility || null,
      })
      .then(() => {
        // Now set the library membership
        return axios.put(
          `http://173.230.134.186:5000/api/content/${id}/libraries`,
          { libraryIds: checkedLibraries }
        );
      })
      .then(() => {
        setSaving(false);
        navigate('/content');
      })
      .catch((err) => {
        console.error(err);
        setError('Error updating content');
        setSaving(false);
      });
  };

  if (loading) return <p>Loading content...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Edit Content (ID: {id})</h2>

      {/* Basic fields */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Title: </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '0.5rem' }}>
        <label>Content Type: </label>
        <input
          type="text"
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        />
      </div>
      {/* You can similarly show fields for formatId, duration, score, etc. */}

      {/* Library checkboxes */}
      <div style={{ margin: '1rem 0' }}>
        <h3>Libraries</h3>
        {allLibraries.length === 0 ? (
          <p>No libraries found.</p>
        ) : (
          allLibraries.map((lib) => {
            const isChecked = checkedLibraries.includes(lib.id);
            return (
              <div key={lib.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCheckboxChange(lib.id)}
                  />
                  {lib.name} (ID {lib.id})
                </label>
              </div>
            );
          })
        )}
      </div>

      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Content'}
      </button>
    </div>
  );
}

export default EditContent;
