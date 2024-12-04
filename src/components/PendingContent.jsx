import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from './Pagination';
import ContentInfo from './ContentInfo';
import CommentsSection from '../components/comments/CommentsSection'; 
import '../css/ContentStyles.css';

const PendingContent = () => {
  const { pageNumber } = useParams();  
  const navigate = useNavigate();
  const [pendingItems, setPendingItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(parseInt(pageNumber) || 1);
  const itemsPerPage = 8;
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedContent, setSelectedContent] = useState(null); 
  const [votedItems, setVotedItems] = useState(() => {
    const storedVotes = localStorage.getItem('votedItems');
    return storedVotes ? JSON.parse(storedVotes) : [];
  });

  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/pending'); 

        const data = response.data;

        const allItems = [
          ...(data.films || []).map(item => ({ ...item, type: 'film' })), 
          ...(data.images || []).map(item => ({ ...item, type: 'image' })),
          ...(data.memes || []).map(item => ({ ...item, type: 'meme' })),
          ...(data.quizzes || []).map(item => ({ ...item, type: 'quiz' })),
        ];

        const sortedItems = [...allItems].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        setPendingItems(sortedItems);
        const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
        setCurrentPage(pageNumber ? parseInt(pageNumber) : (totalPages > 0 ? totalPages : 1));
        
      } catch (err) {
        console.error("Error fetching pending items:", err);
        setError("Failed to fetch pending items.");
      }
    };

    fetchPendingItems();
  }, [pageNumber]);

  const totalPages = Math.ceil(pendingItems.length / itemsPerPage);
  const paginatedContent = pendingItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ).reverse();

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`/pending/page/${page}`);
    window.scrollTo(0, 0);
  };

  const handleAnswerClick = (quizId, questionIndex, isCorrect, e) => {
    e.stopPropagation(); 
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${quizId}-${questionIndex}`]: isCorrect
    }));
  };

  const handleVote = async (contentId, vote, type, e) => {
    e.stopPropagation(); 

    if (votedItems.includes(contentId)) {
      alert("You have already voted on this content.");
      return;
    }

    try {
      const endpoint = `http://localhost:3000/${
        type === 'quiz' ? 'quizzes' : `${type}s`
      }/${contentId}/vote`;

      const response = await axios.post(endpoint, { vote });
      const { upvotes, downvotes } = response.data;

      setPendingItems((prevItems) =>
        prevItems.map((item) =>
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
      <h2>Pending Items</h2>
      {error && <p>{error}</p>}

     
      {!selectedContent ? (
        <>
          {paginatedContent.map((item) => {
            const hasVoted = votedItems.includes(item._id);

            return (
              <div key={item._id} className={`content-item clickable-item ${item.questions ? 'quiz-item' : ''}`} onClick={() => handleContentClick(item)}>
                <h3 className="content-title">{item.title}</h3>
                <ContentInfo category={item.category} tags={item.tags} />
                {item.imageUrl && <img src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:3000${item.imageUrl}`} alt={item.title} className="content-image" />}
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
                              onClick={(e) => handleAnswerClick(item._id, qIndex, answer.isCorrect, e)} // Passing e to stop propagation
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
          <h2>{selectedContent.title}</h2>
          <ContentInfo category={selectedContent.category} tags={selectedContent.tags} />
          {selectedContent.imageUrl && <img src={selectedContent.imageUrl.startsWith('http') ? selectedContent.imageUrl : `http://localhost:3000${selectedContent.imageUrl}`} alt={selectedContent.title} className="content-image" />}
          {selectedContent.videoUrl && (
            <video controls className="content-video">
              <source src={`http://localhost:3000${selectedContent.videoUrl}`} type="video/mp4" />
            </video>
          )}
          
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

export default PendingContent;