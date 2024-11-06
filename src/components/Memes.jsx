import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Memes.css';

const Memes = () => {
  const [memes, setMemes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/memes');
        //console.log("Fetched memes:", response.data);
        setMemes(response.data);
      } catch (err) {
        console.error("Error fetching memes:", err);
        setError(err.message);
      }
    };

    fetchMemes();
  }, []);

  return (
    <div className="memes-container">
      {error && <p>Error fetching memes: {error}</p>}
      {memes.map((meme) => (
        <div className="meme-item" key={meme._id}>
            <p className="meme-title">{meme.title}</p>
          <img 
            src={`http://localhost:3000${meme.imageUrl}`} 
            alt={meme.title}
            className="meme-image" 
          />
        </div>
      ))}
    </div>
  );
};

export default Memes;