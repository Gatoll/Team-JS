// client/src/pages/Start.js

import React from 'react';
import './Start.css';
import { useNavigate } from 'react-router-dom';

function StartPage() {
  const navigate = useNavigate();
  const handleStart = () => {
    navigate('/home');
  };

  return (
    <>
      <div className="start-container">
        <h1>Welcome to the Learning App</h1>
        <button className="start-button" onClick={handleStart}>
          Start
        </button>
      </div>
      <div className="home-footer">
        <p>&copy; 2024 projectX</p>
      </div>
    </>
  );
}

export default StartPage;
