import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { modifyFavoriteTeam, modifyFavoritePlayer } from '../api/favoritesApi';
import { getUserId, fetchUserFavorites, requireAuth } from '../utils/authUtils';
import './Favorites.css';
import ConfirmModal from './ConfirmModal';

const Favorites = () => {
    const [favoriteTeams, setFavoriteTeams] = useState([]);
    const [favoritePlayers, setFavoritePlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('teams');
    const [sortBy, setSortBy] = useState('date');
    const navigate = useNavigate();
    const [modalState, setModalState] = useState({
        isOpen: false,
        itemToRemove: null,
        itemName: '',
        isTeam: true
    });

    useEffect(() => {
        const loadFavorites = async () => {
            try {
                requireAuth();
                setLoading(true);
                const { teams, players } = await fetchUserFavorites();
                setFavoriteTeams(teams);
                setFavoritePlayers(players);
                setError(null);
            } catch (err) {
                setError(err.message === 'Authentication required' 
                    ? 'Please sign in to view favorites' 
                    : 'Failed to fetch favorites');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

    const handleTeamClick = (teamId) => {
        navigate(`/team/${teamId}`, { 
            state: { from: 'favorites' } 
        });
    };

    const handleRemoveTeam = async (e, teamId, teamName) => {
        e.stopPropagation();
        setModalState({
            isOpen: true,
            itemToRemove: teamId,
            itemName: teamName,
            isTeam: true
        });
    };

    const handleRemovePlayer = async (e, playerId, playerName) => {
        e.stopPropagation();
        setModalState({
            isOpen: true,
            itemToRemove: playerId,
            itemName: playerName,
            isTeam: false
        });
    };

    const handleConfirmRemove = async () => {
        const userId = getUserId();
        if (!userId) return;

        try {
            if (modalState.isTeam) {
                await modifyFavoriteTeam(userId, modalState.itemToRemove);
                setFavoriteTeams(teams => teams.filter(team => team.team_id !== modalState.itemToRemove));
            } else {
                await modifyFavoritePlayer(userId, modalState.itemToRemove);
                setFavoritePlayers(players => players.filter(player => player.player_id !== modalState.itemToRemove));
            }
        } catch (err) {
            console.error('Failed to remove from favorites:', err);
        }

        setModalState({ isOpen: false, itemToRemove: null, itemName: '', isTeam: true });
    };

    const sortItems = (items, sortType) => {
        return [...items].sort((a, b) => {
            if (sortType === 'name') {
                return a.playername ? 
                    a.playername.localeCompare(b.playername) : 
                    a.teamname.localeCompare(b.teamname);
            } else if (sortType === 'date') {
                return new Date(b.dateAdded) - new Date(a.dateAdded);
            }
            return 0;
        });
    };

    const sortedTeams = sortItems(favoriteTeams, sortBy);
    const sortedPlayers = sortItems(favoritePlayers, sortBy);

    if (loading) return <div className="favorites-loading">Loading favorites...</div>;
    if (error) return <div className="favorites-error">{error}</div>;

    return (
        <div className="favorites-container">
            <div className="favorites-header">
                <div className="favorites-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'teams' ? 'active' : ''}`}
                        onClick={() => setActiveTab('teams')}
                    >
                        Teams
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'players' ? 'active' : ''}`}
                        onClick={() => setActiveTab('players')}
                    >
                        Players
                    </button>
                </div>
                <div className="sort-controls">
                    <label>Sort by: </label>
                    <select 
                        value={sortBy} 
                        onChange={(e) => setSortBy(e.target.value)}
                        className="sort-select"
                    >
                        <option value="date">Date Added</option>
                        <option value="name">Name</option>
                    </select>
                </div>
            </div>

            {activeTab === 'teams' && (
                <div className="favorites-grid" data-tab="teams">
                    {sortedTeams.map(team => (
                        <div 
                            key={team.team_id} 
                            className="favorite-card"
                            onClick={() => handleTeamClick(team.team_id)}
                        >
                            <button 
                                className="remove-button"
                                onClick={(e) => handleRemoveTeam(e, team.team_id, team.teamname)}
                                title="Remove from favorites"
                            >
                                ×
                            </button>
                            <div className="favorite-content">
                                <h3>{team.teamname}</h3>
                                <p>{team.leaguename}</p>
                                <p>{team.countryname}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'players' && (
                <div className="favorites-grid" data-tab="players">
                    {sortedPlayers.map(player => (
                        <div key={player.player_id} className="favorite-card">
                            <button 
                                className="remove-button"
                                onClick={(e) => handleRemovePlayer(e, player.player_id, player.playername)}
                                title="Remove from favorites"
                            >
                                ×
                            </button>
                            <div className="favorite-content">
                                <h3>{player.playername}</h3>
                                <p>{player.teamname}</p>
                                <p>{player.position}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {((activeTab === 'teams' && favoriteTeams.length === 0) || 
                (activeTab === 'players' && favoritePlayers.length === 0)) && (
                <div className="no-favorites">
                No favorite {activeTab} yet
                </div>
            )}

            <ConfirmModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState({ ...modalState, isOpen: false })}
                onConfirm={handleConfirmRemove}
                itemName={modalState.itemName}
            />
        </div>
    );
};

export default Favorites; 