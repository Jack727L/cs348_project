// src/components/MainPage.js
import React, { useState } from 'react';
import './MainPage.css';

const matchesData = {
  premierLeague: [
    { id: 1, home: 'Manchester United', away: 'Chelsea', score: '2-1', date: '2025-01-20' },
    { id: 2, home: 'Liverpool', away: 'Arsenal', score: '3-2', date: '2025-01-20' },
    { id: 7, home: 'Leicester City', away: 'Everton', score: '1-0', date: '2025-01-21' }
  ],
  bundesliga: [
    { id: 3, home: 'Bayern Munich', away: 'Borussia Dortmund', score: '1-1', date: '2025-01-20' },
    { id: 4, home: 'RB Leipzig', away: 'Schalke 04', score: '2-0', date: '2025-01-18' },
  ],
  laLiga: [
    { id: 5, home: 'Real Madrid', away: 'Barcelona', score: '0-0', date: '2025-01-20' },
    { id: 6, home: 'Atletico Madrid', away: 'Sevilla', score: '1-0', date: '2025-01-17' },
  ],
};

const categories = [
  { id: 'premierLeague', label: 'Premier League' },
  { id: 'bundesliga', label: 'Bundesliga' },
  { id: 'laLiga', label: 'La Liga' },
];

const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

const MainPage = () => {
  const [activeCategory, setActiveCategory] = useState('premierLeague');
  const groupMatchesByDay = (matches) => {
    const groups = {};
    matches.forEach(match => {
      const matchDate = new Date(match.date);
      const day = dayNames[matchDate.getDay()];
      if (!groups[day]) {
        groups[day] = [];
      }
      groups[day].push(match);
    });
    return groups;
  };

  const matches = matchesData[activeCategory] || [];
  const groupedMatches = groupMatchesByDay(matches);

  return (
    <div className="main-page">
      <h1>Recent Matches</h1>
      <div className="content">
        {}
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

        {}
        <div className="matches-section">
          {Object.keys(groupedMatches).length === 0 ? (
            <p>No matches available.</p>
          ) : (
            Object.keys(groupedMatches).map(day => (
              <div key={day} className="day-group">
                <h3>{day}</h3>
                {groupedMatches[day].map(match => (
                  <div key={match.id} className="match-card">
                    <div className="teams">
                      <span className="team">{match.home}</span>
                      <span className="vs">vs</span>
                      <span className="team">{match.away}</span>
                    </div>
                    <div className="details">
                      <span className="score">Score: {match.score}</span>
                      <span className="date">{match.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
