import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ContentList from './ContentList';
import Pagination from './Pagination';
import '../css/SearchResults.css';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResults = () => {
  const query = useQuery().get('q') || '';
  const navigate = useNavigate();
  const [content, setContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 8;
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/content/search?query=${encodeURIComponent(query)}`);
        const allContent = response.data.content;

        const totalPages = Math.ceil(allContent.length / itemsPerPage)
        setTotalPages(totalPages);
        setContent(allContent);
        setCurrentPage(totalPages > 0 ? totalPages : 1); 
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("Failed to fetch search results.");
      }
    };

    fetchSearchResults();
  }, [query]);

  const paginatedContent = content.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (!query) {
    return <div className="search-results"><p>Please enter a search query.</p></div>;
  }

  return (
    <div className="search-results">
      <h2>Search Results for "{query}"</h2>
      {error && <p>{error}</p>}
      {paginatedContent.length > 0 ? (
        <>
          <ContentList content={paginatedContent} />
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default SearchResults;