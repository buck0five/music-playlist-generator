import React, { useState, useEffect } from 'react';
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
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// Sortable slot item component
const SortableSlot = ({ id, content, type }) => {
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
    padding: '10px',
    margin: '5px 0',
    backgroundColor: 'white',
    borderRadius: '4px',
    cursor: 'grab'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {content} - {type}
    </div>
  );
};

const ClockTemplateEditorDnd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [slots, setSlots] = useState([
    { id: '1', content: 'Slot 1', type: 'song', minuteOffset: 0 },
    { id: '2', content: 'Slot 2', type: 'song', minuteOffset: 5 },
    { id: '3', content: 'Slot 3', type: 'song', minuteOffset: 10 }
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchTemplate();
  }, [id]);

  const fetchTemplate = async () => {
    try {
      const response = await axios.get(`http://173.230.134.186:5000/api/clock-templates/${id}`);
      setTemplate(response.data);
      if (response.data.slots) {
        const sortedSlots = [...response.data.slots].sort((a, b) => a.minuteOffset - b.minuteOffset);
        setSlots(sortedSlots);
      }
    } catch (error) {
      console.error('Error fetching template:', error);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSlots((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          minuteOffset: index * 5  // Update minuteOffset based on new position
        }));
      });
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://173.230.134.186:5000/api/clock-templates/${id}/slots`, {
        slots: slots.map(slot => ({
          id: slot.id,
          minuteOffset: slot.minuteOffset,
          slotType: slot.type,
          clockTemplateId: id
        }))
      });
      navigate('/clock-templates');
    } catch (error) {
      console.error('Error saving slots:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Clock Template Editor</h2>
      {template && (
        <div style={{ marginBottom: '20px' }}>
          <h3>{template.templateName}</h3>
          <p>{template.description}</p>
        </div>
      )}
      
      <div 
        style={{
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          minHeight: '400px'
        }}
      >
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={slots.map(s => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {slots.map((slot) => (
              <SortableSlot 
                key={slot.id} 
                id={slot.id}
                content={`Slot at ${slot.minuteOffset} minutes`}
                type={slot.type}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <button 
        onClick={handleSave}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Save Changes
      </button>
    </div>
  );
};

export default ClockTemplateEditorDnd;
