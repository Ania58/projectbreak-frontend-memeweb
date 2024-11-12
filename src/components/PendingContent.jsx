import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CategoryNavigation from './CategoryNavigation'; 
import TopNavigation from './TopNavigation';
import Pagination from './Pagination';
import '../css/ContentStyles.css';

const PendingContent = () => {
  const { pageNumber } = useParams();  
  const navigate = useNavigate();
  const [pendingItems, setPendingItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const itemsPerPage = 8;
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/pending'); 

        const data = response.data;

        const allItems = [
          /*...(data.films || []),
          ...(data.images || []),
          ...(data.memes || []),
          ...(data.quizzes || []),*/

          ...(data.films || []).map(item => ({ ...item, type: 'film' })),
          ...(data.images || []).map(item => ({ ...item, type: 'image' })),
          ...(data.memes || []).map(item => ({ ...item, type: 'meme' })),
          ...(data.quizzes || []).map(item => ({ ...item, type: 'quiz' })),
        ];

        setPendingItems(allItems);
        setCurrentPage(pageNumber ? parseInt(pageNumber) : Math.ceil(allItems.length / itemsPerPage));
      } catch (err) {
        console.error("Error fetching pending items:", err);
        setError("Failed to fetch pending items.");
      }
    };

    fetchPendingItems();
  }, [pageNumber]);

  //console.log("pendingItems:", pendingItems);
  //console.log("Is pendingItems an array?", Array.isArray(pendingItems));

  const totalPages = Math.ceil(pendingItems.length / itemsPerPage);

  const paginatedContent = pendingItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/pending/page/${page}`);
    window.scrollTo(0, 0);
  };

  const handleAnswerClick = (quizId, questionIndex, isCorrect) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${quizId}-${questionIndex}`]: isCorrect
    }));
  };

  const handleVote = async (contentId, vote, type) => {
    try {
      const endpoint = `http://localhost:3000/${
        type === 'quiz' ? 'quizzes' : `${type}s`
      }/${contentId}/vote`;

      const response = await axios.post(endpoint, { vote });
      setPendingItems((prevItems) =>
        prevItems.map((item) =>
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
       <TopNavigation /> 
       <CategoryNavigation /> 
      <h2>Pending Items</h2>
      {error && <p>{error}</p>}
      {paginatedContent.map((item) => (
        <div key={item._id} className={`content-item ${item.questions ? 'quiz-item' : ''}`}>
          <h3 className="content-title">{item.title}</h3>
          {item.imageUrl && <img src={`http://localhost:3000${item.imageUrl}`} alt={item.title}  className="content-image" />}
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

export default PendingContent;