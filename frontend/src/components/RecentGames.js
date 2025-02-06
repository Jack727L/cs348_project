import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import TeamDetails from './TeamDetails';
import { dummyTeamsData } from '../data/DummyTeamsData';
import { fetchRecentGames, fetchLeagues } from '../api/recentGamesApi';
import './RecentGames.css';

const RecentGames = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [groupedMatches, setGroupedMatches] = useState({});
  const [loadingGames, setLoadingGames] = useState(false);
  const [errorGames, setErrorGames] = useState(null);
  
  const [categories, setCategories] = useState([
    { id: 'all', label: 'All Games' },
  ]);
  const [loadingLeagues, setLoadingLeagues] = useState(false);
  const [errorLeagues, setErrorLeagues] = useState(null);

  useEffect(() => {
    const getLeagues = async () => {
      setLoadingLeagues(true);
      setErrorLeagues(null);
      try {
        const leagues = await fetchLeagues();
        const leagueCategories = leagues.map(league => ({
          id: league.name,
          label: league.name,
        }));
        setCategories([{ id: 'all', label: 'All Games' }, ...leagueCategories]);
      } catch (err) {
        setErrorLeagues('Failed to fetch leagues.');
        console.error(err);
      } finally {
        setLoadingLeagues(false);
      }
    };

    getLeagues();
  }, []);

  useEffect(() => {
    const getRecentGames = async () => {
      setLoadingGames(true);
      setErrorGames(null);
      try {
        const matches = await fetchRecentGames(activeCategory);
        const groups = {};
        matches.forEach(match => {
          const date = new Date(match.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });
          if (!groups[date]) {
            groups[date] = [];
          }
          groups[date].push(match);
        });
        setGroupedMatches(groups);
      } catch (err) {
        setErrorGames('Failed to fetch recent games.');
        console.error(err);
      } finally {
        setLoadingGames(false);
      }
    };

    getRecentGames();
  }, [activeCategory]);

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
        {loadingLeagues ? (
          <p>Loading leagues...</p>
        ) : errorLeagues ? (
          <p className="error">{errorLeagues}</p>
        ) : (
          categories.map(category => (
            <div 
              key={category.id} 
              className={`sidebar-item ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {activeCategory === category.id && <div className="indicator"></div>}
              <span>{category.label}</span>
            </div>
          ))
        )}
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
            {loadingGames ? (
              <p>Loading matches...</p>
            ) : errorGames ? (
              <p className="error">{errorGames}</p>
            ) : Object.keys(groupedMatches).length === 0 ? (
              <p>No matches available.</p>
            ) : (
              Object.keys(groupedMatches).map(date => (
                <div key={date} className="day-group">
                  <h3>{date}</h3>
                  {groupedMatches[date].map(match => (
                    <div
                      key={`${match.home_team}-${match.away_team}-${match.date}`}
                      className="match-card"
                      // onClick={() => navigate(`/game/${match.id}`)}
                    >
                      <div className="match-info">
                        <span className="match-time">
                          {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="match-cup">{match.league_name}</span>
                        <span 
                          className="match-team1 clickable"
                          onClick={(e) => handleTeamClick(match.home_team, e)}
                        >
                          {match.home_team}
                        </span>
                        <span className="match-score">
                          {match.home_team_score} - {match.away_team_score}
                        </span>
                        <span 
                          className="match-team2 clickable"
                          onClick={(e) => handleTeamClick(match.away_team, e)}
                        >
                          {match.away_team}
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
