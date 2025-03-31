import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPlayerFormTracker } from '../api/playersApi';
import './PlayerFormTracker.css';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PlayerFormTracker = () => {
  const { playerId } = useParams();
  const [dataObj, setDataObj] = useState({ form_tracker: [], games: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const playerName =
    dataObj.form_tracker.length > 0 && dataObj.form_tracker[0].playername
      ? dataObj.form_tracker[0].playername
      : '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPlayerFormTracker(playerId);
        setDataObj(data);
      } catch (err) {
        // If the API returns a 404, show a friendly message instead of an error
        if (err?.response?.status === 404) {
          setError('No performance data available for this player.');
        } else {
          setError('Error loading performance data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playerId]);

  if (loading)
    return (
      <div className="player-form-tracker">
        <p>Loading performance data...</p>
      </div>
    );
  if (error)
    return (
      <div className="player-form-tracker">
        <p className="error">{error}</p>
      </div>
    );

  if (dataObj.form_tracker.length === 0 && dataObj.games.length === 0) {
    return (
      <div className="player-form-tracker">
        <p>No performance data available for this player.</p>
      </div>
    );
  }

  const sortedGames = [...dataObj.games].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const labels = sortedGames.map((game) => game.date);
  const goalsData = sortedGames.map((game) => game.goal);
  const assistsData = sortedGames.map((game) => game.assist);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Goals per Game',
        data: goalsData,
        fill: false,
        borderColor: 'blue',
        backgroundColor: 'blue',
        tension: 0.2,
      },
      {
        label: 'Assists per Game',
        data: assistsData,
        fill: false,
        borderColor: 'green',
        backgroundColor: 'green',
        tension: 0.2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    },
    plugins: {
      title: {
        display: true,
        text: 'Goals and Assists Trend Over Games',
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <div className="player-form-tracker">
      <div className="header">
        <Link to="/" state={{ activeTab: 'players' }} className="back-arrow">
          &#8592;
        </Link>
        <h2>
          Performance Details for{' '}
          {playerName ? playerName : `Player ${playerId}`}
        </h2>
      </div>

      <h3>Rolling Performance</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Goals</th>
            <th>Pass Accuracy</th>
            <th>Assists</th>
            <th>Playtime</th>
            <th>Rolling Goal Average</th>
          </tr>
        </thead>
        <tbody>
          {dataObj.form_tracker.map((record) => (
            <tr key={record.date}>
              <td>{record.date}</td>
              <td>{record.goal}</td>
              <td>{record.pass_acc}</td>
              <td>{record.assist}</td>
              <td>{record.playtime}</td>
              <td>{record.rolling_goal_avg}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Graph rendering */}
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>

      <h3>All Games</h3>
      <table>
        <thead>
          <tr>
            {/* <th>Match ID</th> */}
            <th>Date</th>
            {/* <th>Location</th> */}
            <th>League ID</th>
            <th>Home Team</th>
            <th>Away Team</th>
            <th>Score</th>
            <th>Goals</th>
            {/* <th>Pass Accuracy</th> */}
            <th>Assists</th>
            <th>Playtime</th>
          </tr>
        </thead>
        <tbody>
          {dataObj.games.map((game) => (
            <tr key={game.match_id}>
              {/* <td>{game.match_id}</td> */}
              <td>{game.date}</td>
              {/* <td>{game.match_location}</td> */}
              <td>{game.league_id}</td>
              <td>{game.home_team}</td>
              <td>{game.away_team}</td>
              <td>
                {game.hometeam_score} - {game.awayteam_score}
              </td>
              <td>{game.goal}</td>
              {/* <td>{game.pass_acc}</td> */}
              <td>{game.assist}</td>
              <td>{game.playtime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayerFormTracker; 