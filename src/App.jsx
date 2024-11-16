import './App.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage'; 
import CategoryContent from './components/CategoryContent';
import PendingContent from './components/PendingContent'; 
import ContactPage from './components/ContactPage';
import AdvertisementPage from './components/AdvertisementPage';
import RulesAndRegulationsPage from './components/RulesAndRegulationsPage';
import PrivacyPolicyPage from './components/PrivacyPolicyPage';
import Layout from './components/Layout';
import SearchResults from './components/SearchResults';

const App = () => {
  return (
    <Router>
      <Layout>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/category/:category" element={<CategoryContent />} />
        <Route path="/category/:category/page/:pageNumber" element={<CategoryContent />} />
        <Route path="/pending" element={<PendingContent />} />
        <Route path="/pending/page/:pageNumber" element={<PendingContent />} />
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
};

export default App;


