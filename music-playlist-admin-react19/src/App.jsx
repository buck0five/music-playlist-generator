// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StationsList from './pages/StationsList'; // existing
import NewStation from './pages/NewStation';     // existing
import EditStation from './pages/EditStation';   // existing

import SchedulesList from './pages/SchedulesList';   // existing
import NewSchedule from './pages/NewSchedule';       // existing
import EditSchedule from './pages/EditSchedule';     // existing

import ClockTemplateList from './pages/ClockTemplateList'; // new
import NewClockTemplate from './pages/NewClockTemplate';   // new
import EditClockTemplate from './pages/EditClockTemplate'; // new

function App() {
  return (
    <Router>
      <div style={{ margin: '20px' }}>
        <h1>Music Playlist Admin (React 19)</h1>
        <nav>
          <Link to="/">Stations</Link> |{' '}
          <Link to="/stations/new">New Station</Link> |{' '}
          <Link to="/schedules">Schedules</Link> |{' '}
          <Link to="/schedules/new">New Schedule</Link> |{' '}
          <Link to="/clock-templates">Clock Templates</Link> |{' '}
          <Link to="/clock-templates/new">New Template</Link>
        </nav>
        <hr />

        <Routes>
          {/* Existing Stations routes */}
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
