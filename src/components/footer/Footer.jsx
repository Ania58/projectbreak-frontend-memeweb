import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <Link to="/contact">Contact Us</Link>
        <Link to="/advertisement">Advertisement</Link>
        <Link to="/rules-and-regulations">Rules & Regulations</Link>
        <Link to="/privacy-policy">Privacy Policy</Link>
      </div>
      <div className="footer-info">
      <p>© {new Date().getFullYear()} Lolture. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;