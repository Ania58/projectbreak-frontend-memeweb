import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from '../MainPage'; 
import CategoryContent from '../CategoryContent';
import PendingContent from '../PendingContent'; 
import ContactPage from '../footer/ContactPage';
import AdvertisementPage from '../footer/AdvertisementPage';
import RulesAndRegulationsPage from '../footer/RulesAndRegulationsPage';
import PrivacyPolicyPage from '../footer/PrivacyPolicyPage';
import Layout from '../Layout';
import SearchResults from '../searchContent/SearchResults';
import TopContent from '../TopContent';
import AddContent from '../addNewContent/AddContent'; 
import AddFilm from '../addNewContent/AddFilm';
import AddImage from '../addNewContent/AddImage';
import AddMeme from '../addNewContent/AddMeme';
import AddQuiz from '../addNewContent/AddQuiz';
import Login from '../firebaseUser/Login';
import Register from '../firebaseUser/Register';
import Profile from '../pages/Profile';
import ProtectedRoute from '../firebaseUser/ProtectedRoute';
import { ImagesPage, FilmsPage, MemesPage, QuizzesPage } from "../pages/index";
import UserContentList from "../pages/UserContentList";

const AppRoutes = () => {
    return (
          <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/category/:category" element={<CategoryContent />} />
            <Route path="/category/:category/page/:pageNumber" element={<CategoryContent />} />
            <Route path="/pending" element={<PendingContent />} />
            <Route path="/pending/page/:pageNumber" element={<PendingContent />} />
            <Route path="/top/page/:page" element={<TopContent />} />
            <Route path="/top" element={<TopContent />} />
            <Route path="/add" element={<AddContent />} />
            <Route path="/add/films" element={<AddFilm />} />
            <Route path="/add/images" element={<AddImage />} />
            <Route path="/add/memes" element={<AddMeme />} />
            <Route path="/add/quizzes" element={<AddQuiz />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/page/:pageNumber" element={<MainPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/advertisement" element={<AdvertisementPage />} />
            <Route path="/rules-and-regulations" element={<RulesAndRegulationsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} /> 
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/images" element={<ImagesPage />} />
            <Route path="/profile/films" element={<FilmsPage />} />
            <Route path="/profile/memes" element={<MemesPage />} />
            <Route path="/profile/quizzes" element={<QuizzesPage />} />
            <Route path="/profile/images/manage" element={<UserContentList contentType="images" endpoint="/user/images" />} />
            <Route path="/profile/films/manage" element={<UserContentList contentType="films" endpoint="/user/films" />} />
            <Route path="/profile/memes/manage" element={<UserContentList contentType="memes" endpoint="/user/memes" />} />
            <Route path="/profile/quizzes/manage" element={<UserContentList contentType="quizzes" endpoint="/user/quizzes" />} />
          </Routes>
          </Layout>
      );
}

export default AppRoutes; 