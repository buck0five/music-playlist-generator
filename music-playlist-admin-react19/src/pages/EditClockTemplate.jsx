// src/pages/EditClockTemplate.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function EditClockTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingTemplate, setSavingTemplate] = useState(false);
  const [savingSlots, setSavingSlots] = useState(false);

  useEffect(() => {
    fetchClockTemplate();
  }, [id]);

  const fetchClockTemplate = () => {
    setLoading(true);
    setError('');
    axios
      .get(`http://173.230.134.186:5000/api/clock-templates/${id}`)
      .then((res) => {
        const ct = res.data;
        if (!ct || !ct.id) {
          setError('Clock template not found.');
          setLoading(false);
          return;
        }
        setTemplateName(ct.templateName || '');
        setDescription(ct.description || '');
        if (ct.slots && ct.slots.length) {
          const sorted = [...ct.slots].sort((a, b) => a.minuteOffset - b.minuteOffset);
          setSlots(sorted);
        } else {
          setSlots([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Error fetching clock template.');
        setLoading(false);
      });
  };

  const handleSaveTemplate = () => {
    setSavingTemplate(true);
    axios
      .put(`http://173.230.134.186:5000/api/clock-templates/${id}`, {
        templateName,
        description,
      })
      .then(() => {
        setSavingTemplate(false);
        alert('Template info updated!');
      })
      .catch((err) => {
        console.error(err);
        setSavingTemplate(false);
        setError('Error updating template info.');
      });
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newSlots = Array.from(slots);
    const [moved] = newSlots.splice(result.source.index, 1);
    newSlots.splice(result.destination.index, 0, moved);

    newSlots.forEach((slot, idx) => {
      slot.minuteOffset = idx * 5;
    });
    setSlots(newSlots);
  };

  const handleSaveSlots = () => {
    setSavingSlots(true);
    const payload = {
      slots: slots.map((s) => ({
        id: s.id,
        minuteOffset: s.minuteOffset,
        slotType: s.slotType,
        cartId: s.cartId || null,
      })),
    };
    axios
      .put(`http://173.230.134.186:5000/api/clock-templates/${id}/slots`, payload)
      .then(() => {
        setSavingSlots(false);
        alert('Slots updated successfully!');
      })
      .catch((err) => {
        console.error(err);
        setSavingSlots(false);
        setError('Error saving slot reorder.');
      });
  };

  if (loading) return <p style={{ margin: '1rem' }}>Loading clock template...</p>;
  if (error) return <p style={{ color: 'red', margin: '1rem' }}>{error}</p>;

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Edit Clock Template (ID: {id})</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.3rem' }}>
          Template Name:
        </label>
        <input
          type="text"
          value={templateName}
          onChange={(e) => setTemplateName(e.target.value)}
          style={{ width: '300px', marginBottom: '0.5rem' }}
        />
        <br />
        <label style={{ display: 'block', marginBottom: '0.3rem' }}>
          Description:
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ width: '300px' }}
        />

        <div style={{ marginTop: '0.5rem' }}>
          <button onClick={handleSaveTemplate} disabled={savingTemplate}>
            {savingTemplate ? 'Saving...' : 'Update Template Info'}
          </button>
        </div>
      </div>

      <hr style={{ margin: '1rem 0' }} />

      <h3>Slots (Drag & Drop to Reorder)</h3>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slotsDroppable">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                padding: '1rem',
                background: '#fafafa',
                width: '350px',
                minHeight: '100px',
              }}
            >
              {slots.map((slot, index) => (
                <Draggable
                  key={slot.id.toString()}
                  draggableId={slot.id.toString()}
                  index={index}
                >
                  {(provided2) => (
                    <div
                      ref={provided2.innerRef}
                      {...provided2.draggableProps}
                      {...provided2.dragHandleProps}
                      style={{
                        border: '1px solid #ccc',
                        background: '#fff',
                        marginBottom: '0.5rem',
                        padding: '0.5rem',
                        ...provided2.draggableProps.style,
                      }}
                    >
                      <p style={{ margin: 0 }}>
                        <strong>ID:</strong> {slot.id} <br />
                        <strong>Offset:</strong> {slot.minuteOffset} min <br />
                        <strong>Type:</strong> {slot.slotType}{' '}
                        {slot.cartId ? `(Cart ID: ${slot.cartId})` : ''}
                      </p>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleSaveSlots} disabled={savingSlots}>
          {savingSlots ? 'Saving...' : 'Save Slots'}
        </button>
      </div>

      <hr style={{ margin: '1rem 0' }} />

      <button onClick={() => navigate('/clock-templates')} style={{ marginTop: '1rem' }}>
        Back to Clock Templates
      </button>
    </div>
  );
}

export default EditClockTemplate;
