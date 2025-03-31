import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlayers, searchPlayers } from '../api/playersApi';
import { modifyFavoritePlayer } from '../api/favoritesApi';
import ReactCountryFlag from 'react-country-flag';
import nationalityToCode from '../utils/nationalityToCode';
import { getUserId, fetchUserFavorites, requireAuth } from '../utils/authUtils';
import FavoriteButton from './FavoriteButton';
import './Players.css';
import NationalityDropdown from './NationalityDropdown';

const Players = () => {
  const [players, setPlayers] = useState([]);
  const [favoritePlayers, setFavoritePlayers] = useState(new Set());
  // const [favoriteTeams, setFavoriteTeams] = useState(new Set());
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const pageSize = 10;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Search fields states
  const [searchName, setSearchName] = useState('');
  const [searchTeam, setSearchTeam] = useState('');
  const [searchPosition, setSearchPosition] = useState('');
  const [searchNationality, setSearchNationality] = useState(null);

  const [searchQuery, setSearchQuery] = useState({});

  const [searchTrigger, setSearchTrigger] = useState(0);

  const positions = ['GK', 'MID', 'DEF', 'FWD'];

  useEffect(() => {
    setPageInput(page);

    const fetchPlayers = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (Object.keys(searchQuery).length > 0) {
          const queryParams = { ...searchQuery, page, page_size: pageSize };
          console.log('Searching with params:', queryParams);
          data = await searchPlayers(queryParams);
        } else {
          console.log('Fetching players with page:', page);
          data = await getPlayers(page, pageSize);
        }
        console.log('Fetched players:', data);
        setPlayers(data || []);
      } catch (err) {
        setError('Error fetching players.');
        console.error(err);
      }
      setLoading(false);
    };

    fetchPlayers();
  }, [page, searchQuery, searchTrigger, pageSize]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const { players } = await fetchUserFavorites();
        setFavoritePlayers(new Set(players.map(player => player.player_id)));
        // setFavoriteTeams(new Set(teams.map(team => team.team_id)));
      } catch (err) {
        console.error('Error fetching favorites:', err);
      }
    };
    loadFavorites();
  }, []);

  const hasNextPage = players.length === pageSize;

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

  const handleSearch = (e) => {
    e.preventDefault();
    const query = {};
    if (searchName.trim() !== '') query.name = searchName.trim();
    if (searchTeam.trim() !== '') query.team = searchTeam.trim();
    if (searchPosition.trim() !== '') query.position = searchPosition.trim();
    if (searchNationality && searchNationality.country_id) {
      query.nationality = searchNationality.country_id;
    }
    setPage(1);
    setSearchQuery(query);
    setSearchTrigger(prev => prev + 1);
  };

  const handleClearSearch = () => {
    setSearchName('');
    setSearchTeam('');
    setSearchPosition('');
    setSearchNationality(null);
    setSearchQuery({});
    setSearchTrigger(prev => prev + 1);
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

  // const handleFavoriteTeam = async (teamId) => {
  //   try {
  //     const userId = requireAuth();
  //     await modifyFavoriteTeam(userId, teamId);
  //     setFavoriteTeams(prev => {
  //       const newSet = new Set(prev);
  //       if (newSet.has(teamId)) {
  //         newSet.delete(teamId);
  //       } else {
  //         newSet.add(teamId);
  //       }
  //       return newSet;
  //     });
  //   } catch (error) {
  //     console.error('Error modifying favorite team:', error);
  //   }
  // };

  const isUserLoggedIn = getUserId() !== null;

  return (
    <div className="players">
      <h2>Players</h2>
      
      {/* Search Form */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        {/* <input
          type="text"
          placeholder="Team"
          value={searchTeam}
          onChange={(e) => setSearchTeam(e.target.value)}
        /> */}
        <select
          value={searchPosition}
          onChange={(e) => setSearchPosition(e.target.value)}
        >
          <option value="">Select Position</option>
          {positions.map((position) => (
            <option key={position} value={position}>
              {position}
            </option>
          ))}
        </select>
        <NationalityDropdown
          value={searchNationality}
          onChange={(selected) => setSearchNationality(selected)}
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleClearSearch}>Clear</button>
      </form>
      
      {loading && <p>Loading players...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && players.length === 0 && (
        <p>No players found.</p>
      )}
      {!loading && !error && players.length > 0 && (
        <>
          <table className="players-table">
            <thead>
              <tr>
                {/* <th>Player ID</th> */}
                <th>Name</th>
                <th>Team</th>
                <th>Position</th>
                <th>Nationality</th>
                <th>Age</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.player_id}>
                  <td>
                    {player.playername}
                    {isUserLoggedIn && (
                      <FavoriteButton 
                        isFavorite={favoritePlayers.has(player.player_id)}
                        onClick={() => handleFavoritePlayer(player.player_id)}
                        disabled={false}
                      />
                    )}
                  </td>
                  <td>
                    {player.teamname}
                    {/* {isUserLoggedIn && (
                      <FavoriteButton 
                        isFavorite={favoriteTeams.has(player.team_id)}
                        onClick={() => handleFavoriteTeam(player.team_id)}
                        disabled={false}
                      />
                    )} */}
                  </td>
                  <td>{player.position}</td>
                  <td>
                    <ReactCountryFlag 
                      countryCode={nationalityToCode[player.nationality] || ""}
                      svg
                      style={{
                        width: '2em',
                        height: '2em',
                        marginRight: '0.5em'
                      }}
                      title={player.nationality}
                    />
                    {player.nationality}
                  </td>
                  <td>{player.age}</td>
                  <td>
                    <Link to={`/player/${player.player_id}/form-tracker`}>View Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() =>
                setPage((prev) => Math.max(prev - 1, 1))
              }
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
              onClick={() => setPage((prev) => prev + 1)}
              disabled={!hasNextPage}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Players;