import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ContentList from './ContentList';
import Pagination from './Pagination';
import CommentsSection from '../components/comments/CommentsSection';

const TopContent = () => {
  const baseUrl = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '');
  const { page } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(null);
  const itemsPerPage = 8;
  const [timeframe, setTimeframe] = useState('lastWeek');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const fetchTopContent = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/top?timeframe=${timeframe}`
        );
        const fetchedContent = response.data;
        setContent(fetchedContent);

        const totalPages = Math.ceil(fetchedContent.length / itemsPerPage);
        const latestPage = totalPages || 1;
        const validPage = page ? parseInt(page, 10) : latestPage;

        if (validPage > totalPages || validPage < 1) {
          setCurrentPage(latestPage);
          navigate(`/top/page/${latestPage}`);
        } else {
          setCurrentPage(validPage);
        }
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching top content:', err);
        setError('Failed to fetch top content.');
        setIsLoading(false);
      }
    };

    fetchTopContent();
  }, [timeframe, page, navigate, baseUrl]);

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    setContent([]);
    setCurrentPage(null);
    navigate(`/top/page/${Math.ceil(content.length / itemsPerPage) || 1}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    navigate(`/top/page/${newPage}`);
    window.scrollTo(0, 0);
  };

  const handleContentClick = (item) => {
    let type = 'unknown';
    if (item.questions && item.questions.length > 0) {
      type = 'quiz';
    } else if (item.videoUrl) {
      type = 'film';
    } else if (item.imageUrl && item.isUserGenerated) {
      type = 'meme';
    } else if (item.imageUrl) {
      type = 'image';
    }
    setSelectedContent({ ...item, type });
  };

  const paginatedContent = content.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(content.length / itemsPerPage);

  return (
    <div className="top-content">
      <h2>Top Content</h2>
      {error && <p>{error}</p>}
      <div className="timeframe-buttons">
        <button
          onClick={() => handleTimeframeChange('last24h')}
          className={timeframe === 'last24h' ? 'active' : ''}
        >
          Last 24 Hours
        </button>
        <button
          onClick={() => handleTimeframeChange('last48h')}
          className={timeframe === 'last48h' ? 'active' : ''}
        >
          Last 48 Hours
        </button>
        <button
          onClick={() => handleTimeframeChange('lastWeek')}
          className={timeframe === 'lastWeek' ? 'active' : ''}
        >
          Last Week
        </button>
      </div>
      {selectedContent ? (
        <div className="content-details">
          <button
            onClick={() => setSelectedContent(null)}
            className="comment-button"
          >
            Back to List
          </button>
          <CommentsSection
            contentType={selectedContent.type}
            contentId={selectedContent._id}
            isAuthenticated={!!localStorage.getItem('authToken')}
          />
        </div>
      ) : (
        <>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <ContentList
              content={paginatedContent}
              onContentClick={handleContentClick} 
            />
          )}
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage || totalPages}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TopContent;