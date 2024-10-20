// client/src/pages/Survey.js

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SurveyPage() {
  const [surveyData, setSurveyData] = useState({ rating: '', feedback: '' });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    /* アンケートの結果を送信する処理 */

    navigate('/thank', { state: { print: true } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurveyData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <div className="survey-container">
      <h1>アンケート</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="rating">評価</label>
          <select
            id="rating"
            name="rating"
            value={surveyData.rating}
            onChange={handleChange}
            required
          >
            <option value="">選択してください</option>
            <option value="5">5 - とても良い</option>
            <option value="4">4 - 良い</option>
            <option value="3">3 - 普通</option>
            <option value="2">2 - 悪い</option>
            <option value="1">1 - とても悪い</option>
          </select>
        </div>
        <div className="input-group">
          <label htmlFor="feedback">フィードバック</label>
          <textarea
            id="feedback"
            name="feedback"
            value={surveyData.feedback}
            onChange={handleChange}
            placeholder="フィードバックをお書きください"
            required
          />
        </div>
        <button type="submit">送信する</button>
      </form>
    </div>
  );
}

export default SurveyPage;
