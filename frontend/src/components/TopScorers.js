import React, { useState, useEffect } from 'react';
import { fetchTopScorers } from '../api/leaderboardApi';
import { fetchLeagues } from '../api/recentGamesApi';
import { getNationalities } from '../api/nationalityDropDownApi';
import './TopScorers.css';

const TopScorers = () => {
  const [topScorers, setTopScorers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leagues, setLeagues] = useState([]);
  const [filters, setFilters] = useState({
    league: '',
    team: '',
    nationality: '',
    limit: 10
  });
  const [countries, setCountries] = useState([]);

  // Fetch available leagues and nationalities for filter dropdowns
  useEffect(() => {
    const loadData = async () => {
      try {
        // Use imported functions instead of direct API calls
        const leaguesData = await fetchLeagues();
        setLeagues(leaguesData);
        
        const countriesData = await getNationalities();
        setCountries(countriesData);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    loadData();
  }, []);

  // Load top scorers when component mounts
  useEffect(() => {
    loadTopScorers();
  }, []);

  const loadTopScorers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTopScorers(filters);
      setTopScorers(data);
    } catch (err) {
      setError('Failed to load top scorers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // If changing a main filter (not limit)
    if (name !== 'limit') {
      if (value) {
        // Reset other main filters but keep limit
        const resetFilters = {
          league: '',
          team: '',
          nationality: '',
          limit: filters.limit
        };
        resetFilters[name] = value;
        setFilters(resetFilters);
      } else {
        setFilters(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFilters(prev => ({ ...prev, limit: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loadTopScorers();
  };

  // Check if any main filter is active
  const hasActiveFilter = () => {
    return !!filters.league || !!filters.team || !!filters.nationality;
  };

  return (
    <div className="top-scorers-container">
      <h2>Top Scorers Leaderboard</h2>
      
      <form onSubmit={handleSubmit} className="filters-form">
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="league">League:</label>
            <select 
              id="league" 
              name="league" 
              value={filters.league} 
              onChange={handleFilterChange}
              disabled={!!filters.team || !!filters.nationality}
              className={filters.league ? 'active-filter' : ''}
            >
              <option value="">All Leagues</option>
              {leagues.map(league => (
                <option key={league.league_id} value={league.leaguename}>
                  {league.leaguename}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="team">Team:</label>
            <input 
              type="text" 
              id="team" 
              name="team" 
              value={filters.team} 
              onChange={handleFilterChange}
              placeholder="Enter team name"
              disabled={!!filters.league || !!filters.nationality}
              className={filters.team ? 'active-filter' : ''}
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="nationality">Nationality:</label>
            <select 
              id="nationality" 
              name="nationality" 
              value={filters.nationality} 
              onChange={handleFilterChange}
              disabled={!!filters.league || !!filters.team}
              className={filters.nationality ? 'active-filter' : ''}
            >
              <option value="">All Nationalities</option>
              {countries.map(country => (
                <option key={country.country_id} value={country.countryname}>
                  {country.countryname}
                </option>
              ))}
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="limit">Limit:</label>
            <select 
              id="limit" 
              name="limit" 
              value={filters.limit} 
              onChange={handleFilterChange}
              className="limit-select"
            >
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
              <option value="50">Top 50</option>
            </select>
          </div>
          
          <button type="submit" className="view-button">View Leaderboard</button>
        </div>
      </form>

      {loading ? (
        <div className="loading">Loading top scorers...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="scorers-table-container">
          <table className="scorers-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Team</th>
                <th>League</th>
                <th>Nationality</th>
                <th>Goals</th>
              </tr>
            </thead>
            <tbody>
              {topScorers.length > 0 ? (
                topScorers.map((player) => (
                  <tr key={player.player_id}>
                    <td>{player.score_rank}</td>
                    <td>{player.playername}</td>
                    <td>{player.teamname}</td>
                    <td>{player.leaguename}</td>
                    <td>{player.nationality}</td>
                    <td>{player.total_goals}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TopScorers; 