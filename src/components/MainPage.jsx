/*import React from 'react';
import Images from './Images';
import Films from './Films';
import Memes from './Memes';
import Quizzes from './Quizzes';
import CategoryNavigation from './CategoryNavigation';
import TopNavigation from './TopNavigation';
import '../css/MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      <h1>Lolture</h1>
      <h2>Make our culture lol again</h2>
      <TopNavigation />
      <CategoryNavigation />
      <Images />
      <Films />
      <Memes />
      <Quizzes />
    </div>
  );
};

export default MainPage;*/


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
        //setCurrentPage(response.data.totalPages); // Start from the newest page
        if (!pageNumber) {
          setCurrentPage(response.data.totalPages); // Default to the latest page if no pageNumber in URL
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
        //console.log("Content in MainPage:", response.data.content); 

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

  return (
    <div className="main-page">
      <h1>Lolture</h1>
      <h2>Make our culture lol again</h2>
      <TopNavigation />
      <CategoryNavigation />
      {content.map((item) => {
        if (item.questions && item.questions.length > 0) { 
          // quizzes are prioritized if there are questions
          return (
            <div key={item._id} className="quiz-container">
              <Quizzes quizzes={[item]} />
            </div>
          );
        } else if (item.imageUrl) {
          return <Images key={item._id} images={[item]} />;
        } else if (item.videoUrl) {
          return <Films key={item._id} films={[item]} />;
        } else if (item.memeUrl) {
          return <Memes key={item._id} memes={[item]} />;
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