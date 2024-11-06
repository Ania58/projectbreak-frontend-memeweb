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
        <Route path="/pending" element={<PendingContent />} />
      </Routes>
    </Router>
  );
};

export default App;


