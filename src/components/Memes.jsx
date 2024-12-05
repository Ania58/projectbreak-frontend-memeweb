import '../css/ContentStyles.css';
import '../css/Votings.css';
import ContentInfo from './ContentInfo';

const Memes = ({memes, onVote, hasVoted}) => {
  const baseUrl = import.meta.env.VITE_APP_API_URL.replace(/\/$/, '');
  return (
    <div className="content-container">
      {memes.map((meme) => (
        <div className="content-item" key={meme._id}>
            <p className="content-title">{meme.title}</p>
            <ContentInfo category={meme.category} tags={meme.tags} />
          <img 
            src={meme.imageUrl.startsWith('http') 
              ? meme.imageUrl 
              :`${baseUrl}${meme.imageUrl}`}
            alt={meme.title}
            className="content-image" 
          />
          <div className="voting-container">
            <p>Upvotes: {meme.upvotes} | Downvotes: {meme.downvotes}</p>
            <button className="upvote-button" onClick={(e) => onVote(1, e)} disabled={hasVoted}>+</button>
            <button className="downvote-button" onClick={(e) => onVote(-1, e)} disabled={hasVoted}>-</button>
            {hasVoted && <p className="voted-text">You have voted on this content.</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Memes;