import React, { useEffect } from 'react';
import '../css/RulesAndRegulationsPage.css';

const RulesAndRegulationsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="rules-page">
      <h2>Rules and Regulations</h2>
      <p>
        You can download our <a href="/rules-and-regulations.pdf" target="_blank" rel="noopener noreferrer">Rules and Regulations PDF</a>.
      </p>
    </div>
  );
};

export default RulesAndRegulationsPage;