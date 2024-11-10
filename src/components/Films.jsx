import React from 'react';

const Films = ({films, onVote}) => {
  return (
    <div>
        {films.map((film) => (
          <div key={film._id}>
            <h2>{film.title}</h2>
            {film.videoUrl && <video controls src={`http://localhost:3000${film.videoUrl}`} alt={film.title} />}
            <p>Upvotes: {film.upvotes} | Downvotes: {film.downvotes}</p>
            <button onClick={() => onVote(1)}>+</button>
            <button onClick={() => onVote(-1)}>-</button>
          </div>
        ))}
        
    </div>
  );
};

export default Films;



