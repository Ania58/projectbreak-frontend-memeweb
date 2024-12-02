import React, { useState } from 'react';
import Images from './Images';
import Films from './Films';
import Memes from './Memes';
import Quizzes from './Quizzes';


const ContentItem = ({ item, handleVote, onContentClick }) => {
  
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

  const resolveImageUrl = (url) => (url.startsWith('http') ? url : `http://localhost:3000${url}`);


  const handleItemClick = () => {
    if (onContentClick) {
      onContentClick(item); 
    }
  };


  if (item.questions && item.questions.length > 0) {
    return (
      <div className="quiz-container" onClick={handleItemClick}>
        <Quizzes quizzes={[item]} onVote={handleItemVote} hasVoted={hasVoted} />
      </div>
    );
  } else if (item.imageUrl || item.isUserGenerated) {
    const resolvedMeme = { ...item, imageUrl: resolveImageUrl(item.imageUrl) };
    return (
      <div className="meme-container" onClick={handleItemClick}>
        <Memes memes={[resolvedMeme]} onVote={handleItemVote} hasVoted={hasVoted} />
        </div>
      );
  } else if (item.imageUrl) {
    return (
      <div className="image-container" onClick={handleItemClick}>
        <Images images={[item]} onVote={handleItemVote} hasVoted={hasVoted} />
      </div>
    );
  } else if (item.videoUrl) {
    return (
      <div className="film-container" onClick={handleItemClick}>
        <Films films={[item]} onVote={handleItemVote} hasVoted={hasVoted} />
      </div>
    );
  } 
  return null;
};

export default ContentItem;