import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './SignIn.css';

const SignIn = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const sessionUser = Cookies.get('panel_user');
    if (sessionUser) {
      try {
        const userData = JSON.parse(sessionUser);
        setUser(userData);
        setIsSignedIn(true);
      } catch (error) {
        console.error('Error parsing user cookie:', error);
        Cookies.remove('panel_user');
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    // TODO: Validate credentials here
    try {
      // Mock successful authentication
      const userData = {
        username: credentials.username,
        loginTime: new Date().toISOString()
      };
      
      // Save cookie for 7 days
      Cookies.set('panel_user', JSON.stringify(userData), { expires: 7 });
      
      setUser(userData);
      setIsSignedIn(true);
      setShowSignInForm(false);
      setCredentials({ username: '', password: '' });
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const handleSignOut = () => {
    Cookies.remove('panel_user');
    
    setUser(null);
    setIsSignedIn(false);
    setShowDropdown(false);
  };

  return (
    <div className="sign-in-container">
      {!isSignedIn ? (
        <div className="sign-in-wrapper">
          <button 
            className="sign-in-button"
            onClick={() => setShowSignInForm(!showSignInForm)}
          >
            Sign In
          </button>
          {showSignInForm && (
            <div className="sign-in-dropdown">
              <form onSubmit={handleSignIn}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={credentials.username}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={credentials.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button type="submit" className="submit-button">
                  Sign In
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        <div className="user-profile">
          <div 
            className="user-avatar" 
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {user?.username?.[0]?.toUpperCase() || '👤'}
          </div>
          {showDropdown && (
            <div className="dropdown-menu">
              <div className="dropdown-item user-info">
                Signed in as <strong>{user?.username}</strong>
              </div>
              <div 
                className="dropdown-item"
                onClick={handleSignOut}
              >
                Sign Out
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SignIn; 