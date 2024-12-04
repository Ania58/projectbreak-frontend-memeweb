import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ContentList from './ContentList';
import Pagination from './Pagination';
import CommentsSection from '../components/comments/CommentsSection'
import '../css/MainPage.css';
import '../css/ContentStyles.css';

const MainPage = () => {
  const baseUrl = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '');
  const navigate = useNavigate();
  const { pageNumber } = useParams();
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || null);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    const fetchTotalPages = async () => {
      try {
        //const response = await axios.get('http://localhost:3000/content/page/1');
        const response = await axios.get(`${baseUrl}/content/page/1`);
        setTotalPages(response.data.totalPages);
        if (!pageNumber) {
          setCurrentPage(response.data.totalPages);
          navigate(`/page/${response.data.totalPages}`);
        }
      } catch (err) {
        console.error("Error fetching total pages:", err);
      }
    };
    fetchTotalPages();
  }, [pageNumber, navigate, baseUrl]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        //const response = await axios.get(`http://localhost:3000/content/page/${currentPage}`);
        const response = await axios.get(`${baseUrl}/content/page/${currentPage}`);
        setContent(response.data.content);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to fetch content.");
      }
    };
    if (currentPage) fetchContent();
  }, [currentPage, baseUrl]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/page/${page}`);
    window.scrollTo(0, 0);
  };

  const [votedItems, setVotedItems] = useState(() => {
    const storedVotes = localStorage.getItem('votedItems');
    return storedVotes ? JSON.parse(storedVotes) : [];
  });

  const handleVote = async (contentId, vote, type) => {
    try {
      //const endpoint = `http://localhost:3000/${type === 'quiz' ? 'quizzes' : `${type}s`}/${contentId}/vote`;
      const endpoint = `${baseUrl}/${type === 'quiz' ? 'quizzes' : `${type}s`}/${contentId}/vote`;
      const response = await axios.post(endpoint, { vote });
      setContent((prevContent) =>
        prevContent.map((item) =>
          item._id === contentId ? { ...item, upvotes: response.data.upvotes, downvotes: response.data.downvotes } : item
        )
      );
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const handleContentClick = (content) => {
    setSelectedContent(content);
  };

  const handleBackToList = () => {
    setSelectedContent(null);
  };


  return (
    <div className="main-page">
      {error && <p>{error}</p>}
      {selectedContent ? (
        <div className="content-details">
          <button onClick={handleBackToList} className='comment-button'>Back to List</button>
          <h2>{selectedContent.title}</h2>
          <CommentsSection
            contentType={selectedContent.type}
            contentId={selectedContent._id}
            isAuthenticated={!!localStorage.getItem('authToken')} 
          />
        </div>
      ) : (
        <>
          <ContentList
            content={content}
            handleVote={handleVote}
            votedItems={votedItems}
            setVotedItems={setVotedItems}
            onContentClick={handleContentClick}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default MainPage;