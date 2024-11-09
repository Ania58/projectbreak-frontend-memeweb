import React, { useEffect, useState } from 'react';

const Films = ({films}) => {
  /*const [films, setFilms] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  const fetchFilms = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/films'); 
      //console.log("Fetched films data:", response.data); 
      setFilms(response.data);
    } catch (err) {
      console.error("Error fetching films:", err);
      setError("Could not fetch films. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);*/

  return (
    <div>
      {/*{loading && <p>Loading...</p>}
      {error && <p>{error}</p>}*/}
        {films.map((film) => (
          <div key={film._id}>
            <h2>{film.title}</h2>
            {film.videoUrl && <video controls src={`http://localhost:3000${film.videoUrl}`} alt={film.title} />}
          </div>
        ))}
    </div>
  );
};

export default Films;



