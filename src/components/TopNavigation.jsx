import React from 'react';
import { Link } from 'react-router-dom';
import '../css/TopNavigation.css';

const TopNavigation = () => {
  return (
    <div className="top-navigation">
      <Link to="/pending" className="top-link">Pending</Link>
      <Link to="/top" className="top-link">Top</Link>
      <Link to="/login" className="top-link">Login</Link>
      <Link to="/register" className="top-link">Register</Link>
    </div>
  );
};

export default TopNavigation;