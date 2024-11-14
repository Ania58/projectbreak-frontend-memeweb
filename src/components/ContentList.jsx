import React from 'react';
import ContentItem from './ContentItem';

const ContentList = ({ content, handleVote }) => (
  <div>
    {content.map((item) => (
      <ContentItem key={item._id} item={item} handleVote={handleVote} />
    ))}
  </div>
);

export default ContentList;