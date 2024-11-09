import React, { useEffect, useState } from 'react';
import '../css/Quizzes.css';

const Quizzes = ({quizzes}) => {
  /*const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);*/
  const [selectedAnswers, setSelectedAnswers] = useState({});

  /*useEffect(() => {
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
  }, []);*/

  const handleAnswerClick = (quizId, questionIndex, isCorrect) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${quizId}-${questionIndex}`]: isCorrect
    }));
  };

  return (
  <div className="quizzes-container">
      {/*{error && <p>Error fetching quizzes: {error}</p>}*/}
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
        </div>
      ))}
    </div>
  );
};

export default Quizzes;