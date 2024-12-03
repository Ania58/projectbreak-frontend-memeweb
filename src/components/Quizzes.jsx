import React, { useState } from 'react';
import '../css/ContentStyles.css';
import '../css/Votings.css';
import ContentInfo from './ContentInfo';

const Quizzes = ({quizzes, onVote, hasVoted}) => {
 const [selectedAnswers, setSelectedAnswers] = useState({});

  const handleAnswerClick = (quizId, questionIndex, isCorrect, e) => {
    e.stopPropagation();
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${quizId}-${questionIndex}`]: isCorrect
    }));
  };

  return (
  <div className="content-container">
      {quizzes.map((quiz) => (
        <div className="content-item" key={quiz._id}>
           <h3 className="content-title">{quiz.title}</h3>
          <ContentInfo category={quiz.category} tags={quiz.tags} />
          {quiz.questions.map((question, index) => (
            <div className="question-container" key={index}>
              <p className="question-text">{question.questionText}</p>
              <img 
                src={`http://localhost:3000${quiz.imageUrl}`} 
                alt={quiz.title}
                className="content-image" 
              />
              <div className="answers-container">
                {question.answers.map((answer, aIndex) => (
                  <button
                    key={aIndex}
                    onClick={(e) => handleAnswerClick(quiz._id, index, answer.isCorrect, e)}
                    className="answer-button"
                  >
                    {answer.answerText}
                  </button>
                ))}
              </div>
              {selectedAnswers[`${quiz._id}-${index}`] !== undefined && (
                <p className={`feedback ${
                  selectedAnswers[`${quiz._id}-${index}`]
                    ? "feedback-correct"
                    : "feedback-incorrect"
                }`}>
                  {selectedAnswers[`${quiz._id}-${index}`] 
                    ? "Correct!" 
                    : "Incorrect, try again!"}
                </p>
              )}
            </div>
          ))}
          <div className="voting-container">
            <p>Upvotes: {quiz.upvotes} | Downvotes: {quiz.downvotes}</p>
            <button className="upvote-button" onClick={(e) => onVote(1, e)} disabled={hasVoted}>+</button>
            <button className="downvote-button" onClick={(e) => onVote(-1, e)} disabled={hasVoted}>-</button>
            {hasVoted && <p className="voted-text">You have voted on this content.</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Quizzes;