import React, { useState } from 'react';
import RecentGames from './RecentGames';
import Data from './Data';
import SignIn from './SignIn';
import './Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('recentGames');

  return (
    <div className="dashboard">
      {}
      <div className="header">
        <div className="logo">
          {}
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
              className={`top-tab ${activeTab === 'data' ? 'active' : ''}`}
              onClick={() => setActiveTab('data')}
            >
              Data
            </button>
          </div>
          <SignIn />
        </div>
      </div>

      {}
      <div className="content-area">
        {activeTab === 'recentGames' && <RecentGames />}
        {activeTab === 'data' && <Data />}
      </div>
    </div>
  );
};

export default Dashboard;
