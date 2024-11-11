import '../css/ContentStyles.css';
import '../css/Votings.css';

const Memes = ({memes, onVote}) => {
  return (
    <div className="content-container">
      {memes.map((meme) => (
        <div className="content-item" key={meme._id}>
            <p className="content-title">{meme.title}</p>
          <img 
            src={`http://localhost:3000${meme.imageUrl}`} 
            alt={meme.title}
            className="content-image" 
          />
          <div className="voting-container">
            <p>Upvotes: {meme.upvotes} | Downvotes: {meme.downvotes}</p>
            <button className="upvote-button" onClick={() => onVote(1)}>+</button>
            <button className="downvote-button" onClick={() => onVote(-1)}>-</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Memes;