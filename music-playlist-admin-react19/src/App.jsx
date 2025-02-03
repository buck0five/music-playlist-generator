// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StationsList from './pages/StationsList';
import NewStation from './pages/NewStation';
import EditStation from './pages/EditStation';

import SchedulesList from './pages/SchedulesList';
import NewSchedule from './pages/NewSchedule';
import EditSchedule from './pages/EditSchedule';

function App() {
  return (
    <Router>
      <div style={{ margin: '20px' }}>
        <h1>Music Playlist Admin (React 19)</h1>
        <nav>
          <Link to="/">Stations</Link> |{' '}
          <Link to="/stations/new">New Station</Link> |{' '}
          <Link to="/schedules">Schedules</Link> |{' '}
          <Link to="/schedules/new">New Schedule</Link>
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
