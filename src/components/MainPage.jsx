import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ContentHeader from './ContentHeader';
import ContentList from './ContentList';
import TopNavigation from './TopNavigation';
import CategoryNavigation from './CategoryNavigation';
import Pagination from './Pagination';
import '../css/MainPage.css';
import '../css/ContentStyles.css';

const MainPage = () => {
  const navigate = useNavigate();
  const { pageNumber } = useParams();
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || null);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotalPages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/content/page/1');
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
  }, [pageNumber, navigate]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/content/page/${currentPage}`);
        setContent(response.data.content);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to fetch content.");
      }
    };
    if (currentPage) fetchContent();
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/page/${page}`);
    window.scrollTo(0, 0);
  };

  const handleVote = async (contentId, vote, type) => {
    try {
      const endpoint = `http://localhost:3000/${type === 'quiz' ? 'quizzes' : `${type}s`}/${contentId}/vote`;
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

  return (
    <div className="main-page">
      <ContentHeader />
      <TopNavigation />
      <CategoryNavigation />
      {error && <p>{error}</p>}
      <ContentList content={content} handleVote={handleVote} />
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default MainPage;