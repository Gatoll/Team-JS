import React, { useState } from 'react';
import axios from 'axios';
import './TextGenerationPage.css';

function TextGenerationPage() {
  const [character, setCharacter] = useState('');
  const [age, setAge] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [loading, setLoading] = useState(false); // ローディングの状態を管理
  const [maxTokens, setMaxTokens] = useState(150);

  const handleGenerateText = async () => {
    setLoading(true);  // ローディング開始
    console.log('API Key:', process.env.REACT_APP_OPENAI_API_KEY);

    try {
      // OpenAI APIにリクエストを送信
      const response = await axios.post(
        'https://api.openai.iniad.org/api/v1',
        {
          model: 'gpt-4o-mini',  // GPTモデルを指定
          prompt: `Generate a story about a character named ${character}, who is ${age} years old, and has the following keywords: ${keywords}.`,
          max_tokens: maxTokens,  // 生成する文章の長さ
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,  // 環境変数からAPIキーを取得
            'Content-Type': 'application/json',
          },
        }
      );
      setGeneratedText(response.data.choices[0].text);  // 生成された文章を保存
    } catch (error) {
        console.error('Error generating text:', error.response ? error.response.data : error.message);
    }

    setLoading(false);  // ローディング終了
  };

  return (
    <div className="text-generation-container">
      <h1>Text Generation Page</h1>
      <div className="input-group">
        <label>名前（なまえ）</label>
        <input
          type="text"
          value={character}
          onChange={(e) => setCharacter(e.target.value)}
          placeholder="Enter character name"
        />
      </div>
      <div className="input-group">
        <label>年齢（ねんれい）</label>
        <input
          type="text"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Enter age"
        />
      </div>
      <div className="input-group">
        <label>キーワード</label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="Enter keywords"
        />
      </div>
      <div className="input-group">
        <label>文章の長さ（ぶんしょうのながさ）</label>
        <select value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))}>
          <option value={100}>100</option>
          <option value={200}>200</option>
          <option value={300}>300</option>
          <option value={500}>500</option>
        </select>
      </div>
      <button onClick={handleGenerateText} disabled={loading}>
        {loading ? '生成中...' : '文章を作る'}
      </button>

      {generatedText && (
        <div className="generated-text">
          <h2>文章</h2>
          <p>{generatedText}</p>
        </div>
      )}
    </div>
  );
}

export default TextGenerationPage;
