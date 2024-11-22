import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ContentList from './ContentList';
import Pagination from './Pagination';

const TopContent = () => {
  const { page } = useParams(); 
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [timeframe, setTimeframe] = useState('lastWeek'); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopContent = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/top?timeframe=${timeframe}`);
        const sortedContent = response.data.sort((a, b) => b.upvotes - a.upvotes); 
        setContent(sortedContent);

        const totalPages = Math.ceil(sortedContent.length / itemsPerPage);

        if (totalPages > 0) {
          const parsedPage = page ? parseInt(page, 10) : totalPages;
          if (!page || parsedPage > totalPages || parsedPage < 1) {
            navigate(`/top/page/${totalPages}`);
          } else {
            setCurrentPage(parsedPage);
          }
        } else {
          setCurrentPage(1);
          navigate(`/top/page/1`); 
        }
      } catch (err) {
        console.error('Error fetching top content:', err);
        setError('Failed to fetch top content.');
      }
    };
    fetchTopContent();
  }, [timeframe, page, navigate]);

  const totalPages = Math.ceil(content.length / itemsPerPage);
 

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    navigate(`/top/page/${newPage}`); 
    window.scrollTo(0, 0);
  };

  const paginatedContent = content.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="top-content">
      <h2>Top Content</h2>
      {error && <p>{error}</p>}
      <div className="timeframe-buttons">
        <button onClick={() => setTimeframe('last24h')}>Last 24 Hours</button>
        <button onClick={() => setTimeframe('last48h')}>Last 48 Hours</button>
        <button onClick={() => setTimeframe('lastWeek')}>Last Week</button>
      </div>
      <ContentList content={paginatedContent} />
      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default TopContent;