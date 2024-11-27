import React, { useContext, useEffect }  from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from "../../contexts/UserContext";
import '../../css/AddContent.css';

const AddContent = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login"); 
    }
  }, [user, navigate]);

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