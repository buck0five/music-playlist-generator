// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import StationsList from './pages/StationsList';
import NewStation from './pages/NewStation';
import EditStation from './pages/EditStation';

function App() {
  return (
    <Router>
      <div style={{ margin: '20px' }}>
        <h1>Music Playlist Admin (React 19)</h1>
        <nav>
          <Link to="/">Stations</Link> |{' '}
          <Link to="/stations/new">New Station</Link>
        </nav>
        <hr />

        <Routes>
          <Route path="/" element={<StationsList />} />
          <Route path="/stations/new" element={<NewStation />} />
          <Route path="/stations/:id/edit" element={<EditStation />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
