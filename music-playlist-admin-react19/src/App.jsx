// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import StationsList from './pages/StationsList';
import NewStation from './pages/NewStation';
import EditStation from './pages/EditStation';

import SchedulesList from './pages/SchedulesList';
import NewSchedule from './pages/NewSchedule';
import EditSchedule from './pages/EditSchedule';

import ClockTemplateList from './pages/ClockTemplateList';
import NewClockTemplate from './pages/NewClockTemplate';
import EditClockTemplate from './pages/EditClockTemplate';

// NEW: import the Slot pages
import SlotList from './pages/SlotList';
import NewSlot from './pages/NewSlot';
import EditSlot from './pages/EditSlot';

function App() {
  return (
    <Router>
      <div style={{ margin: '20px' }}>
        <h1>Music Playlist Admin (React 19)</h1>
        <nav>
          {/* Existing nav links */}
          <Link to="/">Stations</Link> |{' '}
          <Link to="/stations/new">New Station</Link> |{' '}
          <Link to="/schedules">Schedules</Link> |{' '}
          <Link to="/schedules/new">New Schedule</Link> |{' '}
          <Link to="/clock-templates">Clock Templates</Link> |{' '}
          <Link to="/clock-templates/new">New Template</Link> |{' '}

          {/* NEW: link to the slot list */}
          <Link to="/slots">Slots</Link> |{' '}
          <Link to="/slots/new">New Slot</Link>
        </nav>
        <hr />

        <Routes>
          {/* Stations */}
          <Route path="/" element={<StationsList />} />
          <Route path="/stations/new" element={<NewStation />} />
          <Route path="/stations/:id/edit" element={<EditStation />} />

          {/* Schedules */}
          <Route path="/schedules" element={<SchedulesList />} />
          <Route path="/schedules/new" element={<NewSchedule />} />
          <Route path="/schedules/:id/edit" element={<EditSchedule />} />

          {/* Clock Templates */}
          <Route path="/clock-templates" element={<ClockTemplateList />} />
          <Route path="/clock-templates/new" element={<NewClockTemplate />} />
          <Route path="/clock-templates/:id/edit" element={<EditClockTemplate />} />

          {/* NEW: Clock Template Slots */}
          <Route path="/slots" element={<SlotList />} />
          <Route path="/slots/new" element={<NewSlot />} />
          <Route path="/slots/:id/edit" element={<EditSlot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
