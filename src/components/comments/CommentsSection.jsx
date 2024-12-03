import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/CommentsSection.css';
import ContentInfo from '../ContentInfo';

const CommentsSection = ({ contentType, contentId, isAuthenticated }) => {
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [isForbidden, setIsForbidden] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(null); 
  const [contentError, setContentError] = useState(''); 
  const [contentLoading, setContentLoading] = useState(true); 
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [voted, setVoted] = useState(false);

  const endpoint = `/content/${contentId}`;

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true); 
      try {
        const response = await axios.get(
          `http://localhost:3000/comments/${contentType}/${contentId}`
        );
        const allComments = response.data || [];
        const filteredComments = allComments.filter(
          (comment) => comment.text !== '[Deleted]'
        ); 
        setComments(groupComments(filteredComments));
        setError('');
        setIsForbidden(false);
      } catch (err) {
        console.error('Error fetching comments:', err);
        if (err.response && err.response.status === 403) {
          setIsForbidden(true);
        } else {
          setError('Failed to load comments. Please try again later.');
        }
      } finally {
        setIsLoading(false); 
      }
    };

    fetchComments();
  }, [contentType, contentId]);

  useEffect(() => {
    const fetchContent = async () => {
      setContentLoading(true);
      try {
        console.log(`Fetching content for ${contentType} at endpoint: ${endpoint}`);
        const response = await axios.get(endpoint);
        setContent(response.data);
        setContentError('');
      } catch (err) {
        console.error('Error fetching content:', err);
        if (err.response && err.response.status === 404) {
          setContentError('Content not found.');
        } else {
          setContentError('Failed to load content. Please try again later.');
        }
      } finally {
        setContentLoading(false);
      }
    };

    fetchContent();
  }, [endpoint]);

  const groupComments = (comments) => {
    const commentMap = {};
    comments.forEach((comment) => {
      comment.replies = comment.replies || []; 
      commentMap[comment._id] = comment;
    });

    const rootComments = [];
    comments.forEach((comment) => {
      if (comment.parentCommentId) {
        const parent = commentMap[comment.parentCommentId];
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('You must be logged in to post a comment.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/comments',
        {
          contentType,
          contentId,
          text: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments((prev) => [response.data, ...prev]); 
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to post the comment.');
    }
  };

  const handleAnswerClick = (quizId, questionIndex, answerIndex, isCorrect) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${quizId}-${questionIndex}`]: {
        answerIndex,
        isCorrect,
      },
    }));
  };

  const handleVote = async (vote) => {
    if (voted) {
      alert('You have already voted on this content.');
      return;
    }

    try {
      const endpoint = `http://localhost:3000/${
        contentType === 'quiz' ? 'quizzes' : `${contentType}s`
      }/${contentId}/vote`;

      const response = await axios.post(endpoint, { vote });
      const { upvotes, downvotes } = response.data;
      setContent((prevContent) => ({
        ...prevContent,
        upvotes,
        downvotes,
      }));
      setVoted(true);
    } catch (err) {
      console.error('Error voting on content:', err);
    }
  };

  const renderContent = () => {
    if (contentLoading) return <p>Loading content...</p>;
    if (contentError) return <p className="error">{contentError}</p>;
    if (!content) return <p>No content available.</p>;

    return (
      <div className="content-item">
        <h3 className="content-title">{content.title}</h3>
        <ContentInfo category={content.category} tags={content.tags} />

        {content.imageUrl && (
          <img
            src={
              content.imageUrl.startsWith('http')
                ? content.imageUrl
                : `http://localhost:3000${content.imageUrl}`
            }
            alt={content.title}
            className="content-image"
          />
        )}

        {content.videoUrl && (
          <>
            <video controls className="content-video">
              <source
                src={`http://localhost:3000${content.videoUrl}`}
                type="video/mp4"
              />
            </video>
            <p className='description'>{content.description}</p>
          </>
        )}

          {content.questions && content.type === 'quiz' && (
            <div className="quiz-container">
              {content.questions.map((question, qIndex) => (
                <div key={qIndex} className="quiz-question">
                  <p className="question-text">{question.questionText}</p>
                  <ul className="answers-container">
                    {question.answers.map((answer, aIndex) => (
                      <li
                        key={aIndex}
                        className={`answer-button ${
                          selectedAnswers[`${content._id}-${qIndex}`]?.answerIndex === aIndex
                            ? selectedAnswers[`${content._id}-${qIndex}`].isCorrect
                              ? 'correct'
                              : 'incorrect'
                            : ''
                        }`}
                        onClick={() =>
                          handleAnswerClick(content._id, qIndex, aIndex, answer.isCorrect)
                        }
                        disabled={!!selectedAnswers[`${content._id}-${qIndex}`]}
                      >
                        {answer.answerText}
                      </li>
                    ))}
                  </ul>
                  {selectedAnswers[`${content._id}-${qIndex}`] && (
                    <p
                      className={`feedback ${
                        selectedAnswers[`${content._id}-${qIndex}`].isCorrect
                          ? 'feedback-correct'
                          : 'feedback-incorrect'
                      }`}
                    >
                      {selectedAnswers[`${content._id}-${qIndex}`].isCorrect
                        ? 'Correct!'
                        : 'Incorrect, try again!'}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

         <div className="voting-container">
            <p>Upvotes: {content.upvotes || 0} | Downvotes: {content.downvotes || 0}</p>
            <button onClick={() => handleVote(1)} className="upvote-button" disabled={voted}>
              +
            </button>
            <button onClick={() => handleVote(-1)} className="downvote-button" disabled={voted}>
              -
            </button>
            {voted && <p className="voted-text">You have voted on this content.</p>}
        </div>
      </div>
    );
  };

  return (
    <div className="comments-section">
      <h3>Comments</h3>

      {renderContent()}

      {isLoading && <p>Loading comments...</p>}

      {isForbidden && (
        <div>
          <p>No comments yet. Be the first to comment!</p>
          <p>Please log in to comment.</p>
        </div>
      )}

      {error && !isLoading && !isForbidden && <p className="error">{error}</p>}

      {!isLoading && !error && !isForbidden && (
        <div className="comments-list">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment._id} className="comment">
                <p>{comment.text}</p>
                {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                  <div className="replies">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="reply">
                        <p className="reply-text">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No comments yet. Be the first to comment!</p>
          )}
        </div>
      )}

      {isAuthenticated && !isForbidden ? (
        <div className="add-comment">
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment} className="comment-button">
            Post Comment
          </button>
        </div>
      ) : (
        <p>Please log in to post a comment.</p>
      )}
    </div>
  );
};

export default CommentsSection;

