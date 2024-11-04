import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../css/CategoryContent.css';

const CategoryContent = () => {
  const { category } = useParams();
  const [content, setContent] = useState([]);
  const [error, setError] = useState(null); 

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`/content?category=${category}`);
        //console.log('Fetched data:', response.data); 
        //setContent(response.data);
        setContent(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching category content:', error);
        setError('Failed to fetch content.');
      }
    };
    fetchContent();
  }, [category]);


  return (
    <div className="category-content">
    <h2>{category}</h2>
    {content.map((item, index) => (
    <div key={index} className="content-item">
      <h3>{item.title}</h3>
      {item.imageUrl && (
      <img src={`http://localhost:3000${item.imageUrl}`} alt={item.title} />
    )}
        {item.videoUrl && (
      <video controls>
        <source src={`http://localhost:3000${item.videoUrl}`} type="video/mp4" />
     </video>
        )}
    </div>
    ))}
    </div>
  );
};

export default CategoryContent;