import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import CategoryNavigation from './CategoryNavigation'; 
import TopNavigation from './TopNavigation';
import Pagination from './Pagination';
import ContentInfo from './ContentInfo';
import '../css/ContentStyles.css';

const CategoryContent = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [error, setError] = useState(null); 
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      setContent([]);
      setError(null);
      
      try {
        const response = await axios.get(`/content?category=${category}`);
        //console.log('Fetched data:', response.data); 
        //setContent(response.data);
        //setContent(Array.isArray(response.data) ? response.data : []);

      const contentWithTypes = response.data.map((item) => {
        let type;
    
        if (item.questions && item.questions.length > 0) {
            type = 'quiz';
        } else if (item.isUserGenerated || item.hasOwnProperty('templateId') || (item.imageUrl && item.category === 'memes')) {
            type = 'meme';
        } else if (item.imageUrl) {
            type = 'image';
        } else if (item.videoUrl) {
            type = 'film';
        }
    
        console.log(`Item ID: ${item._id}, Detected Type: ${type}`);
        return { ...item, type };
    });

        const sortedContent = contentWithTypes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setContent(sortedContent);

        const totalPages = Math.ceil(contentWithTypes.length / itemsPerPage);
        const queryPage = new URLSearchParams(location.search).get("page");
        setCurrentPage(queryPage ? parseInt(queryPage) : (totalPages > 0 ? totalPages : 1));
      } catch (error) {
        console.error('Error fetching category content:', error);
        setError('Failed to fetch content.');
      }
    };
    fetchContent();
  }, [category, location.search]);

  const totalPages = Math.ceil(content.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/category/${category}?page=${page}`); 
    window.scrollTo(0, 0);
  };

  const handleAnswerClick = (quizId, questionIndex, isCorrect) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${quizId}-${questionIndex}`]: isCorrect
    }));
  };

  const paginatedContent = content.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleVote = async (contentId, vote, type) => {
    try {
      const endpoint = `http://localhost:3000/${
        type === 'quiz' ? 'quizzes' : `${type}s`
      }/${contentId}/vote`;

      console.log("Type:", type, "Endpoint:", endpoint);

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
    <div className="content-container">
    <h2>{category}</h2>
    {paginatedContent.map((item) => (
    <div key={item._id} className={`content-item ${item.questions ? 'quiz-item' : ''}`}>
      <h3 className="content-title">{item.title}</h3>
      <ContentInfo category={item.category} tags={item.tags} />
      {item.imageUrl && (
      <img src={`http://localhost:3000${item.imageUrl}`} alt={item.title} className="content-image"/>
    )}
        {item.videoUrl && (
      <video controls className="content-video">
        <source src={`http://localhost:3000${item.videoUrl}`} type="video/mp4" />
     </video>
        )}
          {item.questions && item.questions.length > 0 && (
            <div className="questions-container">
              {item.questions.map((question, qIndex) => (
                <div className="question-item" key={qIndex}>
                  <p className="question-text">{question.questionText}</p>
                  <ul className="answers-container">
                    {question.answers.map((answer, aIndex) => (
                      <li
                        key={aIndex}
                        onClick={() => handleAnswerClick(item._id, qIndex, answer.isCorrect)}
                        className="answer-button"
                      >
                        {answer.answerText}
                      </li>
                    ))}
                  </ul>
                  {selectedAnswers[`${item._id}-${qIndex}`] !== undefined && (
                    <p className="feedback">
                      {selectedAnswers[`${item._id}-${qIndex}`] ? "Correct!" : "Incorrect, try again!"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
            <div className="voting-container">
              <p>Upvotes: {item.upvotes} | Downvotes: {item.downvotes}</p>
              <button onClick={() => handleVote(item._id, 1, item.type)} className="upvote-button">+</button>
              <button onClick={() => handleVote(item._id, -1, item.type)} className="downvote-button">-</button>
            </div>
        </div>
    ))}
     <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default CategoryContent;