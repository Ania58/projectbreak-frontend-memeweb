import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from '../MainPage'; 
import CategoryContent from '../CategoryContent';
import PendingContent from '../PendingContent'; 
import ContactPage from '../ContactPage';
import AdvertisementPage from '../AdvertisementPage';
import RulesAndRegulationsPage from '../RulesAndRegulationsPage';
import PrivacyPolicyPage from '../PrivacyPolicyPage';
import Layout from '../Layout';
import SearchResults from '../SearchResults';
import TopContent from '../TopContent';
import AddContent from '../AddContent'; 
import AddFilm from '../AddFilm';
import AddImage from '../AddImage';
import AddMeme from '../AddMeme';
import AddQuiz from '../AddQuiz';

const AppRoutes = () => {
    return (
        <Router>
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
          </Routes>
          </Layout>
        </Router>
      );
}

export default AppRoutes; 