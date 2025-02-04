// src/pages/ClockTemplateEditorDnd.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DragDropContext,
  Droppable,
  Draggable,
} from 'react-beautiful-dnd';

/**
 * A drag-and-drop Clock Template Editor with:
 *  - "slots" each having { id, minuteOffset, slotType, cartId }
 *  - Searching by slotType, minuteOffset, cartId
 *  - Reassign offsets on drag reorder
 *  - Save button to PUT changes
 *  - Add and delete slots
 */

function ClockTemplateEditorDnd() {
  const { id: clockTemplateId } = useParams(); // the :id from route
  const navigate = useNavigate();

  const [template, setTemplate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the clock template (including slots)
  useEffect(() => {
    loadTemplate();
  }, [clockTemplateId]);

  const loadTemplate = () => {
    setLoading(true);
    axios
      .get(`http://173.230.134.186:5000/api/clock-templates/${clockTemplateId}`)
      .then((res) => {
        const tmpl = res.data;
        setTemplate(tmpl);

        // Sort slots by minuteOffset ascending
        const sortedSlots = (tmpl.slots || []).slice().sort(
          (a, b) => a.minuteOffset - b.minuteOffset
        );
        setSlots(sortedSlots);

        setLoading(false);
        setError('');
      })
      .catch((err) => {
        console.error(err);
        setError('Error loading clock template');
        setLoading(false);
      });
  };

  // Filtered slots based on searchTerm
  const filteredSlots = slots.filter((slot) => {
    if (!searchTerm) return true;
    // we search in minuteOffset, slotType, cartId
    const term = searchTerm.toLowerCase();
    const offsetStr = String(slot.minuteOffset || '').toLowerCase();
    const typeStr = String(slot.slotType || '').toLowerCase();
    const cartStr = String(slot.cartId || '').toLowerCase();
    return (
      offsetStr.includes(term) ||
      typeStr.includes(term) ||
      cartStr.includes(term)
    );
  });

  // Reorder function for drag-and-drop
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  // When user finishes dragging
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const newSlots = reorder(
      filteredSlots, // but we need the full slots list
      result.source.index,
      result.destination.index
    );
    // This reordering only applies to the filtered subset, so we should
    // properly reorder the main slots array too.
    applyReorderToAllSlots(newSlots, result.source.index, result.destination.index);
  };

  const applyReorderToAllSlots = (filteredListReordered, sourceIndex, destIndex) => {
    /**
     * This approach is a bit tricky because user is dragging within the "filteredSlots" subset,
     * but we want to reorder the entire "slots" array accordingly. 
     * We'll do a simpler approach: if searchTerm is empty, we reorder the entire array by index.
     * If there's a searchTerm, we can still try to reassign minuteOffset. 
     *
     * For simplicity, let's assume the user won't do complicated drag moves while filtering.
     * We'll just reassign minuteOffsets in the new order from 0.. step.
     */
    if (searchTerm) {
      alert("Drag reorder with a search filter can be confusing. Try clearing the search first.");
    }

    // We'll recast the entire unfiltered 'slots' array in the new order
    const newSlots = [...slots];
    // apply the same reorder function on the *full* array if searchTerm is empty
    if (!searchTerm) {
      const res = reorder(newSlots, sourceIndex, destIndex);
      // now reassign minuteOffset = index for each
      for (let i = 0; i < res.length; i++) {
        res[i].minuteOffset = i; // or i if we want 0..some range
      }
      setSlots(res);
    } else {
      // if user has searchTerm, we just do nothing or do partial reorder
      // we'll do the partial reorder of the filtered subset, reassign offsets, then update the main array
      // This is simpler if user is not doing complicated re-sorting while filtered
      for (let i = 0; i < filteredListReordered.length; i++) {
        filteredListReordered[i].minuteOffset = i;
      }
      // now we update the main "slots" array by slotId
      const newMap = {};
      filteredListReordered.forEach((slot) => {
        newMap[slot.id] = slot.minuteOffset;
      });
      const updated = newSlots.map((s) =>
        newMap[s.id] !== undefined ? { ...s, minuteOffset: newMap[s.id] } : s
      );
      setSlots(updated);
    }
  };

  // Inline changes to fields
  const updateSlotField = (slotId, field, value) => {
    const newArr = slots.map((s) =>
      s.id === slotId
        ? {
            ...s,
            [field]: value,
          }
        : s
    );
    setSlots(newArr);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const saveChanges = () => {
    // put each slot's new data
    Promise.all(
      slots.map((slot) =>
        axios.put(`http://173.230.134.186:5000/api/clock-template-slots/${slot.id}`, {
          minuteOffset: slot.minuteOffset,
          slotType: slot.slotType,
          cartId: slot.cartId,
        })
      )
    )
      .then(() => {
        alert('Slots updated successfully');
        loadTemplate(); // refresh
      })
      .catch((err) => {
        console.error(err);
        setError('Error saving slot changes');
      });
  };

  const addSlot = () => {
    axios
      .post('http://173.230.134.186:5000/api/clock-template-slots', {
        clockTemplateId: parseInt(clockTemplateId, 10),
        slotType: 'music',
        minuteOffset: 0,
        cartId: null,
      })
      .then((res) => {
        const newSlot = res.data;
        setSlots([...slots, newSlot]);
      })
      .catch((err) => {
        console.error(err);
        setError('Error adding slot');
      });
  };

  const deleteSlot = (slotId) => {
    axios
      .delete(`http://173.230.134.186:5000/api/clock-template-slots/${slotId}`)
      .then(() => {
        setSlots(slots.filter((s) => s.id !== slotId));
      })
      .catch((err) => {
        console.error(err);
        setError('Error deleting slot');
      });
  };

  if (loading) return <p>Loading template...</p>;
  if (!template) return <p style={{ color: 'red' }}>{error || 'Template not found'}</p>;

  // The displayed "list" is the filteredSlots
  // We'll pass that to DragDropContext for reordering
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>Clock Template Editor (Drag & Drop) - {template.templateName}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ marginBottom: '1rem' }}>
        <label>Search Slots: </label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Type offset, slotType, or cartId"
        />
      </div>

      <button onClick={addSlot}>Add Slot</button>{' '}
      <button onClick={saveChanges}>Save Changes</button>

      <hr />

      <DragDropContext onDragEnd={onDragEnd}>
        <table border="1" cellPadding="5" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ width: '10%' }}>Minute</th>
              <th style={{ width: '20%' }}>Slot Type</th>
              <th style={{ width: '20%' }}>Cart ID</th>
              <th style={{ width: '10%' }}>Actions</th>
            </tr>
          </thead>

          <Droppable droppableId="slotsDroppable">
            {(provided) => (
              <tbody
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ backgroundColor: '#f9f9f9' }}
              >
                {filteredSlots
                  .slice()
                  .sort((a, b) => a.minuteOffset - b.minuteOffset)
                  .map((slot, index) => (
                    <Draggable
                      draggableId={String(slot.id)}
                      index={index}
                      key={slot.id}
                    >
                      {(provided) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          {/* minuteOffset */}
                          <td>
                            <input
                              type="number"
                              style={{ width: '60px' }}
                              value={slot.minuteOffset}
                              min={0}
                              max={59}
                              onChange={(e) => {
                                let val = parseInt(e.target.value, 10);
                                if (isNaN(val)) val = 0;
                                if (val < 0) val = 0;
                                if (val > 59) val = 59;
                                updateSlotField(slot.id, 'minuteOffset', val);
                              }}
                            />
                          </td>

                          {/* slotType */}
                          <td>
                            <select
                              value={slot.slotType}
                              onChange={(e) => updateSlotField(slot.id, 'slotType', e.target.value)}
                            >
                              <option value="music">music</option>
                              <option value="adCart">adCart</option>
                              <option value="jingle">jingle</option>
                              <option value="network">network</option>
                              {/* etc. */}
                            </select>
                          </td>

                          {/* cartId */}
                          <td>
                            <input
                              type="number"
                              style={{ width: '80px' }}
                              value={slot.cartId || ''}
                              onChange={(e) => {
                                const val = e.target.value !== '' ? parseInt(e.target.value, 10) : null;
                                updateSlotField(slot.id, 'cartId', val);
                              }}
                            />
                          </td>

                          <td>
                            <button onClick={() => deleteSlot(slot.id)}>Delete</button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </tbody>
            )}
          </Droppable>
        </table>
      </DragDropContext>
    </div>
  );
}

export default ClockTemplateEditorDnd;
