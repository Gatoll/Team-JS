// client/src/pages/You.js

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Thank.css';

function ThankYouPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000); // 10秒

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="thank-you-container">
      <h1>ありがとうございました！</h1>
      <p>10秒後に最初のページに戻ります</p>
    </div>
  );
}

export default ThankYouPage;
