import { Link } from 'react-router-dom'
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

function Profile() {
  const { user, loading } = useContext(UserContext);

  if (loading) return <p>Loading profile...</p>;

  return (
    <div>
      <Link to={"/feed"}>Feed</Link>
      <h2>Profile</h2>
      {user ? (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <p>No user data available.</p>
      )}
    </div>
  );
}

export default Profile;
