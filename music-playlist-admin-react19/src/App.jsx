import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Example imports from your existing code
import StationsList from './pages/StationsList';
import NewStation from './pages/NewStation';
import EditStation from './pages/EditStation';

// If you have schedules
import SchedulesList from './pages/SchedulesList';
import NewSchedule from './pages/NewSchedule';
import EditSchedule from './pages/EditSchedule';

// Clock Templates
import ClockTemplateList from './pages/ClockTemplateList';
import NewClockTemplate from './pages/NewClockTemplate';
import EditClockTemplate from './pages/EditClockTemplate';
import ClockTemplateEditorDnd from './pages/ClockTemplateEditorDnd';

// Content
import ContentList from './pages/ContentList';
import NewContent from './pages/NewContent';
import EditContent from './pages/EditContent';

// Tag / advanced routes if you have them
import TagList from './pages/TagList';
import AttachTagToContent from './pages/AttachTagToContent';

// Example reporting or on-demand
import PlaybackReport from './pages/PlaybackReport';
import OnDemandPlaylist from './pages/OnDemandPlaylist';

// -------- NEW CART EDITOR PAGES -----------
import CartList from './pages/CartList';
import NewCart from './pages/NewCart';
import EditCart from './pages/EditCart';

function App() {
  return (
    <Router>
      <div style={{ margin: '20px' }}>
        <h1>Music Playlist Admin</h1>
        <nav>
          <Link to="/">Stations</Link> |{' '}
          <Link to="/stations/new">New Station</Link> |{' '}

          <Link to="/schedules">Schedules</Link> |{' '}
          <Link to="/schedules/new">New Schedule</Link> |{' '}

          <Link to="/clock-templates">Clock Templates</Link> |{' '}
          <Link to="/clock-templates/new">New Template</Link> |{' '}

          <Link to="/content">Content</Link> |{' '}
          <Link to="/content/new">New Content</Link> |{' '}

          {/* Possibly Tag or OnDemand links if you use them */}

          {/* NEW: Cart mgmt */}
          <Link to="/carts">Carts</Link>
        </nav>
        <hr />

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

          {/* TAG / ADVANCED */}
          <Route path="/tags" element={<TagList />} />
          <Route path="/attach-tag" element={<AttachTagToContent />} />

          {/* REPORTING / ON-DEMAND */}
          <Route path="/reports/playback" element={<PlaybackReport />} />
          <Route path="/on-demand" element={<OnDemandPlaylist />} />

          {/* NEW: CART EDITOR */}
          <Route path="/carts" element={<CartList />} />
          <Route path="/carts/new" element={<NewCart />} />
          <Route path="/carts/:id/edit" element={<EditCart />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
