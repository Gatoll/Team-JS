// client/src/pages/HomePage.js

import React from 'react';
import './HomePage.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const handleCreateText = () => {
    navigate('/generate-text');
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to the Learning App</h1>
      </header>
        <section className="text-list">
            <h2>本棚</h2>
            {/* ここに生成された文章のリストを表示 */}
            <ul>
                <li>Sample Text 1</li>
                <li>Sample Text 2</li>
                <li>Sample Text 3</li>
            </ul>
        </section>
      <button className="create-button" onClick={handleCreateText}>
          文章を作る
      </button>

      <footer className="home-footer">
        <p>&copy; 2024 projectX</p>
      </footer>
    </div>
  );
}

export default HomePage;
