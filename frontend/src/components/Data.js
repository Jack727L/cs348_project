import React, { useState, useEffect } from 'react';
import { getLeagueStandings, fetchLeagues } from '../api/dataApi';
import './Data.css';

const LeagueStandings = () => {
  const [leagues, setLeagues] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState('');
  const [standings, setStandings] = useState([]);
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [loadingStandings, setLoadingStandings] = useState(false);
  const [error, setError] = useState('');

  // Dynamically fetch available leagues and select the first one by default.
  useEffect(() => {
    const loadLeagues = async () => {
      try {
        const leaguesData = await fetchLeagues();
        setLeagues(leaguesData);
        if (leaguesData && leaguesData.length > 0) {
          setSelectedLeague(leaguesData[0].league_id || leaguesData[0].id);
        }
      } catch (err) {
        setError('Failed to fetch leagues.');
      } finally {
        setLoadingLeagues(false);
      }
    };
    loadLeagues();
  }, []);

  // Fetch standings when the selected league changes.
  useEffect(() => {
    const loadStandings = async () => {
      if (!selectedLeague) return;
      setLoadingStandings(true);
      try {
        const data = await getLeagueStandings(selectedLeague);
        setStandings(data);
      } catch (err) {
        setError('Failed to fetch league standings.');
      } finally {
        setLoadingStandings(false);
      }
    };
    loadStandings();
  }, [selectedLeague]);

  // Handle sidebar item click.
  const handleSidebarItemClick = (leagueId) => {
    setSelectedLeague(leagueId);
  };

  if (loadingLeagues) {
    return <div className="data-section">Loading leagues...</div>;
  }

  if (error) {
    return <div className="data-section">{error}</div>;
  }

  return (
    <div className="data">
      <div className="sidebar">
        {leagues.map((league) => (
          <div 
            key={league.league_id || league.id}
            className={`sidebar-item ${selectedLeague === (league.league_id || league.id) ? 'active' : ''}`}
            onClick={() => handleSidebarItemClick(league.league_id || league.id)}
          >
            {selectedLeague === (league.league_id || league.id) && <div className="indicator"></div>}
            <span>{league.leaguename || league.name}</span>
          </div>
        ))}
      </div>
      <div className="data-section">
        <h2>League Standings</h2>
        {loadingStandings ? (
          <div>Loading standings...</div>
        ) : (
          <div className="data-table">
            <div className="data-header">
              <span className="team-ranking">Rank</span>
              <span className="team-name">Team</span>
              <span className="team-games">Games</span>
              <span className="team-wins">Wins</span>
              <span className="team-losses">Losses</span>
              <span className="team-points">Points</span>
            </div>
            {standings.map((team) => {
              const totalGames = (team.win || 0) + (team.lose || 0) + (team.draw || 0);
              return (
                <div key={team.team_id} className="team-row">
                  <span className="team-ranking">{team.ranking}</span>
                  <span className="team-name">{team.teamname}</span>
                  <span className="team-games">{totalGames}</span>
                  <span className="team-wins">{team.win}</span>
                  <span className="team-losses">{team.lose}</span>
                  <span className="team-points">{team.points}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueStandings;