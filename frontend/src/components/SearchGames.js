import React, { useState, useEffect } from 'react';
import { fetchLeagues, searchGames } from '../api/recentGamesApi';
import './SearchGames.css';

const SearchGames = ({ onSearchResults, onReset, onSearch, selectedLeague, onLeagueChange }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [localLeague, setLocalLeague] = useState(selectedLeague || 'all');
    const [leagues, setLeagues] = useState([]);

    useEffect(() => {
        const loadLeagues = async () => {
            try {
                const leaguesData = await fetchLeagues();
                setLeagues(leaguesData);
            } catch (error) {
                console.error('Failed to fetch leagues:', error);
            }
        };
        loadLeagues();
    }, []);

    useEffect(() => {
        setLocalLeague(selectedLeague);
    }, [selectedLeague]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const criteria = {
            start_date: startDate || undefined,
            end_date: endDate || undefined,
            league: localLeague === 'all' ? undefined : localLeague,
        };
        onSearch(criteria);
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setLocalLeague('all');
        onReset();
    };

    return (
        <div className="search-games">
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={e => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={e => setEndDate(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="league">League:</label>
                    <select
                        id="league"
                        value={localLeague}
                        onChange={(e) => {
                            setLocalLeague(e.target.value);
                            if (onLeagueChange) {
                                onLeagueChange(e.target.value);
                            }
                        }}
                    >
                        <option value="all">All Games</option>
                        {leagues.map(league => (
                            <option key={league.league_id} value={league.league_id}>
                                {league.leaguename}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Search</button>
                <button type="button" onClick={handleReset}>Clear</button>
            </form>
        </div>
    );
};

export default SearchGames;