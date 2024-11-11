import React from 'react';
import '../css/ContentStyles.css';
import '../css/Votings.css';

const Films = ({films, onVote}) => {
  return (
    <div className="content-container">
        {films.map((film) => (
          <div className="content-item" key={film._id}>
            <h2 className="content-title">{film.title}</h2>
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



