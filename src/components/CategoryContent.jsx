import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import CategoryNavigation from './CategoryNavigation'; 
import TopNavigation from './TopNavigation';
import '../css/CategoryContent.css';

const CategoryContent = () => {
  const { category } = useParams();
  const [content, setContent] = useState([]);
  const [error, setError] = useState(null); 
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
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

  const handleAnswerClick = (quizId, questionIndex, isCorrect) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${quizId}-${questionIndex}`]: isCorrect
    }));
  };

  return (
    <div className="category-content">
       <TopNavigation /> 
       <CategoryNavigation />
    <h2>{category}</h2>
    {content.map((item, index) => (
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
    </div>
  );
};

export default CategoryContent;