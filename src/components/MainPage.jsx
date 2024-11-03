import React from 'react';
import Images from './Images';
import Films from './Films';
import Memes from './Memes';
import Quizzes from './Quizzes';
import '../css/MainPage.css';

const MainPage = () => {
  return (
    <div className="main-page">
      <h1>Lolture</h1>
      <h2>Make our culture lol again</h2>
      <Images />
      <Films />
      <Memes />
      <Quizzes />
    </div>
  );
};

export default MainPage;