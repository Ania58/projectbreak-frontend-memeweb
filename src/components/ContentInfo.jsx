import React from 'react';
import '../css/ContentStyles.css';

const ContentInfo = ({ category, tags }) => (
  <div className="content-info">
    <p className="content-category">Category: {category}</p>
    <p className="content-tags">
      Tags: {tags?.slice(0, 5).map((tag, i) => (
        <span key={i} className="tag-badge">#{tag}</span>
      )) || 'No tags available'}
    </p>
  </div>
);

export default ContentInfo;