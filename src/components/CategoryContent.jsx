import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';
import ContentInfo from './ContentInfo';
import CommentsSection from '../components/comments/CommentsSection'; 
import '../css/ContentStyles.css';

const CategoryContent = () => {
  const baseUrl = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '');
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [error, setError] = useState(null); 
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedContent, setSelectedContent] = useState(null); 
  const [votedItems, setVotedItems] = useState(() => {
    const storedVotes = localStorage.getItem('votedItems');
    return storedVotes ? JSON.parse(storedVotes) : [];
  });

  useEffect(() => {
    const fetchContent = async () => {
      setContent([]);
      setError(null);
      
      try {
        const response = await axios.get(`/content?category=${category}`);
        
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

  const handleAnswerClick = (quizId, questionIndex, isCorrect, e) => {
    e.stopPropagation(); 
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${quizId}-${questionIndex}`]: isCorrect
    }));
  };

  const paginatedContent = content.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleVote = async (contentId, vote, type, e) => {
    e.stopPropagation(); 

    if (votedItems.includes(contentId)) {
      alert("You have already voted on this content.");
      return;
    }
    try {
      const endpoint = `${baseUrl}/${type === 'quiz' ? 'quizzes' : `${type}s`}/${contentId}/vote`;

      const response = await axios.post(endpoint, { vote });
      const { upvotes, downvotes } = response.data;
      setContent((prevContent) =>
        prevContent.map((item) =>
          item._id === contentId
            ? { ...item, upvotes: response.data.upvotes, downvotes: response.data.downvotes }
            : item
        )
      );
      const updatedVotedItems = [...votedItems, contentId];
      setVotedItems(updatedVotedItems);
      localStorage.setItem('votedItems', JSON.stringify(updatedVotedItems));
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  const handleContentClick = (content) => {
    setSelectedContent(content);  
  };

  return (
    <div className="content-container">
      <h2>{category}</h2>
      {error && <p>{error}</p>}
  
      {!selectedContent ? (
        <>
          {paginatedContent.map((item) => {
            const hasVoted = votedItems.includes(item._id);

            return (
              <div key={item._id} className={`content-item clickable-item ${item.questions ? 'quiz-item' : ''}`} onClick={() => handleContentClick(item)}>
                <h3 className="content-title">{item.title}</h3>
                <ContentInfo category={item.category} tags={item.tags} />
                {item.imageUrl && (
                  <img src={item.imageUrl.startsWith('http') 
                    ? item.imageUrl 
                    : `${baseUrl}${item.imageUrl}`} 
                    alt={item.title} className="content-image"/>
                )}
                {item.videoUrl && (
                  <video controls className="content-video">
                    <source src={`${baseUrl}${item.videoUrl}`} type="video/mp4" />
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
                              onClick={(e) => handleAnswerClick(item._id, qIndex, answer.isCorrect, e)} 
                              className="answer-button"
                            >
                              {answer.answerText}
                            </li>
                          ))}
                        </ul>
                        {selectedAnswers[`${item._id}-${qIndex}`] !== undefined && (
                          <p className={`feedback ${selectedAnswers[`${item._id}-${qIndex}`] ? "feedback-correct" : "feedback-incorrect"}`}>
                            {selectedAnswers[`${item._id}-${qIndex}`] ? "Correct!" : "Incorrect, try again!"}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="voting-container">
                  <p>Upvotes: {item.upvotes} | Downvotes: {item.downvotes}</p>
                  <button onClick={(e) => handleVote(item._id, 1, item.type, e)} className="upvote-button" disabled={hasVoted}>+</button>
                  <button onClick={(e) => handleVote(item._id, -1, item.type, e)} className="downvote-button" disabled={hasVoted}>-</button>
                  {hasVoted && <p className="voted-text">You have voted on this content.</p>}
                </div>
              </div>
            );
          })}
        </>
      ) : (
          <div className="content-details">
            <button onClick={() => setSelectedContent(null)} className="comment-button">Back to List</button>
            <CommentsSection
              contentType={selectedContent.type}
              contentId={selectedContent._id}
              isAuthenticated={!!localStorage.getItem('authToken')}
            />
          </div>
          )}
          <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
    </div>
  );
};

export default CategoryContent;