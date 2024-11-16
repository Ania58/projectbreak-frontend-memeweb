import React from 'react';
import Footer from './Footer';
import ContentHeader from './ContentHeader';
import TopNavigation from './TopNavigation';
import CategoryNavigation from './CategoryNavigation';
import '../css/Layout.css'; 

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <ContentHeader />
      <TopNavigation />
      <CategoryNavigation />
      <main className="content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;