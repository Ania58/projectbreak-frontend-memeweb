import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from "firebase/auth";
import axios from "../../axiosConfig";
import { UserContext } from "../../contexts/UserContext";
import { auth } from "../../config/firebase"; 
import "../../css/Authorization.css";

const Profile = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate(); 
  const [profileData, setProfileData] = useState({ name: "", email: "",  currentPassword: "", password: "" });
  const [updateMessage, setUpdateMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteMessage, setDeleteMessage] = useState(""); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/profile");
      
        setProfileData((prev) => ({
          ...prev, 
          name: response.data.name,
          email: response.data.email,
        }));
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };


  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      if (profileData.password) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const credential = EmailAuthProvider.credential(
            currentUser.email,
            profileData.currentPassword 
          );
  
          await reauthenticateWithCredential(currentUser, credential);
  
          await updatePassword(currentUser, profileData.password);
          setUpdateMessage("Password updated successfully!");
        } else {
          setUpdateMessage("You must be logged in to update your password.");
        }
      }
  
      await axios.post("/profile", {
        name: profileData.name,
        email: profileData.email,
      });
  
      setUpdateMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.code === "auth/wrong-password") {
        setUpdateMessage("Incorrect current password.");
      } else {
        setUpdateMessage("Failed to update profile.");
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      return;
    }

    try {
      await axios.delete("/profile"); 
      alert("Your account has been successfully deleted.");
      setDeleteMessage("Your account has been successfully deleted.");
    
      navigate("/");
      window.location.reload(); 
    } catch (error) {
      console.error("Error deleting account:", error);
      setDeleteMessage("Failed to delete your account. Please try again.");
    }
  };

  if (!user) return <p>Please log in to view your profile.</p>;
  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">{profileData.name}'s Profile</h2>
      <p>Email: {profileData.email}</p>

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
        <div className="input-container">
          <input
            type={showCurrentPassword ? "text" : "password"}
            name="currentPassword"
            placeholder="Current Password"
            value={profileData.currentPassword}
            onChange={handleInputChange}
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword((prev) => !prev)}
            className="show-password-button"
          >
            {showCurrentPassword ? "Hide" : "Show"}
          </button>
        </div>
        <div className="input-container">
          <input
            type={showNewPassword  ? "text" : "password"}
            name="password"
            placeholder="New Password (leave blank to keep current)"
            value={profileData.password}
            onChange={handleInputChange}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="show-password-button"
          >
            {showNewPassword  ? "Hide" : "Show"}
          </button>
        </div>
        <button type="submit" className="auth-button">Update Profile</button>
      </form>
      {updateMessage && <p>{updateMessage}</p>}

      <div className="profile-links">
        <h3>Your Content</h3>
        <ul>
          <li>
            <Link to="/profile/images">Images</Link>
            {/*<Link to="/profile/images/manage" style={{ marginLeft: "1rem" }}>Manage Images</Link>*/}
          </li>
          <li>
            <Link to="/profile/films">Films</Link>
            {/*<Link to="/profile/films/manage" style={{ marginLeft: "1rem" }}>Manage Films</Link>*/}
          </li>
          <li>
            <Link to="/profile/memes">Memes</Link>
            {/*<Link to="/profile/memes/manage" style={{ marginLeft: "1rem" }}>Manage Memes</Link>*/}
          </li>
          <li>
            <Link to="/profile/quizzes">Quizzes</Link>
            {/*<Link to="/profile/quizzes/manage" style={{ marginLeft: "1rem" }}>Manage Quizzes</Link>*/}
          </li>
        </ul>
      </div>
      <button className="delete-button" onClick={handleDeleteAccount}>
        Delete Account
      </button>

      {deleteMessage && <p className="delete-message">{deleteMessage}</p>}
    </div>
  );
};

export default Profile;