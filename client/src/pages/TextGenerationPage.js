// client/src/pages/TextGenerationPage.js

import React, { useState } from 'react';
import axios from 'axios';
import './TextGenerationPage.css';

function TextGenerationPage() {
  const [character, setCharacter] = useState('');
  const [age, setAge] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [maxTokens, setMaxTokens] = useState(150);
  const [error, setError] = useState('');

  const handleGenerateText = async () => {
    setLoading(true);
    setError('');
    setGeneratedText('');
    try {
      const response = await axios.post('http://localhost:3001/api/generate-text', {
        character,
        age,
        keywords,
      });
    
      setGeneratedText(response.data.generatedText);
    } catch (error) {
      setError('エラーが発生しました: ' + (error.response?.data?.message || error.message));
      console.error('Error generating text:', error);
    }

    setLoading(false);
  };
  return (
    <div className="text-generation-container">
      <h1>Text Generation Page</h1>
      <div className="input-group">
        <label htmlFor="character">名前（なまえ）</label>
        <input
          id="character"
          type="text"
          value={character}
          onChange={(e) => setCharacter(e.target.value)}
          placeholder="Enter character name"
        />
      </div>
      <div className="input-group">
        <label htmlFor="age">年齢（ねんれい）</label>
        <input
          id="age"
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter age"
        />
      </div>
      <div className="input-group">
        <label htmlFor="keywords">キーワード</label>
        <input
          id="keywords"
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Enter keywords"
        />
      </div>
      <div className="input-group">
        <label htmlFor="maxTokens">文章の長さ（ぶんしょうのながさ）</label>
        <select id="maxTokens" value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))}>
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={300}>300</option>
          <option value={500}>500</option>
        </select>
      </div>
      <button onClick={handleGenerateText} disabled={loading}>
        {loading ? '生成中...' : '文章を作る'}
      </button>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {generatedText && (
        <div className="generated-text">
          <p>{generatedText}</p>
        </div>
      )}
    </div>
  );
}

export default TextGenerationPage;