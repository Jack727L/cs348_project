import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamDetails from './TeamDetails';
import { fetchRecentGames, fetchLeagues, searchGames } from '../api/recentGamesApi';
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

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const pageSize = 10;
  const [matchesCount, setMatchesCount] = useState(0);

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
        let matches = [];
        if (Object.keys(searchParameters).length > 0) {
          const params = {
            ...searchParameters,
            page,
            page_size: pageSize,
          };
          matches = await searchGames(params);
        } else {
          matches = await fetchRecentGames(activeCategory, page, pageSize);
        }
        setMatchesCount(matches.length);
        const groups = {};
        matches.forEach(match => {
          const date = new Date(match.date + "T00:00:00").toLocaleDateString('en-US', {
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
  }, [activeCategory, searchParameters, page]);

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
    setSearchParameters({});
    setSelectedTeam(null);
    setPage(1);
    setPageInput(1);
  };

  // New handler for search criteria
  const handleSearch = (criteria) => {
    setSearchParameters(criteria);
    setPage(1);
    setPageInput(1);
  };

  const handleSearchResults = (results) => {
    const groups = {};
    results.forEach(match => {
      const date = new Date(match.date + "T00:00:00").toLocaleDateString('en-US', {
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
      const matches = await fetchRecentGames('all', 1, pageSize);
      setPage(1);
      setPageInput(1);
      const groups = {};
      matches.forEach(match => {
        const date = new Date(match.date + "T00:00:00").toLocaleDateString('en-US', {
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
      setSearchParameters({});
    } catch (err) {
      setErrorGames('Failed to fetch recent games.');
      console.error(err);
    } finally {
      setLoadingGames(false);
    }
  };

  const handlePageInputBlur = () => {
    const newPage = Number(pageInput);
    if (newPage > 0 && newPage !== page) {
      setPage(newPage);
    } else {
      setPageInput(page);
    }
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePageInputBlur();
    }
  };

  // New handler for league change from the search form
  const handleLeagueChange = (league) => {
    setActiveCategory(league);
    setPage(1);
    setPageInput(1);
    // Optionally, if you want the search parameters cleared:
    // setSearchParameters({});
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
              selectedLeague={activeCategory}
              onLeagueChange={handleLeagueChange}
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
            <div className="pagination">
              <button 
                onClick={() => {
                  setPage(prev => Math.max(prev - 1, 1));
                  setPageInput(prev => Math.max(prev - 1, 1));
                }}
                disabled={page === 1}
              >
                Previous
              </button>
              <div className="page-input-container">
                <span>Page</span>
                <input
                  type="number"
                  className="page-input"
                  value={pageInput}
                  min="1"
                  onChange={(e) => setPageInput(Number(e.target.value))}
                  onBlur={handlePageInputBlur}
                  onKeyDown={handlePageInputKeyDown}
                />
              </div>
              <button 
                onClick={() => {
                  setPage(prev => prev + 1);
                  setPageInput(page + 1);
                }}
                disabled={matchesCount < pageSize}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecentGames;
