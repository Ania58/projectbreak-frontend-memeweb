import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/PendingContent.css';

const PendingContent = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingItems = async () => {
      try {
        const response = await axios.get('http://localhost:3000/pending'); 

        const data = response.data;

        const allItems = [
          ...(data.films || []),
          ...(data.images || []),
          ...(data.memes || []),
          ...(data.quizzes || []),
        ];

        setPendingItems(allItems);
      } catch (err) {
        console.error("Error fetching pending items:", err);
        setError("Failed to fetch pending items.");
      }
    };

    fetchPendingItems();
  }, []);

  //console.log("pendingItems:", pendingItems);
  //console.log("Is pendingItems an array?", Array.isArray(pendingItems));

  return (
    <div className="pending-content">
      <h2>Pending Items</h2>
      {error && <p>{error}</p>}
      {pendingItems.map((item) => (
        <div key={item._id} className="pending-item">
          <h3>{item.title}</h3>
          {item.imageUrl && <img src={`http://localhost:3000${item.imageUrl}`} alt={item.title} />}
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

export default PendingContent;