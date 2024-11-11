import React from 'react';
import '../css/ContentStyles.css'
import '../css/Votings.css';

const Images = ({images, onVote }) => {
  return (
    <div className="content-container">
      {images.map((image) => (
        <div className="content-item" key={image._id}>
            <p className="content-title">{image.title}</p>
          <img 
            src={`http://localhost:3000${image.imageUrl}`} 
            alt={image.title}
            className="content-image" 
          />
          <div className="voting-container">
            <p>Upvotes: {image.upvotes} | Downvotes: {image.downvotes}</p>
            <button className="upvote-button" onClick={() => onVote(1)}>+</button>
            <button className="downvote-button" onClick={() => onVote(-1)}>-</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Images;