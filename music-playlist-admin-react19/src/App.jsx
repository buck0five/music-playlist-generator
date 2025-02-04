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

// Tag features
import TagList from './pages/TagList';
import AttachTagToContent from './pages/AttachTagToContent';

// Content features
import ContentList from './pages/ContentList';
import NewContent from './pages/NewContent';
import EditContent from './pages/EditContent';

function App() {
  return (
    <Router>
      <div style={{ margin: '20px' }}>
        <h1>Music Playlist Admin (React 19)</h1>
        <nav>
          {/* Stations */}
          <Link to="/">Stations</Link> |{' '}
          <Link to="/stations/new">New Station</Link> |{' '}

          {/* Schedules */}
          <Link to="/schedules">Schedules</Link> |{' '}
          <Link to="/schedules/new">New Schedule</Link> |{' '}

          {/* Clock Templates */}
          <Link to="/clock-templates">Clock Templates</Link> |{' '}
          <Link to="/clock-templates/new">New Template</Link> |{' '}

          {/* Tag mgmt */}
          <Link to="/tags">Tags</Link> |{' '}
          <Link to="/attach-tag">Attach Tag</Link> |{' '}

          {/* Content mgmt */}
          <Link to="/content">Content</Link> |{' '}
          <Link to="/content/new">New Content</Link>
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

          {/* Tag mgmt */}
          <Route path="/tags" element={<TagList />} />
          <Route path="/attach-tag" element={<AttachTagToContent />} />

          {/* Content mgmt */}
          <Route path="/content" element={<ContentList />} />
          <Route path="/content/new" element={<NewContent />} />
          <Route path="/content/:id/edit" element={<EditContent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
