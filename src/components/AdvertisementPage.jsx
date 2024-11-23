import React, { useEffect }  from 'react';
import ContactForm from './ContactForm';
import '../css/AdvertisementPage.css';

const AdvertisementPage = () => {
  const handleSuccess = () => {
    alert('Your advertisement inquiry has been sent successfully!');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="advertisement-page">
      <h2>Advertisement</h2>
      <ContactForm endpoint="/advertisement" onSuccess={handleSuccess} />
    </div>
  );
};

export default AdvertisementPage;