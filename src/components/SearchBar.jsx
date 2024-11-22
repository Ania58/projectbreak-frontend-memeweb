import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  {/*const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query.trim()); 
    setQuery(''); 
  };*/}

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim().toLowerCase())}`);
      setQuery(''); 
    }
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={query} 
          onChange={handleInputChange} 
          placeholder="Search by category or tag..."
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;