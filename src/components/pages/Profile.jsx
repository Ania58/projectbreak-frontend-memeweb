import React, { useState, useEffect, useContext } from "react";
import axios from "../../axiosConfig";
import { UserContext } from "../../contexts/UserContext";
import '../../css/Authorization.css'

const Profile = () => {
  const { user } = useContext(UserContext);
  const [content, setContent] = useState({ films: [], images: [], memes: [], quizzes: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get("/profile/content");
        setContent(response.data);
      } catch (error) {
        console.error("Error fetching user content:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchContent();
    }
  }, [user]);

  if (!user) return <p>Please log in to view your profile.</p>;

  if (loading) return <p>Loading your content...</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">{user.name}'s Profile</h2>

      <div className="profile-section">
        <h3 className="profile-subtitle">Your Films</h3>
        {content.films.length > 0 ? (
          content.films.map((film) => (
            <div key={film._id} className="profile-content">
              <p>{film.title}</p>
            </div>
          ))
        ) : (
          <p>You haven't added any films yet.</p>
        )}
      </div>

      <div className="profile-section">
        <h3 className="profile-subtitle">Your Images</h3>
        {content.images.length > 0 ? (
          content.images.map((image) => (
            <div key={image._id} className="profile-content">
              <p>{image.title}</p>
            </div>
          ))
        ) : (
          <p>You haven't added any images yet.</p>
        )}
      </div>

      <div className="profile-section">
        <h3 className="profile-subtitle">Your Memes</h3>
        {content.memes.length > 0 ? (
          content.memes.map((meme) => (
            <div key={meme._id} className="profile-content">
              <p>{meme.title}</p>
            </div>
          ))
        ) : (
          <p>You haven't added any memes yet.</p>
        )}
      </div>

      <div className="profile-section">
        <h3 className="profile-subtitle">Your Quizzes</h3>
        {content.quizzes.length > 0 ? (
          content.quizzes.map((quiz) => (
            <div key={quiz._id} className="profile-content">
              <p>{quiz.title}</p>
            </div>
          ))
        ) : (
          <p>You haven't added any quizzes yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
