import React from 'react';
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

export default MainPage;