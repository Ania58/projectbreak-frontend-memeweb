import React from 'react';
import ContactForm from './ContactForm';
import '../css/ContactPage.css'; 

const ContactPage = () => {
  const handleSuccess = () => {
    alert('Your message has been sent successfully!');
  };

  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <div className="contact-container">
        <div className="form-section">
          <ContactForm onSuccess={handleSuccess} />
        </div>
        <div className="advertisement-section">
          <h3>For Advertisement Inquiries</h3>
          <p>Email us at <a href="mailto:advertisements@lolture.com">advertisements@lolture.com</a></p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;