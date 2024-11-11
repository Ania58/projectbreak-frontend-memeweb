import React, { useEffect, useState } from 'react';
import { useNavigate,  useParams } from 'react-router-dom';
import axios from 'axios';
import Images from './Images';
import Films from './Films';
import Memes from './Memes';
import Quizzes from './Quizzes';
import CategoryNavigation from './CategoryNavigation';
import TopNavigation from './TopNavigation';
import Pagination from './Pagination';
import '../css/MainPage.css';
import '../css/ContentStyles.css'

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
          setCurrentPage(response.data.totalPages); // Default to the latest page 
          navigate(`/page/${response.data.totalPages}`); // Navigate to the latest page
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

        setContent(response.data.content);  // Set content as array

      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to fetch content.");
      }
    };

    if (currentPage) fetchContent();
  }, [currentPage]);

  useEffect(() => {
    window.scrollTo(0, 0); // go up when a page changes
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/page/${page}`); // Updates the current page (4,3,2,1)
  };

  const handleVote = async (contentId, vote, type) => {
    try {
      //const endpoint = `http://localhost:3000/${type}s/${contentId}/vote`;
      const endpoint = `http://localhost:3000/${
        type === 'quiz' ? 'quizzes' : `${type}s`
      }/${contentId}/vote`;
      
      const response = await axios.post(endpoint, { vote });
      setContent((prevContent) =>
        prevContent.map((item) =>
          item._id === contentId
            ? { ...item, upvotes: response.data.upvotes, downvotes: response.data.downvotes }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  return (
    <div className="main-page">
      <h1>Lolture</h1>
      <h2>Make our culture lol again</h2>
      <TopNavigation />
      <CategoryNavigation />
      {content.map((item) => {
         const handleItemVote = (vote) => handleVote(item._id, vote, item.type);
        if (item.questions && item.questions.length > 0) { 
          // quizzes are prioritized if there are questions
          return (
            <div key={item._id} className="quiz-container">
              <Quizzes quizzes={[item]} onVote={handleItemVote} />
            </div>
          );
        } else if (item.imageUrl) {
          return <Images key={item._id} images={[item]} onVote={handleItemVote} />;
        } else if (item.videoUrl) {
          return <Films key={item._id} films={[item]} onVote={handleItemVote} />;
        } else if (item.memeUrl) {
          return <Memes key={item._id} memes={[item]} onVote={handleItemVote} />;
        } else {
          return null;
        }
      })}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={handlePageChange} 
      />
    </div>
  );
};

export default MainPage;