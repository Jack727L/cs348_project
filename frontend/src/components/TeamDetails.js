import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import FavoriteButton from './FavoriteButton';
import { getTeamDetails } from '../api/teamStatsApi';
import { modifyFavoriteTeam, modifyFavoritePlayer } from '../api/favoritesApi';
import { getUserId, fetchUserFavorites, requireAuth } from '../utils/authUtils';
import './TeamDetails.css';

const TeamDetails = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Add this hook
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [favoriteTeam, setFavoriteTeam] = useState(false);
  const [favoritePlayers, setFavoritePlayers] = useState(new Set());

  const handleFavoriteTeam = async () => {
    try {
      const userId = requireAuth();
      await modifyFavoriteTeam(userId, teamId);
      setFavoriteTeam(!favoriteTeam);
    } catch (error) {
      console.error('Error modifying favorite team:', error);
    }
  };

  const handleFavoritePlayer = async (playerId) => {
    try {
      const userId = requireAuth();
      await modifyFavoritePlayer(userId, playerId);
      setFavoritePlayers(prev => {
        const newSet = new Set(prev);
        if (newSet.has(playerId)) {
          newSet.delete(playerId);
        } else {
          newSet.add(playerId);
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error modifying favorite player:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamData = await getTeamDetails(teamId);
        setTeam(teamData);
        
        // Fetch favorites if user is logged in
        const { teams, players } = await fetchUserFavorites();
        
        // Check if current team is in favorites
        setFavoriteTeam(teams.some(team => team.team_id === parseInt(teamId)));
        
        // Create Set of favorite player IDs
        const favoritePlayerIds = new Set(players.map(player => player.player_id));
        setFavoritePlayers(favoritePlayerIds);
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch team details.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId]);

  const handleBack = () => {
    if (location.state?.from === 'favorites') {
      navigate('/', { state: { activeTab: 'favorites' } });
    } else {
      navigate('/', { state: { activeTab: 'recentGames' } });
    }
  };

  if (loading) {
    return <div className="team-details">Loading team details...</div>;
  }

  if (error) {
    return (
      <div className="team-details">
        <button className="back-button" onClick={handleBack}>← Back to Games</button>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  const isUserLoggedIn = getUserId() !== null;

  return (
    <div className="team-details">
      <button className="back-button" onClick={handleBack}>← Back to Games</button>
      
      <div className="team-header-container">
        <div className="team-header">
          {/* Team Logo */}
          <div className="team-logo">
            {team.logo}
          </div>
          <div className="team-info">
            <div className="team-name-container">
              <h2 className="team-name">{team.teamname}</h2>
              {isUserLoggedIn && (
                <FavoriteButton 
                  isFavorite={favoriteTeam}
                  onClick={handleFavoriteTeam}
                  disabled={false}
                />
              )}
            </div>
            <div className="team-stats">
              <div className="stat">
                <label>League:</label>
                <span>{team.league_name}</span>
              </div>
              <div className="stat">
                <label>Wins:</label>
                <span>{team.statistics.win}</span>
              </div>
              <div className="stat">
                <label>Draws:</label>
                <span>{team.statistics.draw}</span>
              </div>
              <div className="stat">
                <label>Losses:</label>
                <span>{team.statistics.lose}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="players-section">
        <h3>Squad</h3>
        <div className="players-grid">
          {team.players.map(player => (
            <div key={player.player_id} className="player-card">
              <div className="player-header">
                <div className="player-number">#{player.player_id}</div>
                {isUserLoggedIn && (
                  <FavoriteButton 
                    isFavorite={favoritePlayers.has(player.player_id)}
                    onClick={() => handleFavoritePlayer(player.player_id)}
                    disabled={false}
                  />
                )}
              </div>
              <div className="player-name">{player.playername}</div>
              <div className="player-details">
                <span>{player.position}</span>
                <span>{player.age} yrs</span>
                {/* Uncomment if height is available */}
                {/* <span>{player.height}cm</span> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamDetails; 