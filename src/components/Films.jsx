import React from 'react';
import '../css/Films.css';
import '../css/Votings.css';

const Films = ({films, onVote}) => {
  return (
    <div className="films-container">
        {films.map((film) => (
          <div className="film-item" key={film._id}>
            <h2 className="film-title">{film.title}</h2>
            {film.videoUrl && <video controls src={`http://localhost:3000${film.videoUrl}`} alt={film.title} className="film" />}
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



