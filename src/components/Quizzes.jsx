import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Quizzes.css';

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/quizzes');
        //console.log("Fetched quizzes:", response.data);
        setQuizzes(response.data);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError(err.message);
      }
    };

    fetchQuizzes();
  }, []);

  return (
    <div className="quizzes-container">
      {error && <p>Error fetching quizzes: {error}</p>}
      {quizzes.map((quiz) => (
        <div className="quiz-item" key={quiz._id}>
            <p className="quiz-title">{quiz.title}</p>
          <img 
            src={`http://localhost:3000${quiz.imageUrl}`} 
            alt={quiz.title}
            className="quiz-image" 
          />
        </div>
      ))}
    </div>
  );
};

export default Quizzes;