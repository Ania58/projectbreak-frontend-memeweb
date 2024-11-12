import './App.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/MainPage'; 
import CategoryContent from './components/CategoryContent';
import PendingContent from './components/PendingContent'; 

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/category/:category" element={<CategoryContent />} />
        <Route path="/category/:category/page/:pageNumber" element={<CategoryContent />} />
        <Route path="/pending" element={<PendingContent />} />
        <Route path="/pending/page/:pageNumber" element={<PendingContent />} />
        <Route path="/page/:pageNumber" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default App;


