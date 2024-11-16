import React from 'react';
import ContactForm from './ContactForm';
import '../css/AdvertisementPage.css';

const AdvertisementPage = () => {
  const handleSuccess = () => {
    alert('Your advertisement inquiry has been sent successfully!');
  };

  return (
    <div className="advertisement-page">
      <h2>Advertisement</h2>
      <ContactForm onSuccess={handleSuccess} />
    </div>
  );
};

export default AdvertisementPage;