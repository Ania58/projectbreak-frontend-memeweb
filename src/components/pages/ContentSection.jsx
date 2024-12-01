import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../axiosConfig";
import "../../css/Authorization.css";

const ContentSection = ({ type }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/profile/content`);
        const baseURL = "http://localhost:3000";

        const processedContent = response.data[type].map((item) => {
          if (type === "films") {
            return { ...item, videoUrl: `${baseURL}${item.videoUrl}` };
          }
          if (type === "images" || type === "quizzes") {
            return { ...item, imageUrl: `${baseURL}${item.imageUrl}` };
          }
          if (type === "memes") {
            return {
              ...item,
              imageUrl: item.imageUrl.startsWith("http")
                ? item.imageUrl
                : `${baseURL}${item.imageUrl}`,
            };
          }
          return item;
        });

        const sortedContent = processedContent.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setContent(sortedContent);

        const totalPages = Math.ceil(sortedContent.length / itemsPerPage);
        const queryPage = new URLSearchParams(location.search).get("page");
        setCurrentPage(
          queryPage ? parseInt(queryPage) : totalPages > 0 ? totalPages : 1
        );
      } catch (error) {
        console.error(`Error fetching ${type}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [type, location.search]);

  const totalPages = Math.ceil(content.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    navigate(`?page=${page}`);
    window.scrollTo(0, 0); 
  };

  const paginatedContent = content.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAnswerClick = (quizId, questionIndex, isCorrect) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${quizId}-${questionIndex}`]: isCorrect,
    }));
  };

  if (loading) return <p>Loading {type}...</p>;

  return (
    <div className="profile-container">
      <h3 className="profile-subtitle">Your {type}</h3>
      {paginatedContent.length > 0 ? (
        <>
          {paginatedContent.map((item) => (
            <div key={item._id} className="profile-content">
              <h4>{item.title}</h4>
              <div className="tags">
                {item.tags.map((tag, index) => (
                  <span key={index} className="tag-badge">
                    {tag}
                  </span>
                ))}
              </div>
              {type === "films" && (
                <video controls className="profile-content video">
                  <source src={item.videoUrl} type="video/mp4" />
                </video>
              )}
              {(type === "images" || type === "memes" || type === "quizzes") && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="profile-content img"
                />
              )}
              {type === "quizzes" &&
                item.questions.length > 0 &&
                item.questions.map((question, qIndex) => (
                  <div key={qIndex} className="question-container">
                    <p className="question-text">{question.questionText}</p>
                    <div className="answers-container">
                      {question.answers.map((answer, aIndex) => (
                        <button
                          key={aIndex}
                          className={`answer-button ${
                            selectedAnswers[`${item._id}-${qIndex}`] !== undefined
                              ? selectedAnswers[`${item._id}-${qIndex}`] &&
                                answer.isCorrect
                                ? "answer-correct"
                                : "answer-incorrect"
                              : ""
                          }`}
                          onClick={() =>
                            handleAnswerClick(item._id, qIndex, answer.isCorrect)
                          }
                        >
                          {answer.answerText}
                        </button>
                      ))}
                    </div>
                    {selectedAnswers[`${item._id}-${qIndex}`] !== undefined && (
                      <p
                        className={`feedback ${
                          selectedAnswers[`${item._id}-${qIndex}`]
                            ? "feedback-correct"
                            : "feedback-incorrect"
                        }`}
                      >
                        {selectedAnswers[`${item._id}-${qIndex}`]
                          ? "Correct!"
                          : "Incorrect, try again!"}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          ))}
          <div className="pagination">
            {currentPage > 1 && (
              <button
                className="auth-button"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>
            )}
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`auth-button ${
                  currentPage === index + 1 ? "active-page" : ""
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                className="auth-button"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <p>No {type} added yet.</p>
      )}
    </div>
  );
};

export default ContentSection;