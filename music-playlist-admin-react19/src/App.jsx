// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Existing imports from your repo
import StationsList from './pages/StationsList';
import NewStation from './pages/NewStation';
import EditStation from './pages/EditStation';

import SchedulesList from './pages/SchedulesList';
import NewSchedule from './pages/NewSchedule';
import EditSchedule from './pages/EditSchedule';

import ClockTemplateList from './pages/ClockTemplateList';
import NewClockTemplate from './pages/NewClockTemplate';
import EditClockTemplate from './pages/EditClockTemplate';

// NEW: import the Tag management pages we created
import TagList from './pages/TagList';
import AttachTagToContent from './pages/AttachTagToContent';

function App() {
  return (
    <Router>
      <div style={{ margin: '20px' }}>
        <h1>Music Playlist Admin (React 19)</h1>

        <nav>
          {/* Existing nav links for Stations */}
          <Link to="/">Stations</Link> |{' '}
          <Link to="/stations/new">New Station</Link> |{' '}

          {/* Existing nav links for Schedules */}
          <Link to="/schedules">Schedules</Link> |{' '}
          <Link to="/schedules/new">New Schedule</Link> |{' '}

          {/* Existing nav links for Clock Templates */}
          <Link to="/clock-templates">Clock Templates</Link> |{' '}
          <Link to="/clock-templates/new">New Template</Link> |{' '}

          {/* NEW nav links for Tag management */}
          <Link to="/tags">Tags</Link> |{' '}
          <Link to="/attach-tag">Attach Tag</Link>
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

          {/* NEW: Tag management */}
          <Route path="/tags" element={<TagList />} />
          <Route path="/attach-tag" element={<AttachTagToContent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
