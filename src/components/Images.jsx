import React from 'react';
import '../css/ContentStyles.css'
import '../css/Votings.css';
import ContentInfo from './ContentInfo';

const Images = ({images, onVote, hasVoted }) => {
  return (
    <div className="content-container">
      {images.map((image) => (
        <div className="content-item" key={image._id}>
            <p className="content-title">{image.title}</p>
            <ContentInfo category={image.category} tags={image.tags} />
          <img 
            src={`http://localhost:3000${image.imageUrl}`} 
            alt={image.title}
            className="content-image" 
          />
          <div className="voting-container">
            <p>Upvotes: {image.upvotes} | Downvotes: {image.downvotes}</p>
            <button className="upvote-button" onClick={(e) => onVote(1, e)} disabled={hasVoted}>+</button>
            <button className="downvote-button" onClick={(e) => onVote(-1, e)} disabled={hasVoted}>-</button>
            {hasVoted && <p className="voted-text">You have voted on this content.</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Images;