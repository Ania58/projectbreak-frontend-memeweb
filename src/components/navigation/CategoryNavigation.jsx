import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/CategoryNavigation.css';

const mainCategories = ['animals', 'humor', 'memes', 'cats', 'dogs', 'emotions', 'art', 'popculture', 'WTF'];
const allCategories = [
  'animals', 'humor', 'videos', 'memes', 'comics', 'curiosities', 'food', 
  'politics', 'culture', 'sport', 'popculture', 'history', 'war', 'WTF', 
  'cats', 'emotions', 'art', 'nature', 'music and film', 'news', 'dogs', 
  'motorization'
];

const CategoryNavigation = () => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const handleSearchClick = () => {
    setShowAllCategories(!showAllCategories); 
  };

  const categoriesToDisplay = showAllCategories ? allCategories : mainCategories;

  return (
    <div className="category-navigation">
      <div className="category-list">
        {categoriesToDisplay.map((category) => (
          <Link key={category} to={`/category/${category}`} className="category-link">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Link>
        ))}
      </div>
      <button onClick={handleSearchClick} className="show-button">
        {showAllCategories ? 'Hide All Categories' : 'Show All'}
      </button>
    </div>
  );
};

export default CategoryNavigation;