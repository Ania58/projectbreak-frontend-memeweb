import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/PendingContent.css';

const PendingContent = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});

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

  const handleAnswerClick = (quizId, questionIndex, isCorrect) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${quizId}-${questionIndex}`]: isCorrect
    }));
  };

  return (
    <div className="pending-content">
      <h2>Pending Items</h2>
      {error && <p>{error}</p>}
      {pendingItems.map((item) => (
        <div key={item._id} className={`pending-item ${item.questions ? 'quiz-item' : ''}`}>
          <h3>{item.title}</h3>
          {item.imageUrl && <img src={`http://localhost:3000${item.imageUrl}`} alt={item.title} />}
          {item.videoUrl && (
            <video controls>
              <source src={`http://localhost:3000${item.videoUrl}`} type="video/mp4" />
            </video>
          )}
          {item.questions && item.questions.length > 0 && (
            <div className="questions-container">
              {item.questions.map((question, qIndex) => (
                <div className="question-item" key={qIndex}>
                  <p className="question-text">{question.questionText}</p>
                  <ul className="answers-container">
                    {question.answers.map((answer, aIndex) => (
                      <li
                        key={aIndex}
                        onClick={() => handleAnswerClick(item._id, qIndex, answer.isCorrect)}
                        className="answer-button"
                      >
                        {answer.answerText}
                      </li>
                    ))}
                  </ul>
                  {selectedAnswers[`${item._id}-${qIndex}`] !== undefined && (
                    <p className="feedback">
                      {selectedAnswers[`${item._id}-${qIndex}`] ? "Correct!" : "Incorrect, try again!"}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PendingContent;