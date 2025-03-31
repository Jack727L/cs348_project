import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RecentGames from './RecentGames';
import Data from './Data';
import Players from './Players';
import SignIn from './SignIn';
import Favorites from './Favorites';
import TopScorers from './TopScorers';
import './Dashboard.css';

const Dashboard = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('recentGames');

  // Update active tab based on navigation state
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Clear the state after using it
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className="dashboard">
      <div className="header">
        <div className="logo">
          <span className="logo-text">⚽ FIFA Panel</span>
        </div>
        <div className="header-right">
          <div className="top-tabs">
            <button
              className={`top-tab ${activeTab === 'recentGames' ? 'active' : ''}`}
              onClick={() => setActiveTab('recentGames')}
            >
              Recent Games
            </button>
            <button
              className={`top-tab ${activeTab === 'players' ? 'active' : ''}`}
              onClick={() => setActiveTab('players')}
            >
              Players
            </button>
            <button
              className={`top-tab ${activeTab === 'topScorers' ? 'active' : ''}`}
              onClick={() => setActiveTab('topScorers')}
            >
              Top Scorers
            </button>
            <button
              className={`top-tab ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              Data
            </button>
            <button
              className={`top-tab ${activeTab === 'favorites' ? 'active' : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              My Favorites
            </button>
          </div>
          <SignIn setActiveTab={setActiveTab} />
        </div>
      </div>

      <div className="content-area">
        {activeTab === 'recentGames' && <RecentGames />}
        {activeTab === 'data' && <Data />}
        {activeTab === 'players' && <Players />}
        {activeTab === 'favorites' && <Favorites />}
        {activeTab === 'topScorers' && <TopScorers />}
      </div>
    </div>
  );
};

export default Dashboard;
