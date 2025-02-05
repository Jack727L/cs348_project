import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import TeamDetails from './TeamDetails';
import { dummyTeamsData } from '../data/DummyTeamsData';
import './RecentGames.css';

const matchesData = {
  premierLeague: [
    { id: 1, home: 'Manchester United', away: 'Chelsea', score: '2 - 1', date: '2025-01-20', time: '3:00pm', cup: 'Premier League' },
    { id: 2, home: 'Liverpool', away: 'Arsenal', score: '3 - 2', date: '2025-01-20', time: '4:00pm', cup: 'Premier League' },
    { id: 7, home: 'Leicester City', away: 'Everton', score: '1 - 0', date: '2025-01-21', time: '5:30pm', cup: 'Premier League' }
  ],
  bundesliga: [
    { id: 3, home: 'Bayern Munich', away: 'Borussia Dortmund', score: '1 - 1', date: '2025-01-20', time: '2:30pm', cup: 'Bundesliga' },
    { id: 4, home: 'RB Leipzig', away: 'Schalke 04', score: '2 - 0', date: '2025-01-18', time: '6:00pm', cup: 'Bundesliga' },
  ],
  laLiga: [
    { id: 5, home: 'Real Madrid', away: 'Barcelona', score: '0 - 0', date: '2025-01-20', time: '8:00pm', cup: 'La Liga' },
    { id: 6, home: 'Atletico Madrid', away: 'Sevilla', score: '1 - 0', date: '2025-01-17', time: '3:30pm', cup: 'La Liga' },
  ],
};

const categories = [
  { id: 'all', label: 'All Games' },
  { id: 'premierLeague', label: 'Premier League' },
  { id: 'bundesliga', label: 'Bundesliga' },
  { id: 'laLiga', label: 'La Liga' },
];

const RecentGames = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState(null);
  // const navigate = useNavigate();

  const getAllMatches = () => {
    return Object.values(matchesData).flat();
  };

  const matches =
    activeCategory === 'all'
      ? getAllMatches()
      : matchesData[activeCategory] || [];

  const groupMatchesByDate = (matches) => {
    const groups = {};
    matches.forEach(match => {
      const dateKey = match.date;
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(match);
    });
    return groups;
  };

  const groupedMatches = groupMatchesByDate(matches);

  const handleTeamClick = (teamName, event) => {
    event.stopPropagation();
    const teamData = dummyTeamsData[teamName];
    setSelectedTeam({ name: teamName, data: teamData });
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setSelectedTeam(null); 
  };

  return (
    <div className="recent-games">
      <div className="sidebar">
        {categories.map(category => (
          <div 
            key={category.id} 
            className={`sidebar-item ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => handleCategoryClick(category.id)}
          >
            {activeCategory === category.id && <div className="indicator"></div>}
            <span>{category.label}</span>
          </div>
        ))}
      </div>

      <div className="content-wrapper">
        {selectedTeam ? (
          <TeamDetails 
            team={selectedTeam.data}
            teamName={selectedTeam.name}
            onBack={() => setSelectedTeam(null)}
          />
        ) : (
          <div className="matches-section">
            {Object.keys(groupedMatches).length === 0 ? (
              <p>No matches available.</p>
            ) : (
              Object.keys(groupedMatches).map(date => (
                <div key={date} className="day-group">
                  <h3>{date}</h3>
                  {groupedMatches[date].map(match => (
                    <div
                      key={match.id}
                      className="match-card"
                      // onClick={() => navigate(`/game/${match.id}`)}
                    >
                      <div className="match-info">
                        <span className="match-time">{match.time}</span>
                        <span className="match-cup">{match.cup}</span>
                        <span 
                          className="match-team1 clickable"
                          onClick={(e) => handleTeamClick(match.home, e)}
                        >
                          {match.home}
                        </span>
                        <span className="match-score">{match.score}</span>
                        <span 
                          className="match-team2 clickable"
                          onClick={(e) => handleTeamClick(match.away, e)}
                        >
                          {match.away}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentGames;
