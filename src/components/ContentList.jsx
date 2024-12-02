import React from 'react';
import ContentItem from './ContentItem';

const ContentList = ({ content, handleVote, onContentClick  }) => (
  <div>
    {content.map((item) => (
      <ContentItem key={item._id} item={item} handleVote={handleVote} onContentClick={onContentClick} />
    ))}
  </div>
);

export default ContentList;