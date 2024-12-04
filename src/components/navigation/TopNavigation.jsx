import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import LogoutButton from '../firebaseUser/LogoutButton';
import { auth } from '../../config/firebase';

const TopNavigation = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      if (auth.currentUser) {
        await auth.currentUser.reload(); 
        setIsVerified(auth.currentUser.emailVerified);
      }
    };

    if (user) {
      checkVerification();
    }
  }, [user]);

  return (
    <div className="top-navigation">
      {location.pathname !== "/" && (
      <Link to="/" className="top-link">Home</Link>
    )}
      <Link to="/pending" className="top-link">Pending</Link>
      <Link to="/add" className="top-link">Add Content</Link>
      <Link to="/top" className="top-link">Top</Link>
      
      {user && isVerified && <Link to="/profile" className="top-link">Profile</Link>}
      
      {!user && (
        <>
          <Link to="/login" className="top-link">Login</Link>
          <Link to="/register" className="top-link">Register</Link>
        </>
      )}

      {user && isVerified && <LogoutButton />}

      {user && !isVerified && (
        <>
          <Link to="/login" className="top-link">Login</Link>
          <Link to="/register" className="top-link">Register</Link>
        </>
      )}
    </div>
  );
};

export default TopNavigation;
