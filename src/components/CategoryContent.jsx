import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CategoryNavigation from './CategoryNavigation'; 
import TopNavigation from './TopNavigation';
import Pagination from './Pagination';
import '../css/CategoryContent.css';

const CategoryContent = () => {
  const { category } = useParams();
  const navigate = useNavigate();
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
        setContent(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching category content:', error);
        setError('Failed to fetch content.');
      }
    };
    fetchContent();
  }, [category]);

  const totalPages = Math.ceil(content.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/category/${category}?page=${page}`); 
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

  return (
    <div className="category-content">
       <TopNavigation /> 
       <CategoryNavigation />
    <h2>{category}</h2>
    {paginatedContent.map((item, index) => (
    <div key={index} className={`content-item ${item.questions ? 'quiz-item' : ''}`}>
      <h3>{item.title}</h3>
      {item.imageUrl && (
      <img src={`http://localhost:3000${item.imageUrl}`} alt={item.title} />
    )}
        {item.videoUrl && (
      <video controls>
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