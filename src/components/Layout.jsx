import React from 'react';
import Footer from './footer/Footer';
import ContentHeader from './ContentHeader';
import TopNavigation from './navigation/TopNavigation';
import CategoryNavigation from './navigation/CategoryNavigation';
import SearchBar from './searchContent/SearchBar';
import '../css/Layout.css'; 

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <ContentHeader />
      <TopNavigation />
      <CategoryNavigation />
      <SearchBar />
      <main className="content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;