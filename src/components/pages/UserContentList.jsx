import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../../css/UserContentList.css';

const UserContentList = ({ contentType, endpoint }) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContent(response.data);
      } catch (error) {
        console.error(`Error fetching ${contentType}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [endpoint, contentType]);

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditData({
      title: item.title || '',
      category: item.category || '',
      tags: item.tags ? item.tags.join(', ') : '',
      description: contentType === 'films' ? item.description || '' : undefined,
      templateId: contentType === 'memes' ? item.templateId || '' : undefined,
      questions: contentType === 'quizzes' ? item.questions || [] : undefined,
    });

    if (contentType === 'memes') {
      const template = templates.find((t) => t.id === item.templateId);
      setSelectedTemplate(template || null);
    }
  };

  const handleTemplateSelect = (templateId) => {
    const template = templates.find((t) => t.id === templateId);
    setEditData((prev) => ({ ...prev, templateId }));
    setSelectedTemplate(template || null);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('https://api.imgflip.com/get_memes');
        const data = await response.json();
        setTemplates(data.data.memes || []);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    if (contentType === 'memes') {
      fetchTemplates();
    }
  }, [contentType]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    setEditData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[index][field] = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleAnswerChange = (questionIndex, answerIndex, value) => {
    setEditData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].answers[answerIndex].answerText = value;
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleCorrectAnswerChange = (questionIndex, answerIndex) => {
    setEditData((prev) => {
      const updatedQuestions = [...prev.questions];
      updatedQuestions[questionIndex].answers.forEach(
        (answer, i) => (answer.isCorrect = i === answerIndex)
      );
      return { ...prev, questions: updatedQuestions };
    });
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const updatedData = {
        ...editData,
        tags: editData.tags.split(',').map((tag) => tag.trim()),
      };

      if (editData.templateId) {
        updatedData.templateId = editData.templateId; 
      }

      const response = await axios.put(
        `/user/${contentType}/${editingId}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent((prev) =>
        prev.map((item) => (item._id === editingId ? response.data : item))
      );

      if (contentType === 'memes') {
        const updatedTemplate = templates.find((t) => t.id === editData.templateId);
        setSelectedTemplate(updatedTemplate || null);
      }
      
      setEditingId(null);
    } catch (error) {
      console.error(`Error saving changes to ${contentType}:`, error);
    }
  };

  const handleDelete = async (id) => {

    const singularContentType =
        contentType === 'quizzes'
            ? 'quiz'
            : contentType.slice(0, -1);

    if (window.confirm(`Are you sure you want to delete this ${singularContentType}?`)) {
        
      try {
        const token = localStorage.getItem('authToken');
        await axios.delete(`/user/${contentType}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setContent((prev) => prev.filter((item) => item._id !== id));
      } catch (error) {
        console.error(`Error deleting ${singularContentType}:`, error);
      }
    }
  };

  const handleAnswerClick = (quizId, questionIndex, isCorrect) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [`${quizId}-${questionIndex}`]: isCorrect,
    }));
  };

  if (loading) return <p className="loading">Loading {contentType}...</p>;

  return (
    <div className="user-content">
      <div className="content-list-container">
        <div className="navigation-links">
          <h3>Navigate to Other Content</h3>
          <ul>
            <li>
              <Link to="/profile">Back to Profile</Link>
            </li>
            <li>
              <Link to="/profile/films">Films</Link>
            </li>
            <li>
              <Link to="/profile/images">Images</Link>
            </li>
            <li>
              <Link to="/profile/memes">Memes</Link>
            </li>
            <li>
              <Link to="/profile/quizzes">Quizzes</Link>
            </li>
          </ul>
        </div>
        <h3 className="content-list-title">Your {contentType}</h3>
        {content.length > 0 ? (
          <ul className="content-list">
            {content.map((item) => (
              <li key={item._id} className="content-item">
                {editingId === item._id ? (
                  <div className="edit-container">
                    <input
                      type="text"
                      name="title"
                      className="edit-input"
                      placeholder="Title"
                      value={editData.title}
                      onChange={handleEditChange}
                    />
                    <select
                      name="category"
                      className="edit-select"
                      value={editData.category}
                      onChange={handleEditChange}
                    >
                      <option value="">Select Category</option>
                      <option value="animals">Animals</option>
                      <option value="humor">Humor</option>
                      <option value="videos">Videos</option>
                      <option value="memes">Memes</option>
                      <option value="comics">Comics</option>
                      <option value="curiosities">Curiosities</option>
                      <option value="food">Food</option>
                      <option value="politics">Politics</option>
                      <option value="culture">Culture</option>
                      <option value="sport">Sport</option>
                      <option value="popculture">Popculture</option>
                      <option value="history">History</option>
                      <option value="war">War</option>
                      <option value="WTF">WTF</option>
                      <option value="cats">Cats</option>
                      <option value="emotions">Emotions</option>
                      <option value="art">Art</option>
                      <option value="nature">Nature</option>
                      <option value="music and film">Music and film</option>
                      <option value="news">News</option>
                      <option value="dogs">Dogs</option>
                      <option value="motorization">Motorization</option>
                    </select>
                    <input
                      type="text"
                      name="tags"
                      className="edit-input"
                      placeholder="Tags (comma-separated)"
                      value={editData.tags}
                      onChange={handleEditChange}
                    />
                    {contentType === 'memes' && (
                      <div className="template-select-container">
                        <label className="template-label">Select Template:</label>
                        <select
                          className="template-select"
                          value={editData.templateId}
                          onChange={(e) => handleTemplateSelect(e.target.value)}
                        >
                          <option value="">Select Template</option>
                          {templates.map((template) => (
                            <option key={template.id} value={template.id}>
                              {template.name}
                            </option>
                          ))}
                        </select>
                        {selectedTemplate && (
                          <img
                            src={selectedTemplate.url}
                            alt={selectedTemplate.name}
                            className="template-preview"
                          />
                        )}
                      </div>
                    )}
                    {contentType === 'quizzes' &&
                      editData.questions?.map((question, qIndex) => (
                        <div key={qIndex} className="edit-question">
                          <label className="question-label">Question:</label>
                          <input
                            type="text"
                            value={question.questionText}
                            className="edit-question-input"
                            onChange={(e) =>
                              handleQuestionChange(qIndex, 'questionText', e.target.value)
                            }
                          />
                          {question.answers.map((answer, aIndex) => (
                            <div key={aIndex} className="edit-answer">
                              <input
                                type="text"
                                value={answer.answerText}
                                className="edit-answer-input"
                                onChange={(e) =>
                                  handleAnswerChange(qIndex, aIndex, e.target.value)
                                }
                              />
                              <input
                                type="radio"
                                name={`correct-${qIndex}`}
                                checked={answer.isCorrect}
                                onChange={() =>
                                  handleCorrectAnswerChange(qIndex, aIndex)
                                }
                              />
                            </div>
                          ))}
                        </div>
                      ))}
                    {contentType === 'films' && (
                      <textarea
                        name="description"
                        className="edit-textarea"
                        placeholder="Description"
                        value={editData.description}
                        onChange={handleEditChange}
                      />
                    )}
                    <button className="edit-save-button" onClick={handleEditSave}>
                      Save
                    </button>
                    <button
                      className="edit-cancel-button"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <h4 className="content-title">{item.title}</h4>
                    {contentType === 'quizzes' && (
                      <div className="quiz-container">
                        {item.imageUrl && (
                          <img
                            src={
                              item.imageUrl.startsWith('http')
                                ? item.imageUrl
                                : `http://localhost:3000${item.imageUrl}`
                            }
                            alt={item.title}
                            className="quiz-image"
                          />
                        )}
                        {item.questions.map((question, qIndex) => (
                          <div key={qIndex} className="quiz-question">
                            <p className="question-text">{question.questionText}</p>
                            <div className="answers-container">
                              {question.answers.map((answer, aIndex) => (
                                <button
                                  key={aIndex}
                                  className={`answer-button ${
                                    selectedAnswers[`${item._id}-${qIndex}`] !== undefined
                                      ? selectedAnswers[`${item._id}-${qIndex}`] &&
                                        answer.isCorrect
                                        ? 'correct'
                                        : 'incorrect'
                                      : ''
                                  }`}
                                  onClick={() =>
                                    handleAnswerClick(item._id, qIndex, answer.isCorrect)
                                  }
                                >
                                  {answer.answerText}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {contentType === 'films' && (
                      <video
                        controls
                        className="content-video"
                        src={`http://localhost:3000${item.videoUrl}`}
                      />
                    )}
                    {contentType === 'images' && (
                      <img
                        src={`http://localhost:3000${item.imageUrl}`}
                        alt={item.title}
                        className="content-image"
                      />
                    )}
                    {contentType === 'memes' && (
                      <img
                        src={
                          item.imageUrl.startsWith('http')
                            ? item.imageUrl
                            : `http://localhost:3000${item.imageUrl}`
                        }
                        alt={item.title}
                        className="content-image"
                      />
                    )}
                    <p className="content-category">Category: {item.category}</p>
                    <p className="content-tags">Tags: {item.tags?.join(', ')}</p>
                    {contentType === 'films' && (
                      <p className="content-description">
                        Description: {item.description}
                      </p>
                    )}
                    <button
                      className="edit-button"
                      onClick={() => handleEditClick(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(item._id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-content">No {contentType} found.</p>
        )}
      </div>
    </div>
  );
};

export default UserContentList;

