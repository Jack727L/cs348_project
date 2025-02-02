import React from 'react';
import { useParams } from 'react-router-dom';

const GameDetail = () => {
  const { id } = useParams();

  return (
    <div className="game-detail">
      <h2>Game Detail</h2>
      <p>Displaying details for game with id: {id}</p>
      {}
    </div>
  );
};

export default GameDetail;
