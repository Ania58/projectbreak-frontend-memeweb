/*import React from 'react';
import Images from './Images';
import Films from './Films';
import Memes from './Memes';
import Quizzes from './Quizzes';
import CategoryNavigation from './CategoryNavigation';
import TopNavigation from './TopNavigation';
import '../css/MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      <h1>Lolture</h1>
      <h2>Make our culture lol again</h2>
      <TopNavigation />
      <CategoryNavigation />
      <Images />
      <Films />
      <Memes />
      <Quizzes />
    </div>
  );
};

export default MainPage;*/


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Images from './Images';
import Films from './Films';
import Memes from './Memes';
import Quizzes from './Quizzes';
import CategoryNavigation from './CategoryNavigation';
import TopNavigation from './TopNavigation';
import '../css/MainPage.css';

const MainPage = () => {
  const [content, setContent] = useState({ films: [], images: [], memes: [], quizzes: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get('http://localhost:3000/'); // fetches all approved content 
        setContent(response.data);
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Failed to fetch content.");
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="main-page">
      <h1>Lolture</h1>
      <h2>Make our culture lol again</h2>
      <TopNavigation />
      <CategoryNavigation />
      {error && <p>{error}</p>}
      <Images images={content.images} />
      <Films films={content.films} />
      <Memes memes={content.memes} />
      <Quizzes quizzes={content.quizzes} />
    </div>
  );
};

export default MainPage;