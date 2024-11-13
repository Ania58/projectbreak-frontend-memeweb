import React from 'react';
import '../css/ContentStyles.css';
import '../css/Votings.css';

const Films = ({films, onVote}) => {
  return (
    <div className="content-container">
        {films.map((film) => (
          <div className="content-item" key={film._id}>
            <h2 className="content-title">{film.title}</h2>
            <div className="content-info">
            <p className="content-category">Category: {film.category}</p>
            <p className="content-tags">
            Tags: {film.tags?.slice(0, 5).map((tag, i) => ( 
            <span key={i} className="tag-badge">
              #{tag}</span> ))|| 'No tags available'}
            </p>
          </div>
            {film.videoUrl && <video controls src={`http://localhost:3000${film.videoUrl}`} alt={film.title} className="content-film" />}
            <div className="voting-container">
              <p>Upvotes: {film.upvotes} | Downvotes: {film.downvotes}</p>
              <button className="upvote-button" onClick={() => onVote(1)}>+</button>
              <button className="downvote-button" onClick={() => onVote(-1)}>-</button>
            </div>
          </div>
        ))}
        
    </div>
  );
};

export default Films;



