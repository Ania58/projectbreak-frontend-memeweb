import { useState, useEffect } from "react";
import axios from "../../axiosConfig";

function Posts() {
  const [posts, setPosts] = useState([]); 
  const [content, setContent] = useState(""); 

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/posts");
        setPosts(Array.isArray(response.data) ? response.data : []); 
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/posts", { content });
      setPosts((prevPosts) => [...prevPosts, response.data]); 
      setContent(""); 
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div>
      <h2>Your Posts</h2>
      <form onSubmit={handlePostSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write something..."
        />
        <button type="submit">Post</button>
      </form>
      <div>
        {posts.map((post, index) => (
          <div key={index}>
            <p>{post.content}</p>
            <small>{new Date(post.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Posts;
