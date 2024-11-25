import '../css/ContentStyles.css';
import '../css/Votings.css';
import ContentInfo from './ContentInfo';

const Memes = ({memes, onVote, hasVoted}) => {
  return (
    <div className="content-container">
      {memes.map((meme) => (
        <div className="content-item" key={meme._id}>
            <p className="content-title">{meme.title}</p>
            <ContentInfo category={meme.category} tags={meme.tags} />
          <img 
            src={meme.imageUrl.startsWith('http') 
              ? meme.imageUrl 
              : `http://localhost:3000${meme.imageUrl}`}
            alt={meme.title}
            className="content-image" 
          />
          <div className="voting-container">
            <p>Upvotes: {meme.upvotes} | Downvotes: {meme.downvotes}</p>
            <button className="upvote-button" onClick={() => onVote(1)} disabled={hasVoted}>+</button>
            <button className="downvote-button" onClick={() => onVote(-1)} disabled={hasVoted}>-</button>
            {hasVoted && <p className="voted-text">You have voted on this content.</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Memes;