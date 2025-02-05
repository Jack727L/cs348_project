import React from 'react';
import './TeamDetails.css';

const TeamDetails = ({ team, teamName, loading, onBack }) => {
  if (!team) {
    return (
      <div className="team-details">
        <button className="back-button" onClick={onBack}>← Back to Games</button>
        <div className="error-message">
          <div>Hang on tight, we are still gathering {teamName}'s data!</div>
        </div>
      </div>
    );
  }

  return (
    <div className="team-details">
      <button className="back-button" onClick={onBack}>← Back to Games</button>
      
      <div className="team-header">
        <div className="team-logo">{team.logo}</div>
        <h2>{team.name}</h2>
        <div className="team-stats">
          <div className="stat">
            <label>League:</label>
            <span>{team.league}</span>
          </div>
          <div className="stat">
            <label>Ranking:</label>
            <span>{team.ranking}</span>
          </div>
          <div className="stats-grid">
            <div className="stat">
              <label>Wins:</label>
              <span>{team.wins}</span>
            </div>
            <div className="stat">
              <label>Draws:</label>
              <span>{team.draws}</span>
            </div>
            <div className="stat">
              <label>Losses:</label>
              <span>{team.losses}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="players-section">
        <h3>Squad</h3>
        <div className="players-grid">
          {team.players.map(player => (
            <div key={player.id} className="player-card">
              <div className="player-number">#{player.number}</div>
              <div className="player-name">{player.name}</div>
              <div className="player-details">
                <span>{player.position}</span>
                <span>{player.age} yrs</span>
                <span>{player.height}cm</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TeamDetails; 