import React from 'react';
import './StartPage.css';
import { useNavigate } from 'react-router-dom';

function StartPage() {
  const navigate = useNavigate();  // ページ遷移に使用
  const handleStart = () => {
    // 「Start」ボタンがクリックされたときに /home へ遷移
    navigate('/home');
  };

  return (
    <div className="start-container">
      <h1>Welcome to the Learning App</h1>
      <button className="start-button" onClick={handleStart}>
        Start
      </button>
    </div>
  );
}

export default StartPage;
