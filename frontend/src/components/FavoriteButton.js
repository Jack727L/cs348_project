import React, { useState } from 'react';
import './FavoriteButton.css';

const FavoriteButton = ({ isFavorite, onClick, disabled }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      onClick();
      setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }, 150);
  };

  return (
    <button 
      className={`favorite-button ${isFavorite ? 'active' : ''} 
                 ${isAnimating ? 'animating' : ''} 
                 ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <i className={`fa-heart ${isFavorite ? 'fas' : 'far'}`}></i>
    </button>
  );
};

export default FavoriteButton; 