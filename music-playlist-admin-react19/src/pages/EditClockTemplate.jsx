// File: /music-playlist-admin-react19/src/pages/EditClockTemplate.jsx

import React, { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Sortable item component
const SortableItem = ({ 
  id, 
  slotType, 
  minuteOffset, 
  cartId,
  onTypeChange,
  onDelete,
  availableCarts = []
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    border: '1px solid #ccc',
    padding: '15px',
    margin: '8px 0',
    backgroundColor: 'white',
    borderRadius: '4px',
    cursor: 'grab',
    userSelect: 'none'
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div {...attributes} {...listeners} style={{ 
          padding: '8px', 
          backgroundColor: '#f0f0f0', 
          borderRadius: '4px',
          marginRight: '10px'
        }}>
          ⋮⋮ Drag
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '8px' }}>
            <label style={{ marginRight: '8px' }}>Type:</label>
            <select 
              value={slotType} 
              onChange={(e) => onTypeChange(id, e.target.value)}
              style={{ padding: '4px', minWidth: '120px' }}
            >
              <option value="song">Song</option>
              <option value="cart">Cart</option>
              <option value="jingle">Jingle</option>
            </select>
          </div>

          {slotType === 'cart' && (
            <div style={{ marginBottom: '8px' }}>
              <label style={{ marginRight: '8px' }}>Cart:</label>
              <select 
                value={cartId || ''} 
                onChange={(e) => onTypeChange(id, 'cart', e.target.value)}
                style={{ padding: '4px', minWidth: '120px' }}
              >
                <option value="">Select Cart</option>
                {availableCarts.map(cart => (
                  <option key={cart.id} value={cart.id}>
                    {cart.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>Minute Offset: {minuteOffset}</div>
        </div>

        <button 
          onClick={() => onDelete(id)}
          style={{
            padding: '4px 8px',
            backgroundColor: '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

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
  const [availableCarts, setAvailableCarts] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchClockTemplate();
  }, [id]);

  // Fetch available carts
  useEffect(() => {
    const fetchCarts = async () => {
      try {
        const response = await axios.get('http://173.230.134.186:5000/api/carts');
        setAvailableCarts(response.data);
      } catch (err) {
        console.error('Error fetching carts:', err);
      }
    };
    fetchCarts();
  }, []);

  const fetchClockTemplate = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`http://173.230.134.186:5000/api/clock-templates/${id}`);
      const ct = res.data;
      
      if (!ct || !ct.id) {
        setError('Clock template not found.');
        return;
      }

      setTemplateName(ct.templateName || '');
      setDescription(ct.description || '');
      
      if (ct.slots && ct.slots.length) {
        const sorted = [...ct.slots].sort((a, b) => a.minuteOffset - b.minuteOffset);
        setSlots(sorted);
      } else {
        // Add some default slots if none exist
        setSlots([
          { id: '1', slotType: 'song', minuteOffset: 0 },
          { id: '2', slotType: 'cart', minuteOffset: 5, cartId: null },
          { id: '3', slotType: 'song', minuteOffset: 10 },
        ]);
      }
    } catch (err) {
      console.error('Error fetching template:', err);
      setError('Error fetching clock template.');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSlots((items) => {
        const oldIndex = items.findIndex(item => item.id.toString() === active.id);
        const newIndex = items.findIndex(item => item.id.toString() === over.id);
        
        return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          minuteOffset: index * 5
        }));
      });
    }
  };

  const handleAddSlot = () => {
    const newSlot = {
      id: `new-${Date.now()}`, // temporary ID
      slotType: 'song',
      minuteOffset: slots.length * 5,
      cartId: null
    };
    setSlots([...slots, newSlot]);
  };

  const handleDeleteSlot = (slotId) => {
    setSlots(slots.filter(slot => slot.id.toString() !== slotId.toString()));
  };

  const handleSlotTypeChange = (slotId, newType, cartId = null) => {
    setSlots(slots.map(slot => {
      if (slot.id.toString() === slotId.toString()) {
        return {
          ...slot,
          slotType: newType,
          cartId: newType === 'cart' ? cartId : null
        };
      }
      return slot;
    }));
  };

  const handleSaveTemplate = async () => {
    setSavingTemplate(true);
    try {
      await axios.put(`http://173.230.134.186:5000/api/clock-templates/${id}`, {
        templateName,
        description,
      });
      alert('Template info updated!');
    } catch (err) {
      console.error('Error updating template:', err);
      setError('Error updating template info.');
    } finally {
      setSavingTemplate(false);
    }
  };

  const handleSaveSlots = async () => {
    setSavingSlots(true);
    try {
      await axios.put(`http://173.230.134.186:5000/api/clock-templates/${id}/slots`, {
        slots: slots.map(s => ({
          id: s.id,
          minuteOffset: s.minuteOffset,
          slotType: s.slotType,
          cartId: s.cartId || null,
        })),
      });
      alert('Slots updated successfully!');
    } catch (err) {
      console.error('Error saving slots:', err);
      setError('Error saving slot updates.');
    } finally {
      setSavingSlots(false);
    }
  };

  if (loading) return <p>Loading clock template...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Edit Clock Template (ID: {id})</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Template Name:</label>
          <input
            type="text"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            style={{ width: '300px', padding: '5px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ width: '300px', height: '100px', padding: '5px' }}
          />
        </div>
        
        <button 
          onClick={handleSaveTemplate}
          disabled={savingTemplate}
          style={{ marginTop: '10px', padding: '5px 10px' }}
        >
          {savingTemplate ? 'Saving...' : 'Update Template Info'}
        </button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={handleAddSlot}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '10px'
          }}
        >
          Add New Slot
        </button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={slots.map(s => s.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div style={{ 
            padding: '20px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            minHeight: '200px'
          }}>
            {slots.map((slot) => (
              <SortableItem
                key={slot.id}
                id={slot.id.toString()}
                slotType={slot.slotType}
                minuteOffset={slot.minuteOffset}
                cartId={slot.cartId}
                onTypeChange={handleSlotTypeChange}
                onDelete={handleDeleteSlot}
                availableCarts={availableCarts}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handleSaveSlots}
          disabled={savingSlots}
          style={{ padding: '5px 10px' }}
        >
          {savingSlots ? 'Saving...' : 'Save Slots'}
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => navigate('/clock-templates')}
          style={{ padding: '5px 10px' }}
        >
          Back to Clock Templates
        </button>
      </div>
    </div>
  );
}

export default EditClockTemplate;
