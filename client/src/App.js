import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from './pages/Start';
import HomePage from './pages/Home';
import TextGenerationPage from './pages/Generation';
import SurveyPage from './pages/Survey';
import ThankYouPage from './pages/Thank';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="main-content">
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/generate" element={<TextGenerationPage />} />
            <Route path="/survey" element={<SurveyPage />} />
            <Route path="/thank" element={<ThankYouPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

function Footer() {
  return (
    <footer className="home-footer">
      <p>&copy; 2024 projectX</p>
    </footer>
  );
}

export default App;
