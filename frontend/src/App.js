// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TeamDetails from './components/TeamDetails';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/team/:teamId" element={<TeamDetails />} />
    </Routes>
  </Router>
);

export default App;
