import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (element, index) => index + 1).reverse();

  return (
    <div className="pagination">
        {currentPage < totalPages && (
        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          style={{
            opacity: currentPage === totalPages ? 0.5 : 1, 
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Previous Page
        </button>
      )}
      {pageNumbers.map((page) => (
        <button 
          key={page} 
          onClick={() => onPageChange(page)} 
          style={{
            fontWeight: page === currentPage ? "bold" : "normal", 
            backgroundColor: page === currentPage ? "#ccc" : "transparent" 
          }}
        >
          {page}
        </button>
      ))}
       {currentPage > 1 && (
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          style={{
            opacity: currentPage === 1 ? 0.5 : 1, 
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Next Page
        </button>
      )}
    </div>
  );
};

export default Pagination;