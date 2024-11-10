import React from 'react';
import '../css/Images.css';

const Images = ({images, onVote }) => {
  return (
    <div className="images-container">
      {images.map((image) => (
        <div className="image-item" key={image._id}>
            <p className="image-title">{image.title}</p>
          <img 
            src={`http://localhost:3000${image.imageUrl}`} 
            alt={image.title}
            className="image" 
          />
          <p>Upvotes: {image.upvotes} | Downvotes: {image.downvotes}</p>
          <button onClick={() => onVote(1)}>+</button>
          <button onClick={() => onVote(-1)}>-</button>
        </div>
      ))}
    </div>
  );
};

export default Images;