import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Images.css';

const Images = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://localhost:3000/images');
        setImages(response.data);
        //console.log("Fetched images:", response.data);
      } catch (err) {
        console.error("Error fetching images:", err);
        setError(err.message);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="images-container">
      {error && <p>Error fetching images: {error}</p>}
      {images.map((image) => (
        <div className="image-item" key={image._id}>
            <p className="image-title">{image.title}</p>
          <img 
            src={`http://localhost:3000${image.imageUrl}`} 
            alt={image.title}
            className="image" 
          />
        </div>
      ))}
    </div>
  );
};

export default Images;