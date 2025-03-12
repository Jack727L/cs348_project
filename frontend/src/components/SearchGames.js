import React, { useState, useEffect } from 'react';
import { fetchLeagues, searchGames } from '../api/recentGamesApi';
import './SearchGames.css';

const SearchGames = ({ onSearchResults, onReset }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedLeague, setSelectedLeague] = useState('all');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const results = await searchGames({
                start_date: startDate || undefined,
                end_date: endDate || undefined,
                league: selectedLeague === 'all' ? undefined : selectedLeague,
            });
            onSearchResults(results || []);
        } catch (error) {
            console.error('Search failed:', error);
            onSearchResults([]);
        }
    };

    const handleReset = () => {
        setStartDate('');
        setEndDate('');
        setSelectedLeague('all');
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
                        value={selectedLeague}
                        onChange={e => setSelectedLeague(e.target.value)}
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
                <button type="button" onClick={handleReset}>Reset</button>
            </form>
        </div>
    );
};

export default SearchGames;