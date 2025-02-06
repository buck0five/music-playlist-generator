import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Example Imports (adjust if you have them)
import StationsList from './pages/StationsList';
import NewStation from './pages/NewStation';
import EditStation from './pages/EditStation';

import SchedulesList from './pages/SchedulesList';
import NewSchedule from './pages/NewSchedule';
import EditSchedule from './pages/EditSchedule';

import ClockTemplateList from './pages/ClockTemplateList';
import NewClockTemplate from './pages/NewClockTemplate';
import EditClockTemplate from './pages/EditClockTemplate';
import ClockTemplateEditorDnd from './pages/ClockTemplateEditorDnd';

import ContentList from './pages/ContentList';
import NewContent from './pages/NewContent';
import EditContent from './pages/EditContent';

import CartList from './pages/CartList';
import NewCart from './pages/NewCart';
import EditCart from './pages/EditCart';

import PlaybackReport from './pages/PlaybackReport';
import OnDemandPlaylist from './pages/OnDemandPlaylist';  // <-- the crucial import

import TagList from './pages/TagList';
import AttachTagToContent from './pages/AttachTagToContent';

function App() {
  return (
    <Router>
      <div style={{ margin: '1rem' }}>
        <h1>Music Playlist Admin</h1>

        <nav style={{ marginBottom: '1rem' }}>
          {/* Example links (adjust if you have them) */}
          <Link to="/">Stations</Link> |{' '}
          <Link to="/stations/new">New Station</Link> |{' '}
          <Link to="/schedules">Schedules</Link> |{' '}
          <Link to="/schedules/new">New Schedule</Link> |{' '}
          <Link to="/clock-templates">Clock Templates</Link> |{' '}
          <Link to="/clock-templates/new">New Template</Link> |{' '}
          <Link to="/content">Content</Link> |{' '}
          <Link to="/content/new">New Content</Link> |{' '}
          <Link to="/carts">Carts</Link> |{' '}
          <Link to="/carts/new">New Cart</Link> |{' '}
          <Link to="/reports/playback">Playback Report</Link> |{' '}
          <Link to="/on-demand">On-Demand Playlist</Link>  {/* <-- Link to /on-demand */}
        </nav>

        <Routes>
          {/* STATIONS */}
          <Route path="/" element={<StationsList />} />
          <Route path="/stations/new" element={<NewStation />} />
          <Route path="/stations/:id/edit" element={<EditStation />} />

          {/* SCHEDULES */}
          <Route path="/schedules" element={<SchedulesList />} />
          <Route path="/schedules/new" element={<NewSchedule />} />
          <Route path="/schedules/:id/edit" element={<EditSchedule />} />

          {/* CLOCK TEMPLATES */}
          <Route path="/clock-templates" element={<ClockTemplateList />} />
          <Route path="/clock-templates/new" element={<NewClockTemplate />} />
          <Route path="/clock-templates/:id/edit" element={<EditClockTemplate />} />
          <Route path="/clock-templates/:id/dnd" element={<ClockTemplateEditorDnd />} />

          {/* CONTENT */}
          <Route path="/content" element={<ContentList />} />
          <Route path="/content/new" element={<NewContent />} />
          <Route path="/content/:id/edit" element={<EditContent />} />

          {/* CART */}
          <Route path="/carts" element={<CartList />} />
          <Route path="/carts/new" element={<NewCart />} />
          <Route path="/carts/:id/edit" element={<EditCart />} />

          {/* REPORTS / ON-DEMAND */}
          <Route path="/reports/playback" element={<PlaybackReport />} />
          <Route path="/on-demand" element={<OnDemandPlaylist />} />

          {/* TAG / ADVANCED */}
          <Route path="/tags" element={<TagList />} />
          <Route path="/attach-tag" element={<AttachTagToContent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
