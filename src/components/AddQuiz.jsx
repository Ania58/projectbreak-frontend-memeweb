import React, { useState } from 'react';
import axios from 'axios';
import AddContentNavigation from './AddContentNavigation';
import '../css/AddContentForm.css';

const AddQuiz = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: '',
    rulesAccepted: false,
    copyrightsAccepted: false,
  });
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({ questionText: '', answers: [] });
  const [newAnswer, setNewAnswer] = useState({ answerText: '', isCorrect: false });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState(''); 

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddAnswer = () => {
    if (!newAnswer.answerText.trim()) {
      setMessage('Answer text cannot be empty.');
      return;
    }

    setNewQuestion((prev) => ({
      ...prev,
      answers: [...prev.answers, newAnswer],
    }));

    setMessage('Answer added!');
    setNewAnswer({ answerText: '', isCorrect: false });
  };

  const handleToggleCorrect = (index) => {
    setNewQuestion((prev) => {
      const updatedAnswers = prev.answers.map((answer, i) =>
        i === index ? { ...answer, isCorrect: !answer.isCorrect } : answer
      );
      return { ...prev, answers: updatedAnswers };
    });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.questionText.trim()) {
      setMessage('Question text cannot be empty.');
      return;
    }

    if (newQuestion.answers.length < 2) {
      setMessage('Each question must have at least two answers.');
      return;
    }

    if (!newQuestion.answers.some((answer) => answer.isCorrect)) {
      setMessage('Each question must have at least one correct answer.');
      return;
    }

    
    setQuestions((prev) => [...prev, newQuestion]);
    setMessage('Question added successfully!');

    
    setNewQuestion({ questionText: '', answers: [] });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (questions.length === 0) {
      setMessage('You must add at least one question before submitting.');
      return;
    }

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('category', formData.category);
    payload.append('tags', formData.tags);
    payload.append('rulesAccepted', formData.rulesAccepted ? 'true' : 'false');
    payload.append('copyrightsAccepted', formData.copyrightsAccepted ? 'true' : 'false');
    payload.append('questions', JSON.stringify(questions));
    if (file) payload.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/add/quizzes', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Quiz added successfully!');
    } catch (error) {
      console.error('Error adding quiz:', error.response?.data || error.message);
      alert(`Failed to add quiz: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  return (
    <div>
      <AddContentNavigation />
      <form onSubmit={handleSubmit} className="add-content-form">
        <h2>Add Quiz</h2>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
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
            <option value="motorization">Motorization'</option>
        </select>
        <input type="file" name="file" onChange={handleFileChange} accept="image/*" required />
        <input
          type="text"
          name="tags"
          placeholder="Tags (comma-separated)"
          value={formData.tags}
          onChange={handleChange}
        />

        <div>
          <h3>Add Questions</h3>
          {message && <p style={{ color: 'white' }}>{message}</p>}
          <input
            type="text"
            placeholder="Question Text"
            value={newQuestion.questionText}
            onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
          />
          <button type="button" onClick={handleAddQuestion}>
            Add Question
          </button>
          <p style={{ fontSize: '0.9em', color: 'gray' }}>
            Note: The question will be saved once you click "Add Question". Then add answers below.
          </p>

          <h4>Answers</h4>
          <input
            type="text"
            placeholder="Answer Text"
            value={newAnswer.answerText}
            onChange={(e) => setNewAnswer({ ...newAnswer, answerText: e.target.value })}
          />
          <button type="button" onClick={handleAddAnswer}>
            Add Answer
          </button>
          <p style={{ fontSize: '0.9em', color: 'gray' }}>
            At least one answer must be marked as correct by clicking "Correct" below.
          </p>

          <ul>
            {newQuestion.answers.map((ans, i) => (
              <li key={i}>
                {ans.answerText} -{' '}
                <button
                  type="button"
                  onClick={() => handleToggleCorrect(i)}
                  style={{
                    backgroundColor: ans.isCorrect ? 'green' : 'red',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    cursor: 'pointer',
                  }}
                >
                  {ans.isCorrect ? 'Correct' : 'Incorrect'}
                  </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="agreement-section">
          <label>
            <input
              type="checkbox"
              name="rulesAccepted"
              checked={formData.rulesAccepted}
              onChange={handleChange}
              required
            />
            I accept the rules
          </label>
          <label>
            <input
              type="checkbox"
              name="copyrightsAccepted"
              checked={formData.copyrightsAccepted}
              onChange={handleChange}
              required
            />
            I accept copyrights
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddQuiz;
