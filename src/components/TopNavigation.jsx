import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import LogoutButton from './firebaseUser/LogoutButton';

const TopNavigation = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  return (
    <div className="top-navigation">
      {location.pathname !== "/" && (
      <Link to="/" className="top-link">Home</Link>
    )}
      <Link to="/pending" className="top-link">Pending</Link>
      <Link to="/add" className="top-link">Add Content</Link>
      <Link to="/top" className="top-link">Top</Link>
      {user && <Link to="/profile" className="top-link">Profile</Link>}
      {!user && <Link to="/login" className="top-link">Login</Link> }
      {!user &&  <Link to="/register" className="top-link">Register</Link> }
      {user && <LogoutButton />}
    </div>
  );
};

export default TopNavigation;