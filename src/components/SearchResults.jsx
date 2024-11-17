import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ContentList from './ContentList';
import Pagination from './Pagination';
import '../css/SearchResults.css';
import '../css/ContentStyles.css'; 

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

  const handleVote = async (contentId, vote, type) => {
    try {
      const endpoint = `http://localhost:3000/${type === 'quiz' ? 'quizzes' : `${type}s`}/${contentId}/vote`;
      const response = await axios.post(endpoint, { vote });
      setContent((prevContent) =>
        prevContent.map((item) =>
          item._id === contentId ? { ...item, upvotes: response.data.upvotes, downvotes: response.data.downvotes } : item
        )
      );
    } catch (error) {
      console.error("Error updating vote:", error);
    }
  };

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/content/search?query=${encodeURIComponent(query)}`);
        const allContent = response.data.content;

        const contentWithTypes = allContent.map((item) => {
          let type;
          if (item.questions && item.questions.length > 0) {
            type = 'quiz';
          } else if (item.imageUrl) {
            type = 'image';
          } else if (item.videoUrl) {
            type = 'film';
          } else if (item.isUserGenerated || item.category === 'memes') {
            type = 'meme';
          }
  
          if (!type) {
            console.error(`Item with ID ${item._id} has no valid type!`, item);
          }
  
          return { ...item, type };
        });

        const totalPages = Math.ceil(contentWithTypes.length / itemsPerPage)
        setTotalPages(totalPages);
        setContent(contentWithTypes);
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
          <ContentList content={paginatedContent} handleVote={handleVote}  />
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