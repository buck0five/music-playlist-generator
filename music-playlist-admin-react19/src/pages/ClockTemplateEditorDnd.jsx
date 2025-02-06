// src/pages/ClockTemplateEditorDnd.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function ClockTemplateEditorDnd() {
  const { id } = useParams(); // clockTemplateId
  const [template, setTemplate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Station ID - optional if you want to filter carts. 
  // If your logic gets stationId from the clock template or from user input, adapt accordingly:
  const [stationId, setStationId] = useState('1'); // example default

  // We'll store the station's carts if we want them for slotType='cart'
  const [carts, setCarts] = useState([]);

  // Fetch the clock template (and slots) on mount
  useEffect(() => {
    axios
      .get(`http://173.230.134.186:5000/api/clock-templates/${id}`)
      .then((res) => {
        setTemplate(res.data);
        if (res.data && res.data.slots) {
          // sort by minuteOffset or existing logic
          const sortedSlots = [...res.data.slots].sort(
            (a, b) => a.minuteOffset - b.minuteOffset
          );
          setSlots(sortedSlots);
        }
      })
      .catch((err) => {
        setError('Error fetching clock template');
        console.error(err);
      });
  }, [id]);

  // Optionally fetch station's carts if you want a cart dropdown
  useEffect(() => {
    if (!stationId) return;
    axios
      .get(`http://173.230.134.186:5000/api/carts?stationId=${stationId}`)
      .then((res) => {
        setCarts(res.data || []);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [stationId]);

  // DnD reorder logic
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newSlots = Array.from(slots);
    const [moved] = newSlots.splice(result.source.index, 1);
    newSlots.splice(result.destination.index, 0, moved);

    // For demonstration, we recalc minuteOffset = index*5 
    newSlots.forEach((slot, idx) => {
      slot.minuteOffset = idx * 5;
    });

    setSlots(newSlots);
  };

  // Update slot's cartId or slotType if user picks a different type/cart
  const handleSlotFieldChange = (slotId, field, value) => {
    const newSlots = slots.map((slot) => {
      if (slot.id === slotId) {
        return { ...slot, [field]: value };
      }
      return slot;
    });
    setSlots(newSlots);
  };

  // Save reorder or field changes
  const handleSave = () => {
    setSaving(true);
    const payload = {
      slots: slots.map((s) => ({
        id: s.id,
        minuteOffset: s.minuteOffset,
        slotType: s.slotType,
        cartId: s.slotType === 'cart' ? s.cartId : null,
      })),
    };

    axios
      .put(`http://173.230.134.186:5000/api/clock-templates/${id}/slots`, payload)
      .then(() => {
        setSaving(false);
        alert('Slots updated successfully!');
      })
      .catch((err) => {
        setSaving(false);
        setError('Error saving slot reorder');
        console.error(err);
      });
  };

  if (error) {
    return <p style={{ color: 'red', margin: '1rem' }}>{error}</p>;
  }
  if (!template) {
    return <p style={{ margin: '1rem' }}>Loading clock template...</p>;
  }

  return (
    <div style={{ margin: '1rem' }}>
      <h2>Clock Template DnD: {template.templateName}</h2>
      <p>{template.description || ''}</p>

      {/* Optional: choose station for cart reference */}
      <div style={{ marginBottom: '1rem' }}>
        <label>Station ID (for cart loading): </label>
        <input
          type="number"
          value={stationId}
          onChange={(e) => setStationId(e.target.value)}
          style={{ width: '60px' }}
        />
        <span style={{ marginLeft: '1rem' }}>
          {carts.length} carts loaded for station {stationId}
        </span>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="slots">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{ background: '#fafafa', padding: '1rem' }}
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
                        background: '#fff',
                        border: '1px solid #ccc',
                        marginBottom: '0.5rem',
                        padding: '0.5rem',
                        ...provided2.draggableProps.style,
                      }}
                    >
                      <div style={{ marginBottom: '0.5rem' }}>
                        <strong>Slot ID:</strong> {slot.id} |{' '}
                        <strong>Offset:</strong> {slot.minuteOffset} min
                      </div>

                      <div style={{ marginBottom: '0.5rem' }}>
                        <label>Type: </label>
                        <select
                          value={slot.slotType}
                          onChange={(e) =>
                            handleSlotFieldChange(
                              slot.id,
                              'slotType',
                              e.target.value
                            )
                          }
                        >
                          <option value="song">song</option>
                          <option value="cart">cart</option>
                          <option value="jingle">jingle</option>
                          {/* or other types you use */}
                        </select>
                      </div>

                      {slot.slotType === 'cart' && (
                        <div style={{ marginBottom: '0.5rem' }}>
                          <label>Cart:</label>
                          <select
                            value={slot.cartId || ''}
                            onChange={(e) =>
                              handleSlotFieldChange(
                                slot.id,
                                'cartId',
                                parseInt(e.target.value, 10)
                              )
                            }
                          >
                            <option value="">-- select cart --</option>
                            {carts.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name} ({c.category || 'no-cat'}) [ID {c.id}]
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Reorder'}
      </button>
    </div>
  );
}

export default ClockTemplateEditorDnd;
