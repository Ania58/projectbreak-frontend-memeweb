import React from 'react';
import '../css/ContentStyles.css';
import '../css/Votings.css';
import ContentInfo from './ContentInfo';

const Films = ({films, onVote, hasVoted}) => {
  const baseUrl = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '');
  return (
    <div className="content-container">
        {films.map((film) => (
          <div className="content-item" key={film._id}>
            <h2 className="content-title">{film.title}</h2>
            <ContentInfo category={film.category} tags={film.tags} />
            {film.videoUrl && <video controls src={`${baseUrl}${film.videoUrl}`} alt={film.title} className="content-video" />}
            <div className="voting-container">
              <p>Upvotes: {film.upvotes} | Downvotes: {film.downvotes}</p>
              <button className="upvote-button" onClick={(e) => onVote(1, e)} disabled={hasVoted}>+</button>
              <button className="downvote-button" onClick={(e) => onVote(-1, e)} disabled={hasVoted}>-</button>
              {hasVoted && <p className="voted-text">You have voted on this content.</p>}
            </div>
          </div>
        ))}
        
    </div>
  );
};

export default Films;



