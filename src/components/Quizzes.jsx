import React, { useState } from 'react';
import '../css/Quizzes.css';

const Quizzes = ({quizzes, onVote}) => {
 const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleAnswerClick = (quizId, questionIndex, isCorrect) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${quizId}-${questionIndex}`]: isCorrect
    }));
  };

  return (
  <div className="quizzes-container">
      {quizzes.map((quiz) => (
        <div className="quiz-item" key={quiz._id}>
          {quiz.questions.map((question, index) => (
            <div className="question-container" key={index}>
              <p className="question-text">{question.questionText}</p>
              <img 
                src={`http://localhost:3000${quiz.imageUrl}`} 
                alt={quiz.title}
                className="quiz-image" 
              />
              <div className="answers-container">
                {question.answers.map((answer, aIndex) => (
                  <button
                    key={aIndex}
                    onClick={() => handleAnswerClick(quiz._id, index, answer.isCorrect)}
                    className="answer-button"
                  >
                    {answer.answerText}
                  </button>
                ))}
              </div>
              {selectedAnswers[`${quiz._id}-${index}`] !== undefined && (
                <p className="feedback">
                  {selectedAnswers[`${quiz._id}-${index}`] 
                    ? "Correct!" 
                    : "Incorrect, try again!"}
                </p>
              )}
            </div>
          ))}
          <div className="voting-container">
            <p>Upvotes: {quiz.upvotes} | Downvotes: {quiz.downvotes}</p>
            <button onClick={() => onVote(1)}>+</button>
            <button onClick={() => onVote(-1)}>-</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Quizzes;