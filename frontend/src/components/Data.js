// src/components/Data.js
import React, { useState } from 'react';
import './Data.css';

const teamsData = {
  premierLeague: [
    { id: 1, standing: 1, name: 'Manchester United', wins: 25, losses: 5, points: 80 },
    { id: 2, standing: 2, name: 'Liverpool', wins: 23, losses: 7, points: 75 },
    { id: 3, standing: 3, name: 'Chelsea', wins: 20, losses: 10, points: 70 },
  ],
  bundesliga: [
    { id: 4, standing: 1, name: 'Bayern Munich', wins: 28, losses: 2, points: 90 },
    { id: 5, standing: 2, name: 'Borussia Dortmund', wins: 24, losses: 6, points: 80 },
  ],
  laLiga: [
    { id: 6, standing: 1, name: 'Real Madrid', wins: 27, losses: 3, points: 85 },
    { id: 7, standing: 2, name: 'Barcelona', wins: 26, losses: 4, points: 82 },
  ],
};

const categories = [
  { id: 'premierLeague', label: 'Premier League' },
  { id: 'bundesliga', label: 'Bundesliga' },
  { id: 'laLiga', label: 'La Liga' },
];

const Data = () => {
  const [activeCategory, setActiveCategory] = useState('premierLeague');
  const teams = teamsData[activeCategory] || [];
  teams.sort((a, b) => a.standing - b.standing);
  return (
    <div className="data">
      <div className="sidebar">
        {categories.map(category => (
          <div
            key={category.id}
            className={`sidebar-item ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {activeCategory === category.id && <div className="indicator"></div>}
            <span>{category.label}</span>
          </div>
        ))}
      </div>
      <div className="data-section">
        <h2>Data</h2>
        <div className="data-table">
          <div className="data-header">
            <span className="team-standing">#</span>
            <span className="team-name">Team</span>
            <span className="team-wins">Wins</span>
            <span className="team-losses">Losses</span>
            <span className="team-points">Points</span>
          </div>
          {teams.map(team => (
            <div key={team.id} className="team-row">
              <span className="team-standing">{team.standing}</span>
              <span className="team-name">{team.name}</span>
              <span className="team-wins">{team.wins}</span>
              <span className="team-losses">{team.losses}</span>
              <span className="team-points">{team.points}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Data;
