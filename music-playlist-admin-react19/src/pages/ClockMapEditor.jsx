// src/pages/ClockMapEditor.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function ClockMapEditor() {
  const { mapId } = useParams();
  const [clockMap, setClockMap] = useState(null);
  const [slots, setSlots] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    fetchMap();
    fetchTemplates();
  }, [mapId]);

  const fetchMap = () => {
    setError('');
    setStatus('');
    axios
      .get(`http://173.230.134.186:5000/api/clock-maps/${mapId}`)
      .then((res) => {
        if (!res.data || !res.data.id) {
          setError('Clock Map not found.');
          return;
        }
        setClockMap(res.data);

        const arr = res.data.ClockMapSlots || [];
        // parse dayOfWeek/hour to int
        const normalized = arr.map((s) => ({
          ...s,
          dayOfWeek: parseInt(s.dayOfWeek, 10),
          hour: parseInt(s.hour, 10),
        }));
        setSlots(normalized);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching clock map.');
      });
  };

  const fetchTemplates = () => {
    axios
      .get('http://173.230.134.186:5000/api/clock-templates')
      .then((res) => setTemplates(res.data || []))
      .catch((err) => console.error(err));
  };

  const findSlot = (d, h) => {
    return slots.find((slot) => slot.dayOfWeek === d && slot.hour === h);
  };

  const handleSlotChange = (dayOfWeek, hour, newTemplateId) => {
    const existing = findSlot(dayOfWeek, hour);
    const parsedId = newTemplateId ? parseInt(newTemplateId, 10) : null;
    if (existing) {
      existing.clockTemplateId = parsedId;
      setSlots([...slots]);
    } else {
      setSlots([
        ...slots,
        {
          id: null,
          dayOfWeek,
          hour,
          clockTemplateId: parsedId,
        },
      ]);
    }
  };

  const handleSave = () => {
    setStatus('Saving...');
    axios
      .put(`http://173.230.134.186:5000/api/clock-maps/${mapId}/slots`, { slots })
      .then((res) => {
        setStatus('Saved!');
        if (res.data.clockMap) {
          // parse them again in case we get them as strings
          const cm = res.data.clockMap;
          const norm = (cm.ClockMapSlots || []).map((s) => ({
            ...s,
            dayOfWeek: parseInt(s.dayOfWeek, 10),
            hour: parseInt(s.hour, 10),
          }));
          setClockMap(cm);
          setSlots(norm);
        }
      })
      .catch((err) => {
        console.error(err);
        setError('Error saving map slots.');
        setStatus('');
      });
  };

  if (!clockMap) {
    return <p>{error || 'Loading map...'}</p>;
  }

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Clock Map Editor: {clockMap.name}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>{clockMap.description || ''}</p>

      <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Hour \ Day</th>
            {days.map((dayLabel, dIndex) => (
              <th key={dIndex}>{dayLabel}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hr) => (
            <tr key={hr}>
              <td>
                <strong>{hr}:00</strong>
              </td>
              {days.map((_, dIndex) => {
                const slot = findSlot(dIndex, hr);
                const chosenId = slot && slot.clockTemplateId ? slot.clockTemplateId : '';
                return (
                  <td key={`${dIndex}-${hr}`}>
                    <select
                      value={chosenId}
                      onChange={(e) => handleSlotChange(dIndex, hr, e.target.value)}
                    >
                      <option value="">(none)</option>
                      {templates.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.templateName} (ID {t.id})
                        </option>
                      ))}
                    </select>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleSave}>{status || 'Save Map'}</button>
      </div>
    </div>
  );
}

export default ClockMapEditor;
