import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import './TeamDetails.css';
import { getTeamDetails } from '../api/teamStatsApi'; // Assuming you have an API utility

const TeamDetails = ({ onBack }) => {
  const { teamId } = useParams(); // Retrieve teamId from URL
  const navigate = useNavigate(); // Initialize navigate
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const data = await getTeamDetails(teamId);
        setTeam(data);
      } catch (err) {
        setError('Failed to fetch team details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [teamId]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate('/'); // Navigate back to dashboard
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

  return (
    <div className="team-details">
      <button className="back-button" onClick={handleBack}>← Back to Games</button>
      
      <div className="team-header-container">
        <div className="team-header">
          {/* Team Logo */}
          <div className="team-logo">
          </div>
          <div className="team-info">
            <h2 className="team-name">{team.teamname}</h2>
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
              <div className="player-number">#{player.player_id}</div>
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