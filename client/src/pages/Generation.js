import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Generation.css';

export default function TextGenerationPage() {
  const [character, setCharacter] = useState('');
  const [age, setAge] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [maxTokens, setMaxTokens] = useState(150);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false); // 折りたたみ状態
  const navigate = useNavigate();

  const handleGenerateText = async () => {
    setLoading(true);
    setError('');
    setGeneratedText('');
    setQuiz(null);
    setAnswers({});
    setResults(null);
    try {
      const response = await axios.post('http://localhost:3001/api/generate', {
        character,
        age,
        keywords,
        maxTokens,
      });

      setGeneratedText(response.data.generatedText);
      setQuiz(response.data.quiz);
      setIsCollapsed(true); // 生成完了時にフォームを折りたたむ
    } catch (error) {
      setError('エラーが発生しました: ' + (error.response?.data?.message || error.message));
      console.error('Error generating text:', error);
    }
    setLoading(false);
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionIndex]: answer
    }));
  };

  const handleCheckAnswers = () => {
    const newResults = {};
    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[index]?.trim().toLowerCase();
      const correctAnswer = question.correct_answer.trim().toLowerCase();

      if (userAnswer === correctAnswer) {
        newResults[index] = '正解です！';
      } else {
        newResults[index] = `不正解です。正解は ${question.correct_answer} です。`;
      }
    });
    setResults(newResults);
  };

  const handleFinish = () => {
    window.print();
    navigate('/survey');
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="text-generation-container">
      <h1>Text Generation Page</h1>

      <button onClick={toggleCollapse} className="toggle-button">
        {isCollapsed ? '▲ フォームを表示' : '▼ フォームを折りたたむ'}
      </button>

      {!isCollapsed && (
        <div className="input-group-container">
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
        </div>
      )}

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      {generatedText && (
        <>
          <div className="generated-container">
            <div className="generated-text">
              <p>{generatedText}</p>
            </div>

            <div className="separator"></div>

            {quiz && (
              <div className="generated-quiz">
                <h3>もんだい：意味（いみ）をこたえてね！</h3>
                {quiz.questions.map((question, index) => (
                  <div key={index} className="quiz-question">
                    <h4>{index + 1}. {question.word}</h4>
                    <ul className="quiz-options" style={{ listStyleType: 'none', paddingLeft: 0 }}>
                      <li>
                        <label>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value="a"
                            onChange={() => handleAnswerSelect(index, question.options.a)}
                          />
                          {question.options.a}
                        </label>
                      </li>
                      <li>
                        <label>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value="b"
                            onChange={() => handleAnswerSelect(index, question.options.b)}
                          />
                          {question.options.b}
                        </label>
                      </li>
                      <li>
                        <label>
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value="c"
                            onChange={() => handleAnswerSelect(index, question.options.c)}
                          />
                          {question.options.c}
                        </label>
                      </li>
                    </ul>
                    {results && results[index] && <p><strong>{results[index]}</strong></p>}
                  </div>
                ))}
                <button onClick={handleCheckAnswers}>結果を確認</button>
              </div>
            )}
          </div>

          <div className="button-container">
            <button onClick={handleFinish} className="finish-button">終わる</button>
          </div>
        </>
      )}

    </div>
  );
}
