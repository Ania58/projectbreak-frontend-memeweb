import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/AddContent.css';

const AddContent = () => {
  return (
    <div className="add-content-container">
      <h2>Add New Content</h2>
      <div className="add-content-options">
        <Link to="/add/films" className="add-link">Add Film</Link>
        <Link to="/add/images" className="add-link">Add Image</Link>
        <Link to="/add/memes" className="add-link">Add Meme</Link>
        <Link to="/add/quizzes" className="add-link">Add Quiz</Link>
      </div>
    </div>
  );
};

export default AddContent;