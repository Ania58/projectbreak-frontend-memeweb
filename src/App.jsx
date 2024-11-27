import './App.css'
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/routes/AppRoutes';
import UserProvider from './contexts/UserContext';

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppRoutes />
      </Router>
    </UserProvider>
    
  );
};

export default App;


