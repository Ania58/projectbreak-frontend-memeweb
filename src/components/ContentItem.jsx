import React from 'react';
import Images from './Images';
import Films from './Films';
import Memes from './Memes';
import Quizzes from './Quizzes';

const ContentItem = ({ item, handleVote }) => {
  const handleItemVote = (vote) => handleVote(item._id, vote, item.type);

  if (item.questions && item.questions.length > 0) {
    return (
      <div className="quiz-container">
        <Quizzes quizzes={[item]} onVote={handleItemVote} />
      </div>
    );
  } else if (item.imageUrl) {
    return <Images images={[item]} onVote={handleItemVote} />;
  } else if (item.videoUrl) {
    return <Films films={[item]} onVote={handleItemVote} />;
  } else if (item.memeUrl) {
    return <Memes memes={[item]} onVote={handleItemVote} />;
  }
  return null;
};

export default ContentItem;