import React from "react";
import ContentSection from "./ContentSection";
import { Link } from "react-router-dom";
import "../../css/Authorization.css";

const FilmsPage = () => {
  return (
    <div className="profile-container">
      <h2 className="profile-title">Your Films</h2>

      <div className="profile-links">
        <h3>Navigate to Other Content</h3>
        <ul>
          <li><Link to="/profile">Back to Profile</Link></li>
          <li><Link to="/profile/images">Images</Link></li>
          <li><Link to="/profile/memes">Memes</Link></li>
          <li><Link to="/profile/quizzes">Quizzes</Link></li>
        </ul>
      </div>
      <Link to="/profile/films/manage" className="auth-button"> Manage Your Films</Link>
      
      <ContentSection type="films" />
    </div>
  );
};

export default FilmsPage;
