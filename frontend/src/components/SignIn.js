import React, { useState, useEffect, useRef } from 'react';
import Cookies from 'js-cookie';
import { signIn, signUp, signOut } from '../api/authApi';
import './SignIn.css';

const SignIn = ({ setActiveTab }) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const formRef = useRef(null);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [signUpData, setSignUpData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

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

  const clearForms = () => {
    setCredentials({
      username: '',
      password: ''
    });
    setSignUpData({
      username: '',
      password: '',
      confirmPassword: '',
      email: ''
    });
    setMessage({ type: '', text: '' });
  };

  useEffect(() => {
    // Add click event listener to handle clicks outside the form
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowSignInForm(false);
        setShowSignUpForm(false);
        clearForms(); // Clear forms when clicking outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e, isSignUp = false) => {
    const { name, value } = e.target;
    if (isSignUp) {
      setSignUpData(prev => ({
        ...prev,
        [name]: value
      }));
      // Clear password match error when user types
      if (name === 'confirmPassword' || name === 'password') {
        if (name === 'confirmPassword' && value !== signUpData.password) {
          setMessage({ type: 'error', text: "Passwords don't match" });
        } else if (name === 'password' && value !== signUpData.confirmPassword && signUpData.confirmPassword) {
          setMessage({ type: 'error', text: "Passwords don't match" });
        } else {
          setMessage({ type: '', text: '' });
        }
      }
    } else {
      setCredentials(prev => ({
        ...prev,
        [name]: value
      }));
      setMessage({ type: '', text: '' }); // Clear message when user types
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await signIn(credentials);
      const userData = {
        username: credentials.username,
        id: response.id,
        loginTime: new Date().toISOString()
      };
      
      Cookies.set('panel_user', JSON.stringify(userData), { expires: 7 });
      
      setUser(userData);
      setIsSignedIn(true);
      setShowSignInForm(false);
      clearForms();
      setActiveTab('recentGames');
      window.location.reload();
    } catch (error) {
      console.error('Sign in error:', error);
      setMessage({ 
        type: 'error', 
        text: error.error || 'Failed to sign in. Please try again.' 
      });
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      setMessage({ type: 'error', text: "Passwords don't match" });
      return;
    }
    try {
      await signUp(signUpData);
      clearForms();
      setShowSignUpForm(false);
      setShowSignInForm(true);
      setMessage({ 
        type: 'success', 
        text: 'Successfully signed up! Please sign in with your credentials.' 
      });
    } catch (error) {
      console.error('Sign up error:', error);
      setMessage({ 
        type: 'error', 
        text: error.error || 'Failed to sign up. Please try again.' 
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Cookies.remove('panel_user');
      setUser(null);
      setIsSignedIn(false);
      setShowDropdown(false);
      setActiveTab('recentGames');
      window.location.reload();
    } catch (error) {
      console.error('Sign out error:', error);
      alert(error.error || 'Failed to sign out. Please try again.');
    }
  };

  const toggleForm = (formType) => {
    if (formType === 'signin') {
      setShowSignInForm(!showSignInForm);
      setShowSignUpForm(false);
    } else {
      setShowSignUpForm(!showSignUpForm);
      setShowSignInForm(false);
    }
    clearForms(); // Clear forms when switching between them
  };

  return (
    <div className="sign-in-container" ref={formRef}>
      {!isSignedIn ? (
        <div className="sign-in-wrapper">
          <button 
            className="sign-in-button"
            onClick={() => toggleForm('signin')}
          >
            Sign In
          </button>
          
          {showSignInForm && (
            <div className="sign-in-dropdown">
              <form onSubmit={handleSignIn}>
                {message.text && (
                  <div className={`message ${message.type}`}>
                    {message.text}
                  </div>
                )}
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
                <div className="form-footer">
                  Don't have an account? 
                  <button 
                    type="button" 
                    className="link-button"
                    onClick={() => toggleForm('signup')}
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          )}

          {showSignUpForm && (
            <div className="sign-in-dropdown">
              <form onSubmit={handleSignUp}>
                {message.text && (
                  <div className={`message ${message.type}`}>
                    {message.text}
                  </div>
                )}
                <div className="form-group">
                  <label htmlFor="signup-username">Username</label>
                  <input
                    type="text"
                    id="signup-username"
                    name="username"
                    value={signUpData.username}
                    onChange={(e) => handleInputChange(e, true)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-email">Email</label>
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    value={signUpData.email}
                    onChange={(e) => handleInputChange(e, true)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-password">Password</label>
                  <input
                    type="password"
                    id="signup-password"
                    name="password"
                    value={signUpData.password}
                    onChange={(e) => handleInputChange(e, true)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-confirm-password">Confirm Password</label>
                  <div className="input-with-error">
                    <input
                      type="password"
                      id="signup-confirm-password"
                      name="confirmPassword"
                      value={signUpData.confirmPassword}
                      onChange={(e) => handleInputChange(e, true)}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="submit-button">
                  Sign Up
                </button>
                <div className="form-footer">
                  Already have an account? 
                  <button 
                    type="button" 
                    className="link-button"
                    onClick={() => toggleForm('signin')}
                  >
                    Sign In
                  </button>
                </div>
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