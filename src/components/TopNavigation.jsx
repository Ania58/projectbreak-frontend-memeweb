import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const TopNavigation = () => {
  const location = useLocation();
  return (
    <div className="top-navigation">
      {location.pathname !== "/" && (
      <Link to="/" className="top-link">Home</Link>
    )}
      <Link to="/pending" className="top-link">Pending</Link>
      <Link to="/top" className="top-link">Top</Link>
      <Link to="/login" className="top-link">Login</Link>
      <Link to="/register" className="top-link">Register</Link>
    </div>
  );
};

export default TopNavigation;