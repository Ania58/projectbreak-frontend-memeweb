import '../css/Memes.css';

const Memes = ({memes, onVote}) => {
  return (
    <div className="memes-container">
      {memes.map((meme) => (
        <div className="meme-item" key={meme._id}>
            <p className="meme-title">{meme.title}</p>
          <img 
            src={`http://localhost:3000${meme.imageUrl}`} 
            alt={meme.title}
            className="meme-image" 
          />
          <p>Upvotes: {meme.upvotes} | Downvotes: {meme.downvotes}</p>
          <button onClick={() => onVote(1)}>+</button>
          <button onClick={() => onVote(-1)}>-</button>
        </div>
      ))}
    </div>
  );
};

export default Memes;