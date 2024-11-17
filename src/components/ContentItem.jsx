import React, { useState } from 'react';
import Images from './Images';
import Films from './Films';
import Memes from './Memes';
import Quizzes from './Quizzes';


const ContentItem = ({ item, handleVote }) => {
  
  const [votedItems, setVotedItems] = useState(() => {
    const storedVotes = localStorage.getItem('votedItems');
    return storedVotes ? JSON.parse(storedVotes) : [];
  });

  
  const hasVoted = votedItems.includes(item._id);

  const handleItemVote = async (vote) => {
    if (hasVoted) {
      alert("You have already voted on this content.");
      return;
    }
     
      handleVote(item._id, vote, item.type);

      const updatedVotedItems = [...votedItems, item._id];
      setVotedItems(updatedVotedItems);
      localStorage.setItem('votedItems', JSON.stringify(updatedVotedItems));
    
  };

  if (item.questions && item.questions.length > 0) {
    return (
      <div className="quiz-container">
        <Quizzes quizzes={[item]} onVote={handleItemVote} hasVoted={hasVoted} />
      </div>
    );
  } else if (item.imageUrl) {
    return <Images images={[item]} onVote={handleItemVote} hasVoted={hasVoted} />;
  } else if (item.videoUrl) {
    return <Films films={[item]} onVote={handleItemVote} hasVoted={hasVoted} />;
  } else if (item.memeUrl) {
    return <Memes memes={[item]} onVote={handleItemVote} hasVoted={hasVoted} />;
  }
  return null;
};

export default ContentItem;