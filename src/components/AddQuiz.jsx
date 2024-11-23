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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleAddAnswer = () => {
    setNewQuestion({
      ...newQuestion,
      answers: [...newQuestion.answers, newAnswer],
    });
    setNewAnswer({ answerText: '', isCorrect: false });
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, newQuestion]);
    setNewQuestion({ questionText: '', answers: [] });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((tag) => tag.trim()),
      questions,
      if (file) {
        payload.append('file', file);
      }
    };

    try {
      const response = await axios.post('http://localhost:3000/#add/quizzes', payload);
      alert('Quiz added successfully!');
    } catch (error) {
      console.error('Error adding quiz:', error);
      alert('Failed to add quiz.');
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
            <option value="wtf">WTF</option>
            <option value="cats">Cats</option>
            <option value="emotions">Emotions</option>
            <option value="art">Art</option>
            <option value="nature">Nature</option>
            <option value="music and film">Music and film</option>
            <option value="news">News</option>
            <option value="dogs">Dogs</option>
            <option value="motorization'">Motorization'</option>
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
            <input
            type="text"
            placeholder="Question Text"
            value={newQuestion.questionText}
            onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
            />
            <h4>Answers</h4>
            <input
            type="text"
            placeholder="Answer Text"
            value={newAnswer.answerText}
            onChange={(e) => setNewAnswer({ ...newAnswer, answerText: e.target.value })}
            />
            <label>
            <input
                type="checkbox"
                checked={newAnswer.isCorrect}
                onChange={(e) => setNewAnswer({ ...newAnswer, isCorrect: e.target.checked })}
            />
            Correct
            </label>
            <button type="button" onClick={handleAddAnswer}>
            Add Answer
            </button>
            <ul>
            {newQuestion.answers.map((ans, i) => (
                <li key={i}>{ans.answerText} - {ans.isCorrect ? 'Correct' : 'Incorrect'}</li>
            ))}
            </ul>
            <button type="button" onClick={handleAddQuestion}>
            Add Question
            </button>
        </div>
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
        <button type="submit">Submit</button>
        </form>
    </div>
  );
};

export default AddQuiz;