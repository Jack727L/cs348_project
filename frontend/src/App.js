// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import GameDetail from './components/GameDetail';
import TeamDetails from './components/TeamDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/team/:teamId" element={<TeamDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
