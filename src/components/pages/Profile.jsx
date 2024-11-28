import React, { useState, useEffect, useContext } from "react";
import axios from "../../axiosConfig";
import { UserContext } from "../../contexts/UserContext";
import { auth } from "../../config/firebase"; 
import '../../css/Authorization.css'

const Profile = () => {
  const { user } = useContext(UserContext);
  const [content, setContent] = useState({ films: [], images: [], memes: [], quizzes: [] });
  const [profileData, setProfileData] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [updateMessage, setUpdateMessage] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get("/profile/content");
        console.log("Fetched content:", response.data);

        const baseURL = "http://localhost:3000";

        const filmsWithFullUrl = response.data.films.map((film) => ({
          ...film,
          videoUrl: `${baseURL}${film.videoUrl}`
        }));

        const imagesWithFullUrl = response.data.images.map((image) => ({
          ...image,
          imageUrl: `${baseURL}${image.imageUrl}`
        }));

        const memesWithFullUrl = response.data.memes.map((meme) => ({
          ...meme,
          imageUrl: meme.imageUrl.startsWith('http') 
          ? meme.imageUrl 
          :`${baseURL}${meme.imageUrl}`
        }));

        const quizzesWithFullUrl = response.data.quizzes.map((quiz) => ({
          ...quiz,
          quizUrl: `${baseURL}${quiz.quizUrl}` 
        }));

        setContent({
          films: filmsWithFullUrl,
          images: imagesWithFullUrl,
          memes: memesWithFullUrl,
          quizzes: quizzesWithFullUrl,
        });
      } catch (error) {
        console.error("Error fetching user content:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchContent();
      setProfileData({ name: user.name, email: user.email, password: "" });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/profile", {
        name: profileData.name,
        email: profileData.email,
      });

      if (profileData.password) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          await currentUser.updatePassword(profileData.password); 
          setUpdateMessage("Profile and password updated successfully!");
        } else {
          setUpdateMessage("You must be logged in to update your password.");
        }
      } else {
        setUpdateMessage("Profile updated successfully!");
      }

    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateMessage("Failed to update profile.");
    }
  };

  if (!user) return <p>Please log in to view your profile.</p>;
  if (loading) return <p>Loading your content...</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">{user.name}'s Profile</h2>

      <form onSubmit={handleProfileUpdate} className="profile-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={profileData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={profileData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="New Password (leave blank to keep current)"
          value={profileData.password}
          onChange={handleInputChange}
        />
        <button type="submit">Update Profile</button>
      </form>
      {updateMessage && <p>{updateMessage}</p>}

      <div className="profile-section">
        <h3 className="profile-subtitle">Your Films</h3>
        {content.films.length > 0 ? (
          content.films.map((film) => (
            <div key={film._id} className="profile-content">
              <h4>{film.title}</h4>
              <div className="tags">
                {film.tags.map((tag, index) => (
                  <span key={index} className="tag-badge">{tag}</span>
                ))}
              </div>
              <video controls>
                <source src={film.videoUrl} type="video/mp4" />
              </video>
            </div>
          ))
        ) : (
          <p>No films added yet.</p>
        )}
      </div>

      <div className="profile-section">
        <h3 className="profile-subtitle">Your Images</h3>
        {content.images.length > 0 ? (
          content.images.map((image) => (
            <div key={image._id} className="profile-content">
              <h4>{image.title}</h4>
              <div className="tags">
                {image.tags.map((tag, index) => (
                  <span key={index} className="tag-badge">{tag}</span>
                ))}
              </div>
              <img src={image.imageUrl} alt={image.title} />
            </div>
          ))
        ) : (
          <p>No images added yet.</p>
        )}
      </div>

      <div className="profile-section">
        <h3 className="profile-subtitle">Your Memes</h3>
        {content.memes.length > 0 ? (
          content.memes.map((meme) => (
            <div key={meme._id} className="profile-content">
              <h4>{meme.title}</h4>
              <div className="tags">
                {meme.tags.map((tag, index) => (
                  <span key={index} className="tag-badge">{tag}</span>
                ))}
              </div>
              <img src={meme.imageUrl} alt={meme.title} />
            </div>
          ))
        ) : (
          <p>No memes added yet.</p>
        )}
      </div>

      <div className="profile-section">
        <h3 className="profile-subtitle">Your Quizzes</h3>
        {content.quizzes.length > 0 ? (
          content.quizzes.map((quiz) => (
            <div key={quiz._id} className="profile-content">
              <h4>{quiz.title}</h4>
              <div className="tags">
                {quiz.tags.map((tag, index) => (
                  <span key={index} className="tag-badge">{tag}</span>
                ))}
              </div>
              <p className="quiz-placeholder">Quiz content will appear here.</p>
            </div>
          ))
        ) : (
          <p>No quizzes added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;