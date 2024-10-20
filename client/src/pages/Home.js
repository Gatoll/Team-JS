// client/src/pages/Home.js

import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();
    const handleCreateText = () => {
    navigate('/generate');
  };

  return (
    <div className="home-container">
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
    </div>
  );
}

export default HomePage;
