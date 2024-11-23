import React from 'react';
import { Link } from 'react-router-dom';
import '../css/AddContentNavigation.css'; 

const AddContentNavigation = () => {
  return (
    <div className="add-content-navigation">
      <Link to="/add/films" className="add-link">Add Film</Link>
      <Link to="/add/images" className="add-link">Add Image</Link>
      <Link to="/add/memes" className="add-link">Add Meme</Link>
      <Link to="/add/quizzes" className="add-link">Add Quiz</Link>
    </div>
  );
};

export default AddContentNavigation;