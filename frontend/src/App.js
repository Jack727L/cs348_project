import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TeamDetails from './components/TeamDetails';
import PlayerFormTracker from './components/PlayerFormTracker';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/team/:teamId" element={<TeamDetails />} />
      <Route path="/player/:playerId/form-tracker" element={<PlayerFormTracker />} />
    </Routes>
  </Router>
);

export default App;