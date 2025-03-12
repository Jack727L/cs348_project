import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamDetails from './TeamDetails';
import { fetchRecentGames, fetchLeagues } from '../api/recentGamesApi';
import SearchGames from './SearchGames';
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

  // New state for search parameters
  const [searchParameters, setSearchParameters] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const getLeagues = async () => {
      setLoadingLeagues(true);
      setErrorLeagues(null);
      try {
        const leagues = await fetchLeagues();
        const leagueCategories = leagues.map(league => ({
          id: league.league_id,
          label: league.leaguename,
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
        // Create fetch parameters to pass to the API.
        // Assuming fetchRecentGames can handle an object with filtering parameters.
        const fetchParams = {
          category: activeCategory,
          ...searchParameters,
        };
        const matches = await fetchRecentGames(fetchParams);
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
  }, [activeCategory, searchParameters]);

  const handleTeamClick = (teamId, event) => {
    event.stopPropagation();
    if (teamId) {
      navigate(`/team/${teamId}`);
    } else {
      console.error('Team ID is missing.');
    }
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setSelectedTeam(null); 
  };

  // New handler for search criteria
  const handleSearch = (criteria) => {
    setSearchParameters(criteria);
  };

  const handleSearchResults = (results) => {
    const groups = {};
    results.forEach(match => {
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
  };

  const handleResetSearch = async () => {
    setLoadingGames(true);
    setErrorGames(null);
    try {
      const matches = await fetchRecentGames({ category: 'all' });
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
          <>
            <SearchGames 
              onSearchResults={handleSearchResults} 
              onReset={handleResetSearch}
              onSearch={handleSearch}
            />
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
                        key={match.match_id}
                        className="match-card"
                      >
                        <div className="match-info">
                          <span className="match-time">
                            {new Date(match.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="match-cup">{match.leaguename}</span>
                          <span 
                            className="match-team1 clickable"
                            onClick={(e) => handleTeamClick(match.hometeam_id, e)}
                          >
                            {match.home_team}
                          </span>
                          <span className="match-score">
                            {match.hometeam_score} - {match.awayteam_score}
                          </span>
                          <span 
                            className="match-team2 clickable"
                            onClick={(e) => handleTeamClick(match.awayteam_id, e)}
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
          </>
        )}
      </div>
    </div>
  );
};

export default RecentGames;
