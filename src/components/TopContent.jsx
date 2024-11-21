import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContentList from './ContentList';

const TopContent = () => {
  const [content, setContent] = useState([]);
  const [timeframe, setTimeframe] = useState('lastWeek'); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopContent = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/top?timeframe=${timeframe}`);
        setContent(response.data);
      } catch (err) {
        console.error('Error fetching top content:', err);
        setError('Failed to fetch top content.');
      }
    };
    fetchTopContent();
  }, [timeframe]);

  return (
    <div className="top-content">
      <h2>Top Content</h2>
      {error && <p>{error}</p>}
      <div className="timeframe-buttons">
        <button onClick={() => setTimeframe('last24h')}>Last 24 Hours</button>
        <button onClick={() => setTimeframe('last48h')}>Last 48 Hours</button>
        <button onClick={() => setTimeframe('lastWeek')}>Last Week</button>
      </div>
      <ContentList content={content} />
    </div>
  );
};

export default TopContent;