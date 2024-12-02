import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../css/CommentsSection.css';

const CommentsSection = ({ contentType, contentId, isAuthenticated }) => {
  const [comments, setComments] = useState([]); 
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [isForbidden, setIsForbidden] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  return (
    <div className="comments-section">
      <h3>Comments</h3>

    
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